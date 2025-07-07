from pathlib import Path
from functions import get_todos, save_todos
import time


now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
print(f"Current time: {now}")


user_prompt = "Enter to do: "

# Define the file path relative to the project root
base_dir = Path(__file__).resolve().parent.parent
file_path = base_dir / "files" / "todos.txt"

# Load todos initially
todos = get_todos(file_path)

while True:
    print("\nEnter a number:")
    print("1 - Add")
    print("2 - Show")
    print("3 - Edit")
    print("4 - Complete")
    print("5 - Exit")

    action = input("Your choice: ").strip()

    match action:
        case "1":
            todo = input(user_prompt).strip()
            if todo:
                todos.append(todo)
                save_todos(file_path, todos)
                print(f"Added: {todo}")
            else:
                print("No todo added.")
        case "2":
            if todos:
                print("Your todos:")
                for index, item in enumerate(todos, start=1):
                    print(f"{index}. {item}")
            else:
                print("No todos found.")
        case "3":
            if todos:
                index = input("Enter the number of the todo to edit: ").strip()
                try:
                    index = int(index) - 1
                    if 0 <= index < len(todos):
                        new_todo = input("Enter the new todo: ").strip()
                        if new_todo:
                            todos[index] = new_todo
                            save_todos(file_path, todos)
                            print(f"Updated todo {index + 1} to: {new_todo}")
                        else:
                            print("No todo updated.")
                    else:
                        print("Invalid todo number.")
                except ValueError:
                    print("Please enter a valid number.")
            else:
                print("No todos to edit.")
        case "4":
            if todos:
                index = input("Enter the number of the todo to complete: ").strip()
                try:
                    index = int(index) - 1
                    if 0 <= index < len(todos):
                        completed_todo = todos.pop(index)
                        save_todos(file_path, todos)
                        print(f"Completed and removed todo: {completed_todo}")
                    else:
                        print("Invalid todo number.")
                except ValueError:
                    print("Please enter a valid number.")
            else:
                print("No todos to complete.")
        case "5":
            break
        case _:
            print("Invalid choice. Please enter 1-5.")

print("Goodbye!")


if __name__ == "__main__":
    # This block is only executed when the script is run directly, not when imported.
    pass
# This allows for easier testing and modularity.