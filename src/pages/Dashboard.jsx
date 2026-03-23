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

function Dashboard() {
  const [title, setTitle] = useState("");
  const { data, loading, error } = useQuery(GET_BOARDS);
  const [createBoard] = useMutation(CREATE_BOARD, {
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading boards!</p>;

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>My Boards</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <form onSubmit={handleCreateBoard} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="New board title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <button type="submit">Create Board</button>
      </form>

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {data.boards.map((board) => (
          <div
            key={board.id}
            onClick={() => navigate(`/board/${board.id}`)}
            style={{
              padding: "20px",
              background: "#0079bf",
              color: "white",
              borderRadius: "8px",
              cursor: "pointer",
              minWidth: "200px",
            }}
          >
            <h3>{board.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
