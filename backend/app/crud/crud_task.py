from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate

async def get_task(db: AsyncSession, task_id: int) -> Optional[Task]:
    result = await db.execute(select(Task).filter(Task.id == task_id))
    return result.scalars().first()

async def get_tasks_by_owner(db: AsyncSession, owner_id: int, skip: int = 0, limit: int = 100) -> List[Task]:
    result = await db.execute(select(Task).filter(Task.owner_id == owner_id).offset(skip).limit(limit))
    return result.scalars().all()

async def get_all_tasks(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Task]:
    result = await db.execute(select(Task).offset(skip).limit(limit))
    return result.scalars().all()

async def create_task(db: AsyncSession, task: TaskCreate, owner_id: int) -> Task:
    db_task = Task(**task.model_dump(), owner_id=owner_id)
    db.add(db_task)
    await db.commit()
    await db.refresh(db_task)
    return db_task

async def remove_task(db: AsyncSession, task_id: int) -> Optional[Task]:
    task = await get_task(db, task_id)
    if task:
        await db.delete(task)
        await db.commit()
    return task

async def remove_task_obj(db: AsyncSession, task: Task) -> Task:
    await db.delete(task)
    await db.commit()
    return task
