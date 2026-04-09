import { useState } from "react";

function TaskModal({ task, onClose, onUpdate, onDelete }) {
    const [editingTitle, setEditingTitle] = useState(task.title);
    const [editingDescription, setEditingDescription] = useState(task.description || "")
    const [editingDueDate, setEditingDueDate] = useState(task.dueDate || "")

    const handleSave = async () => {
        await onUpdate(task.id, editingTitle, editingDescription, editingDueDate)
        onClose()
    }

    return (
        <div    className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50"            
                onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Edit Task</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                </div>

                {/* Title */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Description */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    value={editingDescription}
                    onChange={(e) => setEditingDescription(e.target.value)}
                    placeholder="Add a description..."
                    rows={4}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                    type="date"
                    value={editingDueDate}
                    onChange={(e) => setEditingDueDate(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Buttons */}
                <div className="flex justify-between">
                    <button
                        onClick={() => onDelete(task.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded transition"
                    >
                        Delete
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded transition"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TaskModal;
