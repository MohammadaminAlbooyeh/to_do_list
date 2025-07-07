import streamlit as st
from functions import get_todos, save_todos
from pathlib import Path

FILEPATH = Path(__file__).resolve().parent.parent / "files" / "todos.txt"

st.set_page_config(page_title="To-Do List", page_icon="✅", layout="centered")
st.title("📝 To-Do List")

if "todos" not in st.session_state:
    st.session_state.todos = get_todos(FILEPATH)

def add_todo():
    todo = st.session_state.new_todo.strip()
    if todo:
        st.session_state.todos.append(todo)
        save_todos(st.session_state.todos, FILEPATH)
        st.session_state.new_todo = ""

def complete_todo(idx):
    st.session_state.todos.pop(idx)
    save_todos(st.session_state.todos, FILEPATH)

st.text_input("Add a new to-do:", key="new_todo", on_change=add_todo)

st.write("### Your Todos:")
for i, todo in enumerate(st.session_state.todos):
    col1, col2 = st.columns([0.85, 0.15])
    with col1:
        st.write(f"{i+1}. {todo}")
    with col2:
        if st.button("✅ Done", key=f"done_{i}"):
            complete_todo(i)
            st.experimental_rerun()
