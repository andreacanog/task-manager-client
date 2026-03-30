function Task({ task, onToggle, onDelete}) {

    return (
        <div className="bg-white rounded p-2 flex justify-between items-center shadow-sm">
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
            <button
                onClick={() => onDelete(task.id)}
                className="text-gray-400 hover:text-red-500 ml-2 text-xs transition"
            >
                ✕
            </button>
        </div>

    )

}

export default Task;
