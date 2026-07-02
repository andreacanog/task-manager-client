import { useState } from "react";
import TaskModal from "./TaskModal";
import { Calendar } from "lucide-react"
import { TaskType } from "../types";

interface TaskProps {
    task: TaskType
    onToggle: (task: TaskType) => void
    onDelete: (taskId: string) => void
    onUpdate: (taskId: string, newTitle: string, newDescription: string, newDate: string | null) => void
}

function Task({ task, onToggle, onDelete, onUpdate }: TaskProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="bg-white rounded p-2 flex items-center gap-2 shadow-sm">
            <button
                onClick={() => onToggle(task)}
                className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition ${
                    task.completed
                        ? "bg-blue-500 border-blue-500"
                        : "border-gray-300 hover:border-blue-400"
                }`}
            >
                {task.completed && <span className="text-white text-xs">✓</span>}
            </button>
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
