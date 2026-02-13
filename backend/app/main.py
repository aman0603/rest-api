from contextlib import asynccontextmanager
import time
import uuid
import structlog
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.api.api import api_router
from app.core.config import settings
from app.db.session import engine
from app.db.base import Base
from app.core.logging_config import setup_logging, logger

setup_logging()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Application startup complete")
    yield
    logger.info("Application shutdown complete")

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    request_id = str(uuid.uuid4())
    start_time = time.time()
    
    # Bind context vars
    structlog.contextvars.clear_contextvars()
    structlog.contextvars.bind_contextvars(
        request_id=request_id,
        method=request.method,
        path=request.url.path,
        client_ip=request.client.host if request.client else "unknown",
    )
    
    # Debug Auth Header
    auth_header = request.headers.get("Authorization")
    if auth_header:
        logger.info("auth_header_present", prefix=auth_header[:7] if auth_header else "None")
    else:
        logger.info("auth_header_missing", path=request.url.path)

    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        
        logger.info(
            "request_processed",
            status_code=response.status_code,
            process_time=f"{process_time:.4f}s"
        )
        return response
    except Exception as e:
        process_time = time.time() - start_time
        logger.error(
            "request_failed",
            error=str(e),
            process_time=f"{process_time:.4f}s"
        )
        raise e

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    # allow_origins=["*"],  # Don't use * with credentials
    allow_origin_regex="https?://.*", # Allow all http/https origins (for dev/demo purposes)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": "Welcome to Scalable REST API"}
