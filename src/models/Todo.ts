export interface Todo {
  id?: number;
  title: string;
  description: string;
  due_date: string;
  completed: boolean;
  category?: string;
  category_master_id?: number;
  user_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTodoRequest {
  id?: number;
  title: string;
  description: string;
  due_date: string;
  completed?: boolean;
  category?: string;
  category_master_id?: number;
  user_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateTodoRequest {
  id?: number;
  title?: string;
  description?: string;
  due_date?: string;
  completed?: boolean;
  category?: string;
  category_master_id?: number;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface searchTodoRequest {
  title?: string;
  description?: string;
  due_date?: string;
  completed?: boolean;
  category?: string;
}