import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Trash2, Calendar, AlignLeft, Type } from "lucide-react";
import { TaskType } from "../types";

interface TaskModalProps {
  task: TaskType
  onClose: () => void
  onDelete: (taskId: string) => void
  onUpdate: (taskId: string, newTitle: string, newDescription: string, newDueDate: string | null) => void
}

function TaskModal({ task, onClose, onUpdate, onDelete }: TaskModalProps) {
    const [editingTitle, setEditingTitle] = useState(task.title);
    const [editingDescription, setEditingDescription] = useState(task.description || "");
    const [editingDueDate, setEditingDueDate] = useState(task.dueDate || "");

    const handleSave = async () => {
        await onUpdate(task.id, editingTitle, editingDescription, editingDueDate || null);
        onClose();
    };

    return createPortal(
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-white font-semibold text-lg">Edit Task</h2>
                    <button onClick={onClose} className="text-blue-200 hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">
                    {/* Title */}
                    <div>
                        <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            <Type size={12} /> Title
                        </label>
                        <input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            <AlignLeft size={12} /> Description
                        </label>
                        <textarea
                            value={editingDescription}
                            onChange={(e) => setEditingDescription(e.target.value)}
                            placeholder="Add a description..."
                            rows={4}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            <Calendar size={12} /> Due Date
                        </label>
                        <input
                            type="date"
                            value={editingDueDate}
                            onChange={(e) => setEditingDueDate(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between">
                    <button
                        onClick={() => onDelete(task.id)}
                        className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium transition"
                    >
                        <Trash2 size={14} /> Delete task
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-lg font-medium transition"
                    >
                        Save changes
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default TaskModal;
