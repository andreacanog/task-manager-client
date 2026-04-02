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

const UPDATE_LIST = gql`
    mutation UpdateList($title: String!, $id: ID!) {
        updateList(input: { title: $title, id: $id }) {
            list {
                id
                title
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
    const [isEditing, setIsEditing] = useState(false)
    const [editingTitle, setEditingTitle] = useState("")

    const [createTask] = useMutation(CREATE_TASK, {
        refetchQueries: refetchBoard,
    });
    
    const [updateTask] = useMutation(UPDATE_TASK, {
        refetchQueries: refetchBoard,
    });

    const [updateList] = useMutation(UPDATE_LIST, {
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

    const handleEditClick = async (e) => {
        e.stopPropagation()
        setIsEditing(true)
        setEditingTitle(list.title)
    }

    const handleUpdateList = async (e) => {
        await updateList({ variables: { id: list.id, title: editingTitle}})
        setIsEditing(false)
        setEditingTitle("")
    }

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
            <div className="bg-gray-200 rounded-lg p-3 w-64 flex-shrink-0">
                {isEditing ? (
                    <input
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onBlur={(e) => handleUpdateList(e)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault()
                                handleUpdateList(e)
                            }    
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="font-semibold text-gray-700 rounded px-1 w-full"
                        autoFocus
                    />
                ) : (
                        <h3 className="font-semibold text-gray-700 mb-3">{list.title}</h3>
                )}

                <div className="flex gap-1 ml-2">
                    <button onClick={(e) => handleEditClick(e)} className="text-gray-400 hover:text-blue-500 text-xs transition">✏️</button>
                    <button onClick={() => handleDeleteList(list.id)} className="text-gray-400 hover:text-red-500 text-xs transition">✕</button>
                </div>
            </div>

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
