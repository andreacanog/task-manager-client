import { useQuery, useMutation, gql } from "@apollo/client";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import List from "../components/List";
import Spinner from "../components/Spinner";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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
                    description
                    completed
                    dueDate
                    position
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

const REORDER_LISTS = gql`
    mutation ReorderLists($boardId: ID!, $listIds: [ID!]!) {
        reorderLists(input: { boardId: $boardId, listIds: $listIds }) {
            lists {
                id
                title
                position
                tasks {
                    id
                    title
                    description
                    completed
                    dueDate
                    position
                }
            }
            errors
        }
    }
`;

const REORDER_TASKS = gql`
    mutation ReorderTasks($listId: ID!, $taskIds: [ID!]!) {
        reorderTasks(input: { listId: $listId, taskIds: $taskIds }) {
            tasks {
                id
                title
                description
                completed
                dueDate
                position
            }
            errors
        }
    }
`;

function Board() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [newListTitle, setNewListTitle] = useState("");

    const { data, loading, error } = useQuery(GET_BOARD, {
        variables: { id },
    });

    const [createList] = useMutation(CREATE_LIST, {
        refetchQueries: [{ query: GET_BOARD, variables: { id } }],
    });

    const [reorderLists] = useMutation(REORDER_LISTS);
    const [reorderTasks] = useMutation(REORDER_TASKS);

    const handleCreateList = async (e) => {
        e.preventDefault();
        if (!newListTitle.trim()) return;
        await createList({ variables: { title: newListTitle, boardId: id } });
        setNewListTitle("");
    };

    const onDragEnd = (result) => {
        const { destination, source, type } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        if (type === "LIST") {
            const newListIds = data.board.lists.map((list) => list.id);
            newListIds.splice(source.index, 1);
            newListIds.splice(destination.index, 0, result.draggableId.replace("list-", ""));

            const reorderedLists = [...data.board.lists];
            reorderedLists.splice(source.index, 1);
            reorderedLists.splice(destination.index, 0, data.board.lists[source.index]);

            setTimeout(() => {
                reorderLists({
                    variables: { boardId: id, listIds: newListIds },
                    optimisticResponse: {
                        reorderLists: {
                            __typename: "ReorderListsPayload",
                            lists: reorderedLists.map((list, index) => ({
                                ...list,
                                position: index,
                                __typename: "List",
                                tasks: list.tasks.map(task => ({
                                    ...task,
                                    __typename: "Task"
                                }))
                            })),
                            errors: [],
                        },
                    },
                    update(cache, { data: { reorderLists } }) {
                        const existing = cache.readQuery({ query: GET_BOARD, variables: { id } });
                        cache.writeQuery({
                            query: GET_BOARD,
                            variables: { id },
                            data: {
                                board: {
                                    ...existing.board,
                                    lists: reorderLists.lists,
                                },
                            },
                        });
                    },
                });
            }, 0);
        }

        if (type === "TASK") {
            const sourceListId = source.droppableId.replace("list-", "");
            const destinationListId = destination.droppableId.replace("list-", "");
            const taskId = result.draggableId.replace("task-", "");

            const sourceList = data.board.lists.find(list => list.id === sourceListId);
            const destinationList = data.board.lists.find(list => list.id === destinationListId);

            const newTaskIds = destinationList.tasks.map(task => task.id);
            const reorderedTasks = [...destinationList.tasks];

            if (sourceListId === destinationListId) {
                reorderedTasks.splice(source.index, 1);
                reorderedTasks.splice(destination.index, 0, destinationList.tasks[source.index]);
                newTaskIds.splice(source.index, 1);
                newTaskIds.splice(destination.index, 0, taskId);
            } else {
                const draggedTask = sourceList.tasks[source.index];
                reorderedTasks.splice(destination.index, 0, draggedTask);
                newTaskIds.splice(destination.index, 0, taskId);
            }

            setTimeout(() => {
                reorderTasks({
                    variables: { listId: destinationListId, taskIds: newTaskIds },
                    optimisticResponse: {
                        reorderTasks: {
                            __typename: "ReorderTasksPayload",
                            tasks: reorderedTasks.map((task, index) => ({
                                ...task,
                                position: index,
                                __typename: "Task",
                                id: task.id,
                                title: task.title,
                                description: task.description || null,
                                completed: task.completed || false,
                                dueDate: task.dueDate || null,
                                position: index,
                            })),
                            errors: [],
                        },
                    },
                    update(cache, { data: { reorderTasks } }) {
                        const existing = cache.readQuery({ query: GET_BOARD, variables: { id } });
                        cache.writeQuery({
                            query: GET_BOARD,
                            variables: { id },
                            data: {
                                board: {
                                    ...existing.board,
                                    lists: existing.board.lists.map(list => {
                                        if (list.id === destinationListId) {
                                            return { ...list, tasks: reorderTasks.tasks };
                                        }
                                        if (list.id === sourceListId) {
                                            return { ...list, tasks: list.tasks.filter(task => String(task.id) !== String(taskId)) };
                                        }
                                        return list;
                                    }),
                                },
                            },
                        });
                    },
                });
            }, 0);
        }
    };

    if (loading) return <Spinner />;

    if (error) return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <p className="text-red-500">Error loading board!</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-blue-600 px-6 py-4 flex items-center gap-4 shadow">
                <button onClick={() => navigate("/dashboard")} className="text-white text-sm hover:underline">
                    ← Back
                </button>
                <h1 className="text-white text-xl font-bold">{data.board.title}</h1>
            </nav>

            {data.board.lists.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-gray-400 text-lg mb-2">No Lists yet!</p>
                    <p className="text-gray-400 text-sm">Create your first list to get started.</p>
                </div>
            )}

            <div className="p-6 overflow-x-auto">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="all-lists" direction="horizontal" type="LIST">
                        {(provided) => (
                            <div
                                className="flex gap-4 items-start"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {data.board.lists.map((list, index) => (
                                    <Draggable key={list.id} draggableId={`list-${list.id}`} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                            >
                                                <List
                                                    list={list}
                                                    refetchBoard={[{ query: GET_BOARD, variables: { id } }]}
                                                    dragHandleProps={provided.dragHandleProps}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}

                                <div className="bg-gray-200 rounded-xl p-3 w-64 flex-shrink-0">
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
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
}

export default Board;
