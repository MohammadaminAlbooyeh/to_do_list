from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Field, Session, SQLModel, create_engine, select, func
from typing import List, Optional
from sqlalchemy import text
from datetime import datetime

# Database setup
DATABASE_URL = "sqlite:///./data/todo.db"
engine = create_engine(DATABASE_URL, echo=True)

# Models
class Todo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    done: bool = False
    priority: str = Field(default="medium")
    due_date: Optional[str] = None
    category: Optional[str] = Field(default="Personal")
    tags: Optional[str] = None
    archived: bool = Field(default=False)
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())

# Pydantic models for API
class TodoCreate(SQLModel):
    title: str
    priority: str = "medium"
    due_date: Optional[str] = None
    category: Optional[str] = "Personal"
    tags: Optional[str] = None

class TodoUpdate(SQLModel):
    title: Optional[str] = None
    done: Optional[bool] = None
    priority: Optional[str] = None
    due_date: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    archived: Optional[bool] = None

# FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database migration
@app.on_event("startup")
def migrate():
    with engine.connect() as conn:
        columns = [
            ("priority", "TEXT NOT NULL DEFAULT 'medium'"),
            ("due_date", "TEXT"),
            ("category", "TEXT DEFAULT 'Personal'"),
            ("tags", "TEXT"),
            ("archived", "BOOLEAN DEFAULT 0"),
            ("created_at", "TEXT")
        ]
        for col, definition in columns:
            try:
                conn.execute(text(f"ALTER TABLE todo ADD COLUMN {col} {definition}"))
                conn.commit()
            except Exception:
                pass  # column already exists

# Create tables
SQLModel.metadata.create_all(engine)

# Routes
@app.get("/todos", response_model=List[Todo])
def get_todos(archived: bool = False):
    with Session(engine) as session:
        statement = select(Todo).where(Todo.archived == archived)
        todos = session.exec(statement).all()
        return todos

@app.get("/stats")
def get_stats():
    with Session(engine) as session:
        total = session.exec(select(func.count(Todo.id))).one()
        completed = session.exec(select(func.count(Todo.id)).where(Todo.done == True)).one()
        pending = total - completed
        
        # Get count by category
        categories = session.execute(text("SELECT category, COUNT(*) FROM todo GROUP BY category")).all()
        cat_stats = {row[0]: row[1] for row in categories}
        
        return {
            "total": total,
            "completed": completed,
            "pending": pending,
            "categories": cat_stats
        }

@app.post("/todos", response_model=Todo)
def create_todo(todo: TodoCreate):
    with Session(engine) as session:
        db_todo = Todo(**todo.dict())
        session.add(db_todo)
        session.commit()
        session.refresh(db_todo)
        return db_todo

@app.put("/todos/{todo_id}", response_model=Todo)
def update_todo(todo_id: int, todo_update: TodoUpdate):
    with Session(engine) as session:
        todo = session.exec(select(Todo).where(Todo.id == todo_id)).first()
        if not todo:
            raise HTTPException(status_code=404, detail="Todo not found")

        update_data = todo_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(todo, key, value)

        session.add(todo)
        session.commit()
        session.refresh(todo)
        return todo

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int):
    with Session(engine) as session:
        todo = session.exec(select(Todo).where(Todo.id == todo_id)).first()
        if not todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        
        session.delete(todo)
        session.commit()
        return {"message": "Todo deleted"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5050)
