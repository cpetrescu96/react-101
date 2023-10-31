# Знакомство с Redux Toolkit

Еще пока черновик...

📚 Содержание



> Redux Toolkit (RTK) - Официальный, набор инструментов для эффективной разработки Redux.

**Redux Toolkit** (далее просто **RTK**) упрощает разработку приложений, использующих Redux, делая код более читаемым и
поддерживаемым, а также уменьшая количество шаблонного кода, это более современный и удобный подход к управлению
состоянием, который рекомендуется для большинства проектов на базе Redux.

**RTK** подходит как для новых пользователей Redux, настраивающих свой первый проект, так и для опытных разработчиков,
которые хотят упростить существующее приложение.

⬆ [Back to Top](#обзор-библиотеки-redux-toolkit)

## Реализация на примере приложения Todo

### Установка Redux Toolkit

Для того что бы использовать Redux Toolkit установите пакет `@reduxjs/toolkit`.
Для того что бы React компоненты могли взаимодействовать с `Redux Store` требуется дополнительно
установить `react-redux`.

```shell
npm install @reduxjs/toolkit react-redux
```

Устанавливать библиотеку `redux` больше не требуется, она и еще ряд библиотек (`immer`, `redux-thunk`, `reselect`)
устанавливаются автоматически в качестве зависимостей вместе с установкой `@reduxjs/toolkit`.

⬆ [Back to Top](#обзор-библиотеки-redux-toolkit)

### Подготовка файла для Redux Store

Следующим шагом нужно создать файл, из которого будет экспортироваться объект `store` созданный при
помощи `configureStore()`.

В качестве конфигурации на старте будем использовать объект с одним параметром и пустой
функцией редюсер `todos`, позже мы еще вернемся к этому файлу для завершения настройки `store`.

```tsx
// src/store/index.ts
import {configureStore} from '@reduxjs/toolkit';

export const store = configureStore({
  // Reducers Map Object
  reducer: {
    todos: () => {
    },
  },
});
```

⬆ [Back to Top](#обзор-библиотеки-redux-toolkit)

### Установка связи между Redux Store и приложением React

Для передачи Redux Store в приложение React используется специальный компонент `<Provider>` из пакета `react-redux`.
Компонент `<Provider>` оборачивает весь корневой компонент приложения и предоставляет Redux Store всем компонентам
внутри него.

```tsx
// src/main.tsx
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';

import App from '@/app/app';
import {store} from '@/store';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
```

В дальнейшем каждый компонент, который нуждается в доступе к глобальному состоянию, может использовать хуки из
пакета `react-redux` для подключения к Redux Store и получения требуемых данных или выполнения действий над данными.

⬆ [Back to Top](#обзор-библиотеки-redux-toolkit)

### Создание функции редюсера (reducer)

При традиционном подходе в Redux (библиотека `redux`) требовалось создать функцию-редюсер с реализацией логики
обновления состояния на базе инструкций switch-case, отвечающую за обработку всех отправляемых действий и расчет того,
каким должен быть весь результат нового состояния (иммутабельный store - вы можете только создавать новую копию данных,
а не менять старое состояние store).

Помимо функции-редюсера требовалось создавать константы для действий (CONSTANTS) и сами действия (actions), а так же
генераторы действий (action-creator), если store состоял из нескольких частей (slices) то для каждой части нужно было
писать свою функцию-редюсер со всем необходимым кодом (шаблонный код).

> Несколько функцций-редюсеров объединяются в один Root Reducer при помощи
> функции [combineReducers()](https://redux.js.org/api/combinereducers) - эта функция так же доступна для импорта
> из `@reduxjs/toolkit` и используется для объединения слайсов.

Redux Toolkit более упрощенный подход для создания редюсеров, вместо обычного редюсера RTK позволяет создать объект
Slice при помощи функции `createSlice()`, который будет содержать следующие свойства и методы:

- `name`: имя слайса (slice);
- `reducer`: функция редюсер этого слайса для добавления в Redux Store (`store`) на этапе конфигурирования
  через `configureStore()`;
- `actions`: генераторы действий (action-creator) для типов действий (которые создаются автоматически), обрабатываемых
  редюсерами этого слайса.
- `caseReducers`:  Отдельные функции редюсеры, которые были переданы как аргумент при вызове `createSlice()` для
  повторного использования и тестирования.
- `getInitialState()`: метод который возвращает начально состояние переданное как аргумент при вызове `createSlice()`;

Функция `createSlice()` принимает четыре параметра:

- `name`: имя будущего слайса, которое будет задействовано в действиях (actions) с использованием
  нотации `domain/action`, в том числе и для Redux DevTools;
- `initialState`: начальное состояние для соответствующих редюсеров (их несколько);
- `reducers`: объект содержащий функции редюсеры. На основе имени функции-редюсера будет автоматически создаваться
  генератор действия и тип действия;
- `extraReducers`: необязательный параметр в виде объекта, который используется для добавления дополнительных функций
  редьюсеров, обычно используется для реализации асинхронных действий (async actions);

В отличие от функции-редюсера при использовании пакета `redux`, функция `createSlice()` использует отдельные функции в
качестве функций-редюсеров без switch-case реализации, то есть это отдельные функции которые позволяют писать
логику на основе мутабельного механизма (mutating). Однако на самом деле они не изменяют состояние, поскольку
используют "под капотом" библиотеку `immer`, которая определяет изменения и создает совершенно новое "immutable"
состояние на основе этих изменений.

Функция-редюсер для `createSlice()` выглядит следующим образом:

```js
function addNewTodo(state, action) {
  state.todos.push({
    id: uuidv4(),
    title: action.payload,
    completed: false,
  });
}
```

Как видно из примера, функция получает текущее состояние (`state`) слайса и объект `action` в котором есть свойство
`payload`. Свойство `payload` будет содержать любые данные переданные в качестве аргументов в генератор действия (
action-creator). Генераторы действий автоматичски создаются функцией `createSlice()` с именами соответствующими
функциям-редюсерам, например для примера выше будет создан генератор действия с названием `addNewTodo`:

```jsx
dispatch(addNewTodo('Create a new todo from this action.'));
```

Переданный аргумент в виде строки автоматически будет передаваться как `action.payload` для соответствующей
функции-редюсера;

Создайте файл `src/store/toodos-slice.ts`:

```tsx
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {v4 as uuidv4} from 'uuid';

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
      state.todos = state.todos.filter(({id}) => id !== action.payload);
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

export const {addNewTodo, removeTodo, toggleTodoCompleted} = todosSlice.actions;

export default todosSlice.reducer;
```

Здесь функция `createSlice()` возвращает объект типа `Slice` из которого экспортируются `actions` и `reducer`.
Дополнительно объект `Slice` содержит метод `getInitialState()`, свойство `name` и `caseReducers`;

⬆ [Back to Top](#обзор-библиотеки-redux-toolkit)

### Добаление редюсера в `store`

Теперь нужно внести изменения в ранее созданный файл с `configureStore()`:

```tsx
// src/store/index.ts
import {configureStore} from '@reduxjs/toolkit';

import todosReducer from './todos-slice';

export const store = configureStore({
  reducer: todosReducer,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
```

`configureStore()` это функция-wrapper для `createStore()` из пакета `redux`, которая использует упрощенную конфигурацию
для объединения всех ваших редюсеров (reducers) или добавления любых middleware (промежуточное ПО, связующее программное
обеспечение, посредник).

⬆ [Back to Top](#обзор-библиотеки-redux-toolkit)

### Использование состояния Redux Store в компонентах

Теперь вы можете использовать состояние из `store` и действия (actions) внутри своих компонентов, для этого
воспользуйтесь хуками из пакета `react-redux`:

- `useSelector`: для чтения данных из Redux Store;
- `useDispatch`: для отправки действий в Redux Store

Чтение данных в компоненте `<TodoList>` c использованием `useSelector()`:

```tsx
import {JSX} from 'react';
import {useSelector} from 'react-redux';

import {TodoItem} from '../todo-item';
import {TodosState} from '@/store/todos-slice';
import {AppDispatch} from '@/store';

export const TodoList = (): JSX.Element => {
  const todos = useSelector((state: TodosState) => state.todos);

  const todoList = todos.map((todo) => <TodoItem key={todo.id} todo={todo} />);

  return <>{todoList}</>;
};
```

Добавление нового Todo в список с использованием хука `useDispatch()` и действия (action) `addNewTodo`.

```tsx
// src/components/add-todo-form/add-todo-form.tsx
import {JSX, useState} from 'react';
import {useDispatch} from 'react-redux';

import {Button} from '@/shared/ui';
import {addNewTodo} from '@/store/todos-slice';
import {AppDispatch} from '@/store';

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
