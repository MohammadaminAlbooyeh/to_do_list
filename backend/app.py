from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Field, Session, SQLModel, create_engine, select
from typing import List, Optional
from sqlalchemy import text

# Database setup
DATABASE_URL = "sqlite:///./todo.db"
engine = create_engine(DATABASE_URL, echo=True)

# Models
class Todo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    done: bool = False
    priority: str = Field(default="medium")

# Pydantic models for API
class TodoCreate(SQLModel):
    title: str
    priority: str = "medium"

class TodoUpdate(SQLModel):
    title: Optional[str] = None
    done: Optional[bool] = None
    priority: Optional[str] = None

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
        try:
            conn.execute(text("ALTER TABLE todo ADD COLUMN priority TEXT NOT NULL DEFAULT 'medium'"))
            conn.commit()
        except Exception:
            pass  # column already exists

# Create tables
SQLModel.metadata.create_all(engine)

# Routes
@app.get("/todos", response_model=List[Todo])
def get_todos():
    with Session(engine) as session:
        todos = session.exec(select(Todo)).all()
        return todos

@app.post("/todos", response_model=Todo)
def create_todo(todo: TodoCreate):
    with Session(engine) as session:
        db_todo = Todo(title=todo.title, priority=todo.priority)
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

        if todo_update.title is not None:
            todo.title = todo_update.title
        if todo_update.done is not None:
            todo.done = todo_update.done
        if todo_update.priority is not None:
            todo.priority = todo_update.priority

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
