# Обзор библиотеки Redux Toolkit

Еще пока черновик...

📚 Содержание

<!-- TOC -->
* [Обзор библиотеки Redux Toolkit](#обзор-библиотеки-redux-toolkit)
  * [Реализация на примере приложения Todo](#реализация-на-примере-приложения-todo)
    * [Установка зависимостей в проект через NPM](#установка-зависимостей-в-проект-через-npm)
    * [Подготовка файла для Redux Store](#подготовка-файла-для-redux-store)
    * [Установка связи между Redux Store и приложением React](#установка-связи-между-redux-store-и-приложением-react)
    * [Создание функции редюсера (reducer)](#создание-функции-редюсера-reducer)
    * [Добаление редюсера в `store`](#добаление-редюсера-в-store)
    * [Использование состояния Redux Store в компонентах](#использование-состояния-redux-store-в-компонентах)
  * [Пример приложения Todo](#пример-приложения-todo)
<!-- TOC -->

> Redux Toolkit (RTK) - Официальный, набор инструментов для эффективной разработки Redux.

**Redux Toolkit** (далее просто **RTK**) упрощает разработку приложений, использующих Redux, делая код более читаемым и
поддерживаемым, а также
уменьшая количество шаблонного кода.

- **RTK** предоставляет более современный и удобный подход к управлению состоянием,
  который рекомендуется для большинства проектов на базе Redux.
- **RTK** подходит как для новых пользователей Redux,
  настраивающих свой первый проект, так и для опытных разработчиков, которые хотят упростить существующее приложение.

⬆ [Back to Top](#обзор-библиотеки-redux-toolkit)

## Реализация на примере приложения Todo

### Установка зависимостей в проект через NPM

```shell
npm install @reduxjs/toolkit react-redux
```

Устанавливать библиотеку `redux` не требуется, вместо нее теперь устанавливается `@reduxjs/toolkit`,
для того что бы React компоненты могли взаимодействовать с `Redux Store` дополнительно устанавливается `react-redux`.

⬆ [Back to Top](#обзор-библиотеки-redux-toolkit)

### Подготовка файла для Redux Store

Следующим шагом нужно создать файл, из которого будет экспортироваться `store` вашего приложения созданный при
помощи `configureStore()`, в качестве конфигурации будем использовать объект с одним параметром и пустым
редюсером `todos`:

```tsx
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  // Reducers Map Object
  reducer: {
    todos: () => {},
  },
});
```

`configureStore()` это функция-wrapper для `createStore()` из пакета `redux`, которая использует упрощенную конфигурацию
для объединения всех ваших редюсеров (reducers) или добавления любых middleware (промежуточное ПО, связующее программное
обеспечение, посредник).

⬆ [Back to Top](#обзор-библиотеки-redux-toolkit)

### Установка связи между Redux Store и приложением React

Для передачи Redux Store в приложение React используется специальный компонент `<Provider>` из пакета `react-redux`.
Компонент `<Provider>` оборачивает весь корневой компонент приложения и предоставляет Redux Store всем компонентам
внутри него.

```tsx
// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import App from '@/app/app';
import { store } from '@/store';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
```

В дальнейшем каждый компонент, который нуждается в доступе к глобальному состоянию, может использовать функции и хуки из
пакета `react-redux` для подключения к Redux Store и получения требуемых данных или действий.

⬆ [Back to Top](#обзор-библиотеки-redux-toolkit)

### Создание функции редюсера (reducer)

Для создания функции редюсера используйте функцию RTK `createSlice()`, которая принимает три параметра:

- `name`: строковой параметр, имя, которое будет использовано в действиях (actions);
- `initialState`: начальное состояние для соответствующего редюсера;
- `reducers`: объект содержащий функции редюсера, Ключ (имена функций) будут использованы для автоматической генерации
  действий (actions);

**RTK** позволяет писать "mutating" логику в редюсерах. Однако на самом деле он не изменяет состояние, поскольку
использует "под капотом" библиотеку `immer`, которая определяет изменения и создает совершенно новое "immutable"
состояние на основе этих изменений.

Создайте файл `src/store/toodos-slice.ts`:

```tsx
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

export type TodosState = {
  todos: Todo[];
};

const initialState: TodosState = {
  todos: [],
};

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addNewTodo: (state, action: PayloadAction<string>) => {
      state.todos.push({
        id: uuidv4(),
        title: action.payload,
        completed: false,
      });
    },

    removeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(({ id }) => id !== action.payload);
    },

    toggleTodoCompleted: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.map((todo) => {
        if (todo.id === action.payload) {
          return {
            ...todo,
            completed: !todo.completed,
          };
        }
        return todo;
      });
    },
  },
});

export const { addNewTodo, removeTodo, toggleTodoCompleted } = todosSlice.actions;

export default todosSlice.reducer;
```

Здесь функция `createSlice()` возвращает объект типа `Slice` из которого экспортируются `actions` и `reducer`.
Дополнительно объект `Slice` содержит метод `getInitialState()`, свойство `name` и `caseReducers`;

⬆ [Back to Top](#обзор-библиотеки-redux-toolkit)

### Добаление редюсера в `store`

Теперь нужно внести изменения в ранее созданный файл с `configureStore()`:

```tsx
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';

import todosReducer from './todos-slice';

export const store = configureStore({
  reducer: todosReducer,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
```

⬆ [Back to Top](#обзор-библиотеки-redux-toolkit)

### Использование состояния Redux Store в компонентах

Теперь вы можете использовать состояние из `store` и действия (actions) внутри своих компонентов, для этого
воспользуйтесь хуками из пакета `react-redux`:

- `useSelector`: для чтения данных из Redux Store;
- `useDispatch`: для отправки действий в Redux Store 

Чтение данных в компоненте `<TodoList>` c использованием `useSelector()`:

```tsx
import { JSX } from 'react';
import { useSelector } from 'react-redux';

import { TodoItem } from '../todo-item';
import { TodosState } from '@/store/todos-slice';
import { AppDispatch } from '@/store';

export const TodoList = (): JSX.Element => {
  const todos = useSelector((state: TodosState) => state.todos);

  const todoList = todos.map((todo) => <TodoItem key={todo.id} todo={todo} />);

  return <>{todoList}</>;
};
```

Добавление нового Todo в список с использованием хука `useDispatch()` и действия (action) `addNewTodo`.

```tsx
// src/components/add-todo-form/add-todo-form.tsx
import { JSX, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Button } from '@/shared/ui';
import { addNewTodo } from '@/store/todos-slice';
import { AppDispatch } from '@/store';

export const AddTodoForm = (): JSX.Element => {
  const [title, setTitle] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleClick = (): void => {
    if (!title) {
      return;
    }

    dispatch(addNewTodo(title));

    setTitle('');
  };

  return (
    <form>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <Button onCLick={handleClick}>Add new</Button>
    </form>
  );
};
```

⬆ [Back to Top](#обзор-библиотеки-redux-toolkit)

## Пример приложения Todo

Готовый пример с приложением находится в src раздела `chapter-22`.

Для запуска примера с готовым приложением выполните команды:

```shell
git clone https://github.com/shopot/react-101.git

git checkout chapter-22

npm install

npm run dev
```

⬆ [Back to Top](#обзор-библиотеки-redux-toolkit)

Документация по теме:

⬆ [Back to Top](#обзор-библиотеки-redux-toolkit)
