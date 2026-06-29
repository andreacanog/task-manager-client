export interface User {
  id: string
  email: string
}

export interface TaskType {
  id: string
  title: string
  description?: string | null
  position: number
  listId: string
  completed: boolean
  dueDate?: string | null
}

export interface ListType {
  id: string
  title: string
  position: number
  boardId: string
  tasks: TaskType[]
}

export interface BoardType {
  id: string
  title: string
  lists: ListType[]
}

export interface AuthContextType {
  currentUser: User | null
  login: (token: string, user: User) => void
  logout: () => void
}
