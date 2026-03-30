import { useQuery, useMutation, gql } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GET_BOARDS = gql`
  query {
    boards {
      id
      title
    }
  }
`;

const CREATE_BOARD = gql`
  mutation CreateBoard($title: String!) {
    createBoard(input: { title: $title }) {
      board {
        id
        title
      }
      errors
    }
  }
`;

const DELETE_BOARD = gql`
    mutation DeleteBoard($id: ID!) {
        deleteBoard(input: { id: $id }) {
          success
          errors
        }
    }
`;


function Dashboard() {
  const [title, setTitle] = useState("");
  const { data, loading, error } = useQuery(GET_BOARDS);

  const [createBoard] = useMutation(CREATE_BOARD, {
    refetchQueries: [{ query: GET_BOARDS }],
  });

  const [deleteBoard] = useMutation(DELETE_BOARD, {
    refetchQueries: [{ query: GET_BOARDS }],
  });

  const navigate = useNavigate();

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const { data } = await createBoard({ variables: { title } });
    if (data.createBoard.errors.length === 0) {
      setTitle("");
    } else {
      alert(data.createBoard.errors[0]);
    }
  };

  const handleDeleteBoard = async (e, boardId) => {
    e.stopPropagation() // prevents navigating to the board
    await deleteBoard({ variables: { id: boardId } })
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500">Loading boards...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-red-500">Error loading boards!</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-white text-xl font-bold">TaskManager</h1>
        <button
          onClick={handleLogout}
          className="text-white text-sm hover:underline"
        >
          Logout
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Boards</h2>

        {/* Create board form */}
        <form onSubmit={handleCreateBoard} className="flex gap-3 mb-8">
          <input
            type="text"
            placeholder="New board title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded transition"
          >
            + Create Board
          </button>
        </form>

        {/* Empty state */}
        {data.boards.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-2">No boards yet!</p>
            <p className="text-gray-400 text-sm">Create your first board to get started.</p>
          </div>
        )}

        {/* Boards grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.boards.map((board) => (
            <div
              key={board.id}
              onClick={() => navigate(`/board/${board.id}`)}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-5 cursor-pointer transition shadow"
            >
              <h3 className="font-semibold text-lg">{board.title}</h3>
              <button
                  onClick={(e) => handleDeleteBoard(e, board.id)}
                  className="text-gray-400 hover:text-red-500 ml-2 text-xs transition"
              >
                  ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
