import { useQuery, useMutation, gql } from "@apollo/client";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const GET_BOARD = gql`
  query GetBoard($id: ID!) {
    board(id: $id) {
      id
      title
      lists {
        id
        title
        position
        tasks {
          id
          title
          completed
        }
      }
    }
  }
`;

const CREATE_LIST = gql`
  mutation CreateList($title: String!, $boardId: ID!) {
    createList(input: { title: $title, boardId: $boardId }) {
      list {
        id
        title
        position
      }
      errors
    }
  }
`;

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

function Board() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newListTitle, setNewListTitle] = useState("");
  const [newTaskTitles, setNewTaskTitles] = useState({});

  const { data, loading, error } = useQuery(GET_BOARD, {
    variables: { id },
  });

  const [createList] = useMutation(CREATE_LIST, {
    refetchQueries: [{ query: GET_BOARD, variables: { id } }],
  });

  const [createTask] = useMutation(CREATE_TASK, {
    refetchQueries: [{ query: GET_BOARD, variables: { id } }],
  });

  const [updateTask] = useMutation(UPDATE_TASK, {
    refetchQueries: [{ query: GET_BOARD, variables: { id } }],
  });

  const [deleteTask] = useMutation(DELETE_TASK, {
    refetchQueries: [{ query: GET_BOARD, variables: { id } }],
  });

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    await createList({ variables: { title: newListTitle, boardId: id } });
    setNewListTitle("");
  };

  const handleCreateTask = async (e, listId) => {
    e.preventDefault();
    const title = newTaskTitles[listId];
    if (!title?.trim()) return;
    await createTask({ variables: { title, listId } });
    setNewTaskTitles({ ...newTaskTitles, [listId]: "" });
  };

  const handleToggleTask = async (task) => {
    await updateTask({ variables: { id: task.id, completed: !task.completed } });
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask({ variables: { id: taskId } });
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500">Loading board...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-red-500">Error loading board!</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 px-6 py-4 flex items-center gap-4 shadow">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-white text-sm hover:underline"
        >
          ← Back
        </button>
        <h1 className="text-white text-xl font-bold">{data.board.title}</h1>
      </nav>

      {/* Board content */}
      <div className="p-6 overflow-x-auto">
        <div className="flex gap-4 items-start">
          {data.board.lists.map((list) => (
            <div
              key={list.id}
              className="bg-gray-200 rounded-lg p-3 w-64 flex-shrink-0"
            >
              <h3 className="font-semibold text-gray-700 mb-3">{list.title}</h3>

              {/* Tasks */}
              <div className="space-y-2 mb-3">
                {list.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded p-2 flex justify-between items-center shadow-sm"
                  >
                    <span
                      onClick={() => handleToggleTask(task)}
                      className={`text-sm cursor-pointer flex-1 ${
                        task.completed
                          ? "line-through text-gray-400"
                          : "text-gray-700"
                      }`}
                    >
                      {task.title}
                    </span>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-gray-400 hover:text-red-500 ml-2 text-xs transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Add task form */}
              <form onSubmit={(e) => handleCreateTask(e, list.id)}>
                <input
                  type="text"
                  placeholder="Add a task..."
                  value={newTaskTitles[list.id] || ""}
                  onChange={(e) =>
                    setNewTaskTitles({ ...newTaskTitles, [list.id]: e.target.value })
                  }
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
          ))}

          {/* Add list form */}
          <div className="bg-gray-200 rounded-lg p-3 w-64 flex-shrink-0">
            <h3 className="font-semibold text-gray-700 mb-3">Add a list</h3>
            <form onSubmit={handleCreateList}>
              <input
                type="text"
                placeholder="List title..."
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm mb-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 rounded transition"
              >
                + Add List
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Board;
