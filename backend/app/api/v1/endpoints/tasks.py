from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.crud import crud_task
from app.models.user import User
from app.schemas.task import Task, TaskCreate
from app.core.logging_config import logger

router = APIRouter()

@router.get("/", response_model=List[Task])
async def read_tasks(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve tasks.
    """
    if current_user.is_superuser:
        tasks = await crud_task.get_all_tasks(db, skip=skip, limit=limit)
    else:
        tasks = await crud_task.get_tasks_by_owner(
            db, owner_id=current_user.id, skip=skip, limit=limit
        )
    return tasks

@router.post("/", response_model=Task)
async def create_task(
    *,
    db: AsyncSession = Depends(deps.get_db),
    task_in: TaskCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new task.
    """
    task = await crud_task.create_task(db=db, task=task_in, owner_id=current_user.id)
    logger.info("task_created", task_id=task.id, owner_id=current_user.id, title=task.title)
    return task

@router.get("/{id}", response_model=Task)
async def read_task(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get task by ID.
    """
    task = await crud_task.get_task(db=db, task_id=id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if not current_user.is_superuser and (task.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return task

@router.delete("/{id}", response_model=Task)
async def delete_task(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete a task.
    """
    task = await crud_task.get_task(db=db, task_id=id)
    if not task:
        logger.warning("task_delete_failed", task_id=id, user_id=current_user.id, reason="not_found")
        raise HTTPException(status_code=404, detail="Task not found")
    if not current_user.is_superuser and (task.owner_id != current_user.id):
        logger.warning(
            "task_delete_failed", 
            task_id=id, 
            user_id=current_user.id, 
            reason="permission_denied"
        )
        raise HTTPException(status_code=400, detail="Not enough permissions")
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    # Use the task object we already fetched to avoid race conditions
    task = await crud_task.remove_task_obj(db=db, task=task)
    
    logger.info("task_deleted", task_id=id, user_id=current_user.id)
    return task
