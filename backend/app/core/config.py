from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Scalable REST API"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@localhost/app_db"
    
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
        
        # asyncpg doesn't support sslmode in kwargs, handle it via connect_args
        if "sslmode=" in uri:
            uri = uri.split("?")[0] # Basic stripping, assuming it's the only param or safest to strip all for now. 
            # Or use more robust replacement:
            # import re
            # uri = re.sub(r"\?sslmode=[^&]+", "", uri)
            # uri = re.sub(r"&sslmode=[^&]+", "", uri)
            # Simpler:
            if "?" in uri and "sslmode" in uri:
                 # Just drop params to be safe if mostly sslmode
                 uri = uri.split("?")[0]
                 
        return uri
    
    class Config:
        env_file = ".env"

settings = Settings()
