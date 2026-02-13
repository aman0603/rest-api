from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Scalable REST API"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str
    
    # Security
    SECRET_KEY: str = "supersecretkeyneedschange"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        if not self.DATABASE_URL:
            return None
        uri = self.DATABASE_URL
        if uri.startswith("postgres://"):
            uri = uri.replace("postgres://", "postgresql+asyncpg://", 1)
        elif uri.startswith("postgresql://"):
            uri = uri.replace("postgresql://", "postgresql+asyncpg://", 1)
            
        # Strip sslmode if present, as asyncpg doesn't support it in connect() kwargs
        if "?" in uri:
            base, query = uri.split("?", 1)
            params = query.split("&")
            filtered = [p for p in params if not p.startswith("sslmode=") and not p.startswith("channel_binding=")]
            if filtered:
                uri = f"{base}?{'&'.join(filtered)}"
            else:
                uri = base
        
        return uri
    
    class Config:
        env_file = ".env"

settings = Settings()
