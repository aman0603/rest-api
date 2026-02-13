import asyncio
import logging
from app.db.session import AsyncSessionLocal
from app.core.security import get_password_hash
from app.models.user import User
from app.core.logging_config import setup_logging

setup_logging()
logger = logging.getLogger(__name__)

async def create_superuser():
    async with AsyncSessionLocal() as db:
        try:
            email = input("Enter superuser email: ")
            password = input("Enter superuser password: ")
            
            # Check if user exists
            from sqlalchemy.future import select
            result = await db.execute(select(User).filter(User.email == email))
            user = result.scalars().first()
            
            if user:
                print(f"User {email} already exists.")
                # Optional: Update to superuser if exists
                if not user.is_superuser:
                    confirm = input("User exists. Promote to superuser? (y/n): ")
                    if confirm.lower() == 'y':
                        user.is_superuser = True
                        await db.commit()
                        print(f"User {email} promoted to superuser.")
            else:
                hashed_password = get_password_hash(password)
                user = User(
                    email=email,
                    hashed_password=hashed_password,
                    is_active=True,
                    is_superuser=True
                )
                db.add(user)
                await db.commit()
                print(f"Superuser {email} created successfully.")
                
        except Exception as e:
            print(f"Error creating superuser: {e}")

if __name__ == "__main__":
    asyncio.run(create_superuser())
