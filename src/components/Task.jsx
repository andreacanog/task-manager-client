import { useState } from "react";
import TaskModal from "./TaskModal";

function Task({ task, onToggle, onDelete, onUpdate}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="bg-white rounded p-2 flex justify-between items-center shadow-sm">
            <span
                onClick={() => setIsModalOpen(true)}
                className={`text-sm cursor-pointer flex-1 ${
                    task.completed
                        ? "line-through text-gray-400"
                        : "text-gray-700"
                }`}
            >
                {task.title}
            </span>
            <button
                onClick={() => onToggle(task)}
                className="text-gray-400 hover:text-blue-500 text-xs transition"
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
