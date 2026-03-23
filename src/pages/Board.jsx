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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading board!</p>;

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
        <button onClick={() => navigate("/dashboard")}>← Back</button>
        <h1>{data.board.title}</h1>
      </div>

      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
        {data.board.lists.map((list) => (
          <div
            key={list.id}
            style={{
              background: "#ebecf0",
              borderRadius: "8px",
              padding: "12px",
              minWidth: "250px",
            }}
          >
            <h3 style={{ marginBottom: "12px" }}>{list.title}</h3>

            {list.tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  background: "white",
                  padding: "8px",
                  borderRadius: "4px",
                  marginBottom: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  onClick={() => handleToggleTask(task)}
                  style={{
                    cursor: "pointer",
                    textDecoration: task.completed ? "line-through" : "none",
                    color: task.completed ? "#aaa" : "black",
                  }}
                >
                  {task.title}
                </span>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "red" }}
                >
                  ✕
                </button>
              </div>
            ))}

            <form onSubmit={(e) => handleCreateTask(e, list.id)}>
              <input
                type="text"
                placeholder="Add a task..."
                value={newTaskTitles[list.id] || ""}
                onChange={(e) =>
                  setNewTaskTitles({ ...newTaskTitles, [list.id]: e.target.value })
                }
                style={{ width: "100%", padding: "6px", marginBottom: "6px" }}
              />
              <button type="submit" style={{ width: "100%" }}>Add Task</button>
            </form>
          </div>
        ))}

        <div style={{ minWidth: "250px" }}>
          <form onSubmit={handleCreateList}>
            <input
              type="text"
              placeholder="New list title..."
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              style={{ width: "100%", padding: "6px", marginBottom: "6px" }}
            />
            <button type="submit" style={{ width: "100%" }}>Add List</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Board;
