from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.core import security
from app.core.config import settings
from app.crud import crud_user
from app.schemas.token import Token
from app.core.logging_config import logger
from app.schemas.user import User, UserCreate

router = APIRouter()

@router.post("/access-token", response_model=Token)
async def login_access_token(
    db: AsyncSession = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = await crud_user.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        logger.warning("login_failed", email=form_data.username, reason="invalid_credentials")
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        logger.warning("login_failed", email=form_data.username, reason="inactive_user")
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    logger.info("login_success", user_id=user.id, email=user.email)
    
    return {
        "access_token": security.create_access_token(
            user.email, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/register", response_model=User)
async def register(
    *,
    db: AsyncSession = Depends(deps.get_db),
    user_in: UserCreate,
) -> Any:
    """
    Create new user.
    """
    user = await crud_user.get_user_by_email(db, email=user_in.email)
    if user:
        logger.warning("registration_failed", email=user_in.email, reason="email_exists")
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )
    user = await crud_user.create_user(db, user_in)
    logger.info("user_registered", user_id=user.id, email=user.email)
    return user
