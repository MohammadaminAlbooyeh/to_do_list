import streamlit as st
from function_db import get_todos, add_todo, delete_todo, init_db

# Initialize DB (run once per session)
init_db()

st.set_page_config(page_title="To-Do List", page_icon="✅", layout="centered")
st.title("📝 To-Do List")

if "todos" not in st.session_state:
    st.session_state.todos = get_todos()

def add_todo_streamlit():
    todo = st.session_state.new_todo.strip()
    if todo:
        add_todo(todo)
        st.session_state.todos = get_todos()
        st.session_state.new_todo = ""

def complete_todo(idx):
    todo_text = st.session_state.todos[idx]
    delete_todo(todo_text)
    st.session_state.todos = get_todos()

st.text_input("Add a new to-do:", key="new_todo", on_change=add_todo_streamlit)

st.write("### Your Todos:")
for i, todo in enumerate(st.session_state.todos):
    col1, col2 = st.columns([0.85, 0.15])
    with col1:
        st.write(f"{i+1}. {todo}")
    with col2:
        if st.button("✅ Done", key=f"done_{i}"):
            complete_todo(i)
            st.experimental_rerun()
