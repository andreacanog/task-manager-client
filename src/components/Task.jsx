import { useState } from "react";
import TaskModal from "./TaskModal";
import { Calendar } from "lucide-react"

function Task({ task, onToggle, onDelete, onUpdate }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="bg-white rounded p-2 flex justify-between items-center shadow-sm">
            <div className="flex flex-col flex-1">
                <span
                    onClick={() => setIsModalOpen(true)}
                    className={`text-sm cursor-pointer ${
                        task.completed
                            ? "line-through text-gray-400"
                            : "text-gray-700"
                    }`}
                >
                    {task.title}
                </span>
                {task.dueDate && (
                    <span className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                        <Calendar size={12} />
                        {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                )}
            </div>
            <button
                onClick={() => onToggle(task)}
                className="text-gray-400 hover:text-blue-500 text-xs transition ml-2"
            >
                ✓
            </button>
            {isModalOpen && (
                <TaskModal
                    task={task}
                    onClose={() => setIsModalOpen(false)}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                />
            )}
        </div>
    )
}

export default Task;
