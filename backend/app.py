from fastapi import FastAPI, HTTPException
from sqlmodel import Field, Session, SQLModel, create_engine, select
from typing import List, Optional

# Database setup
DATABASE_URL = "sqlite:///./todo.db"
engine = create_engine(DATABASE_URL, echo=True)

# Models
class Todo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    done: bool = False

# Pydantic models for API
class TodoCreate(SQLModel):
    title: str

class TodoUpdate(SQLModel):
    title: Optional[str] = None
    done: Optional[bool] = None

# Create tables
SQLModel.metadata.create_all(engine)

# FastAPI app
app = FastAPI()

# Routes
@app.get("/todos", response_model=List[Todo])
def get_todos():
    with Session(engine) as session:
        todos = session.exec(select(Todo)).all()
        return todos

@app.post("/todos", response_model=Todo)
def create_todo(todo: TodoCreate):
    with Session(engine) as session:
        db_todo = Todo(title=todo.title)
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
