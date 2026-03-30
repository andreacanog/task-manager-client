import { useMutation, gql } from "@apollo/client";
import { useState } from "react";
import Task from "./Task";

const CREATE_TASK = gql`
    mutation CreateTask($title: String!, $listId: ID!) {
        createTask(input: { title: $title, listId: $listId }) {
            task {
                id
                title
                completed
            }
            errors
        }
    }
`;
const UPDATE_TASK = gql`
    mutation UpdateTask($id: ID!, $completed: Boolean) {
        updateTask(input: { id: $id, completed: $completed }) {
            task {
                id
                completed
            }
            errors
        }
    }
`;

const DELETE_TASK = gql`
    mutation DeleteTask($id: ID!) {
        deleteTask(input: { id: $id }) {
            success
            errors
        }
    }
`;

const DELETE_LIST = gql`
    mutation DeleteList($id: ID!) {
        deleteList(input: { id: $id }) {
            success
            errors
        }
    }
`;



function List({ list, refetchBoard }) {
    const [newTaskTitle, setNewTaskTitle] = useState("");

    const [createTask] = useMutation(CREATE_TASK, {
        refetchQueries: refetchBoard,
    });
    const [updateTask] = useMutation(UPDATE_TASK, {
        refetchQueries: refetchBoard,
    });

    const [deleteTask] = useMutation(DELETE_TASK, {
        refetchQueries: refetchBoard,
    });


    const [deleteList] = useMutation(DELETE_LIST, {
        refetchQueries: refetchBoard,
    });

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle?.trim()) return;
        await createTask({ variables: { title: newTaskTitle, listId: list.id } });
        setNewTaskTitle("");
    };

    const handleToggleTask = async (task) => {
        await updateTask({ variables: { id: task.id, completed: !task.completed } });
    };

    const handleDeleteTask = async (taskId) => {
        await deleteTask({ variables: { id: taskId } });
    };

    const handleDeleteList = async (listId) => {
        await deleteList({ variables: { id: listId } })
    }

    return (
        <div className="bg-gray-200 rounded-lg p-3 w-64 flex-shrink-0">
            <h3 className="font-semibold text-gray-700 mb-3">{list.title}</h3>
            <button
                onClick={() => handleDeleteList(list.id)}
                className="text-gray-400 hover:text-red-500 ml-2 text-xs transition"
                >
                    ✕
            </button>

            {/* Tasks */}
            <div className="space-y-2 mb-3">
                {list.tasks.map((task) => (
                    <Task
                        key={task.id}
                        task={task}
                        onToggle={handleToggleTask}
                        onDelete={handleDeleteTask}
                    />
                ))}
            </div>

            {/* Add task form */}
            <form onSubmit={handleCreateTask}>
                <input
                    type="text"
                    placeholder="Add a task..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm mb-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 rounded transition"
                >
                    + Add Task
                </button>
            </form>
        </div>
    );

}

export default List;
