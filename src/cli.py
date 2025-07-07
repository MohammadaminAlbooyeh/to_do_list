from pathlib import Path
from functions import get_todos, save_todos
import time

# Define file path relative to project root
FILEPATH = Path(__file__).resolve().parent.parent / "files" / "todos.txt"

def main():
    now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
    print(f"Current time: {now}")

    user_prompt = "Enter to do: "

    # Load todos initially
    todos = get_todos(FILEPATH)

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
                    save_todos(todos, FILEPATH)
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
                                save_todos(todos, FILEPATH)
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
                            save_todos(todos, FILEPATH)
                            print(f"Completed and removed todo: {completed_todo}")
                        else:
                            print("Invalid todo number.")
                    except ValueError:
                        print("Please enter a valid number.")
                else:
                    print("No todos to complete.")
            case "5":
                print("Goodbye!")
                break
            case _:
                print("Invalid choice. Please enter 1-5.")

if __name__ == "__main__":
    main()
