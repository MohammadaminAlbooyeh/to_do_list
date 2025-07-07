import functions
import PySimpleGUI as sg
from pathlib import Path

FILEPATH = Path(__file__).resolve().parent.parent / "files" / "todos.txt"

def main():
    window = sg.Window(
        "To-Do List",
        layout=[
            [sg.Text("Enter a to-do item:", text_color="white", background_color="black")],
            [sg.InputText(key="todo_input", text_color="black", background_color="lightyellow")],
            [
                sg.Button("Add", button_color=("white", "green")),
                sg.Button("Show", button_color=("white", "blue")),
                sg.Button("Edit", button_color=("black", "yellow")),
                sg.Button("Complete", button_color=("white", "red")),
                sg.Button("Exit", button_color=("white", "gray")),
            ],
            [
                sg.Listbox(
                    values=functions.get_todos(FILEPATH),
                    size=(40, 10),
                    key="todo_list",
                    text_color="blue",
                    background_color="lightgray"
                )
            ],
            [sg.Text("Status:", size=(10, 1), text_color="black", background_color="lightyellow"),
             sg.Text("", key="status", text_color="black", background_color="lightyellow")],
        ],
        background_color="lightblue"
    )
    todos = functions.get_todos(FILEPATH)

    while True:
        event, values = window.read()
        if event in (sg.WINDOW_CLOSED, "Exit"):
            break

        if event == "Add":
            new_todo = values["todo_input"].strip()
            if new_todo:
                todos.append(new_todo)
                functions.save_todos(todos, FILEPATH)
                window["todo_list"].update(todos)
                window["status"].update(f"Added: {new_todo}")
            else:
                window["status"].update("Nothing entered.")

        elif event == "Show":
            todos = functions.get_todos(FILEPATH)
            window["todo_list"].update(todos)
            window["status"].update("List updated.")

        elif event == "Edit":
            selected = values["todo_list"]
            if selected:
                new_text = values["todo_input"].strip()
                if new_text:
                    index = todos.index(selected[0])
                    todos[index] = new_text
                    functions.save_todos(todos, FILEPATH)
                    window["todo_list"].update(todos)
                    window["status"].update(f"Edited: {selected[0]} to {new_text}")
                else:
                    window["status"].update("No new text entered.")
            else:
                window["status"].update("Select an item to edit.")

        elif event == "Complete":
            selected = values["todo_list"]
            if selected:
                todos.remove(selected[0])
                functions.save_todos(todos, FILEPATH)
                window["todo_list"].update(todos)
                window["status"].update(f"Completed: {selected[0]}")
            else:
                window["status"].update("Select an item to complete.")

    window.close()

if __name__ == "__main__":
    main()
    print("Bye!")
