import { ReactElement, useReducer } from 'react';

import styles from './app.module.css';

import { TodoList } from '@/components/todo-list';
import { AddTodoForm } from '@/components/add-todo-form';
import { addNewTodo, removeTodo, toggleCompleted, todoReducer } from '@/reducers/todo';

const App = (): ReactElement => {
  const [todos, dispatch] = useReducer(todoReducer, []);

  const handleAddTodo = (title: string) => dispatch(addNewTodo(title));

  const handleRemoveTodo = (todoId: number) => dispatch(removeTodo(todoId));

  const handleToggleTodo = (todoId: number) => dispatch(toggleCompleted(todoId));

  return (
    <div className={styles.appContainer}>
      <h1 className={styles.header}>Todo App</h1>
      <AddTodoForm onAddTodo={handleAddTodo} />
      <TodoList todos={todos} onToggleComplete={handleToggleTodo} onRemove={handleRemoveTodo} />
    </div>
  );
};

export default App;
