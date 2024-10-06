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
        const indexQuery = createIndexQuery(user?.id || 0);
        const response = await apiClient.get<Todo[]>(indexQuery);
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
  //search todo for calendar
  const searchTodoForCalendar = async (selectedDate: string) => {
    try {
      const { formattedFirstDayOfLastMonth, formattedLastDayOfNextMonth } = getBoundingDates(selectedDate);
      const searchQuery = `/todos?user_id=${user?.id}&start_date[after]=${formattedFirstDayOfLastMonth}&due_date[before]=${formattedLastDayOfNextMonth}`;
      const response = await apiClient.get<Todo[]>(searchQuery);
      setTodos(response.data);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return { todos, loading, error, addTodo, deleteTodo, updateTodo, searchTodo, searchTodoForCalendar };
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

const createIndexQuery = (user_id: number) : string => {
  let indexQuery = `/todos?user_id=${user_id}`;
  const currentDate = new Date();
  const { formattedFirstDayOfLastMonth, formattedLastDayOfNextMonth } = getBoundingDates(currentDate);
  indexQuery += `&start_date[after]=${formattedFirstDayOfLastMonth}&due_date[before]=${formattedLastDayOfNextMonth}`;
  return indexQuery;
}

//return first day of last month and last day of next month
const getBoundingDates = (date: Date | string) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const firstDayOfLastMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  const lastDayOfNextMonth = new Date(date.getFullYear(), date.getMonth() + 2, 0);
  const formattedFirstDayOfLastMonth = formatDate(firstDayOfLastMonth);
  const formattedLastDayOfNextMonth = formatDate(lastDayOfNextMonth);
  return { formattedFirstDayOfLastMonth, formattedLastDayOfNextMonth };
}

const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}


export default useTodos;