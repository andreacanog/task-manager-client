import { useState } from "react";

function Task({ task, onToggle, onDelete, onUpdate}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingTitle, setEditingTitle] = useState("");


    const handleEditClick = async (e) => {
        e.stopPropagation()
        setIsEditing(true)
        setEditingTitle(task.title)
    }

    const handleUpdateTask = async () => {
        await onUpdate(task.id, editingTitle)
        setIsEditing(false)
        setEditingTitle("")
    }

    return (
        <div className="bg-white rounded p-2 flex justify-between items-center shadow-sm">
            {isEditing ? (
                <input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={handleUpdateTask}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            handleUpdateTask()
                        }
                    }}
                    onClick={(e) => e.stopPropagation()}
                />
            ) : (
                <span
                    onClick={() => onToggle(task)}
                    className={`text-sm cursor-pointer flex-1 ${
                        task.completed 
                            ? "line-through text-gray-400" 
                            : "text-gray-700"
                    }`  }
                >
                    {task.title}
                </span>
            )}

            <div className="flex gap-1 ml-2">
                    <button onClick={(e) => handleEditClick(e)} className="text-gray-400 hover:text-blue-500 text-xs transition">✏️</button>
                    <button onClick={() => onDelete(task.id)} className="text-gray-400 hover:text-red-500 text-xs transition">✕</button>
            </div>
        </div>

    )

}

export default Task;
