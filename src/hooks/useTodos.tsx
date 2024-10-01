import { useState, useEffect } from "react";
import apiClient from "../apiClient";
import { Todo, searchTodoRequest } from "../models/Todo";
import { CreateTodoRequest } from "../models/Todo";
import { UpdateTodoRequest } from "../models/Todo";
import { useUserInfo } from "../contexts/UserInfoContext";

const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserInfo();

  useEffect(() => {
    // get todos
    const fetchPosts = async () => {
      try {
        const response = await apiClient.get<Todo[]>(`/todos?user_id=${user?.id}`);
        console.log(response.data);
        setTodos(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // create todo
  const addTodo = async (request: CreateTodoRequest) => {
    try {
      const response = await apiClient.post<Todo>("/todos", request);
      setTodos((prevTodos) => [...prevTodos, response.data]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // delete todo
  const deleteTodo = async (id: number) => {
    try {
      await apiClient.delete<void>(`/todos/${id}`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  }

  //update todo
  const updateTodo = async (request: UpdateTodoRequest) => {
    try {
      const {id, ...requestWithoutId } = request;
      const response = await apiClient.put<Todo>(`/todos/${id}`, requestWithoutId);
      setTodos((prevTodos) => prevTodos.map((t) => t.id === request.id ? response.data : t));
    } catch (err: any) {
      setError(err.message);
    }
  }

  //search todo
  const searchTodo = async (searchParams: searchTodoRequest) => {
    try {
      const searchQuery = createSearchQuery(user?.id || 0, searchParams);

      const response = await apiClient.get<Todo[]>(searchQuery);
      setTodos(response.data);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return { todos, loading, error, addTodo, deleteTodo, updateTodo, searchTodo };
}

// like private method

const createSearchQuery = (user_id: number, searchParams: searchTodoRequest) : string => {
  let searchQuery = `/todos?user_id=${user_id}`;

  for (const key in searchParams) {
    if (searchParams[key as keyof searchTodoRequest]) {
      searchQuery += `&${key}=${searchParams[key as keyof searchTodoRequest]}`;
    }
  }
  return searchQuery;
}


export default useTodos;