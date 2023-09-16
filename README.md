# Знакомство с хуком useReducer

📚 Содержание

- [Что не так с "Todo App" и useState()](#что-не-так-с-todo-app-и-usestate)
- [useReducer() - еще один способ управления состоянием компонента](#usereducer---еще-один-способ-управления-состоянием-компонента)
- [Рефакторинг приложения "Todo App"](#рефакторинг-приложения-todo-app)

### Что не так с "Todo App" и useState()

Давайте посмотрим на реализацию приложения "Todo App"
из [chapter-09](https://github.com/shopot/react-101/blob/chapter-09/src/app/app.tsx), где для хранения списка Todo
использовалась переменная состояния с из хука `useState()`:

```jsx
const initialState = [
  {
    id: 1,
    title: 'learn in the tutorial are fundamental to building any React app',
    completed: false,
  },
];

const App = () => {
  const [todos, setTodos] = useState(initialState);

  const getLastId = () => {
    if (todos.length === 0) {
      return 0;
    }

    return todos[todos.length - 1].id;
  };

  const handleToggleTodo = (todoId) => {
    const findIndex = todos.findIndex(({id}) => id === todoId);

    if (findIndex !== -1) {
      const newState = structuredClone(todos);

      const todo = newState[findIndex];

      newState[findIndex] = {...todo, completed: !todo.completed};

      setTodos(newState);
    }
  };

  const removeTodo = (todoId) => {
    const newState = structuredClone(todos).filter(({id}) => id !== todoId);

    setTodos(newState);
  };

  const handleRemoveTodo = (title) => {
    const newTodo = {
      id: getLastId() + 1,
      title,
      completed: false,
    };

    const newState = structuredClone(todos);

    newState.push(newTodo);

    setTodos(newState);
  };

  return (
    <>
      <h1>Todo App</h1>
      <AddTodoForm onAddTodo={handleAddTodo} />
      <TodoList todos={todos} onToggleComplete={handleToggleTodo} onRemove={handleRemoveTodo} />
    </>
  );
};
```

Как видно из примера, помимо самой переменной состояния, которая содержит список Todo, компонент содержит логику
управления списком Todo.

Хук `useState()` предоставляет одну переменную состояния, которая содержит сложную структуру данных в виде массива
объектов и всего один метод для изменения этой переменной, вся остальная логика, связанная с изменением данных внутри
списка, реализована внутри самого компонента.

Такая реализация имеет ряд недостатков, а именно:

- Компонент выполняет несколько не связанных между собой задач: управление логикой состояния и управление логикой
  рендеринга;
- Компонент имеет множество обновлений состояния, распределенных по разным обработчикам событий;
- Размер компонента увеличивается за счет кода, который напрямую не связан с логикой рендеринга;
- Дизайн компонента, сточки зрения кода усложняется;

В результате такую реализацию будет сложно читать, поддерживать и тестировать.

[⬆ Back to Top](#знакомство-с-хуком-usereducer)

### useReducer() - еще один способ управления состоянием компонента

**useReducer()** - это еще один способ управления состоянием компонента в React, который позволяет иметь
более сложную логику управления состоянием, чем простое использование `useState()`.

Хук `useReducer() `принимает два аргумента: функцию редюсер `reducer()` и начальное состояние.
Затем хук возвращает массив из двух сущностей: текущее состояние и функцию отправки - `dispatch`.

```jsx
import { useReducer } from 'react';

const reducer = (state, action) => {
  // ...
};

const initialState = {
  age: 25,
};

const MyComponent = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  // ...
};
```

💡 Reducer - это функция, которая принимает два параметра: `текущее состояние приложения` и `действие, которое необходимо
выполнить`, и возвращает новое состояние.

То есть редюсер это функция, которая описывает некую логику для изменения состояния, принимая состояние и действие в
качестве аргументов и в качестве результата возвращает следующее состояние.

💡 Редюсеры это чистые функции, это значит у них нет побочных эффектов. Они возвращают одно и то же значение, если задать
одни и те же аргументы.

Вызов хука `useState()` отличается от вызова хука `useReducer()`, в первом случае вы передаете в хук начальное
состояние, React запоминает его в "своей памяти" в виде переменной состояния, хук возвращает эту переменную и функцию,
через которую можно изменить значение переменной целиком.

Во втором случае, вызывая `useReducer()`, вы так же передаете вторым аргументом начальное состояние, а первым
аргументом, вы передаете функцию, которая будет управлять этой переменной стояния. В ответ на вызов хука вы получаете
текущее значение переменной состояния и функцию отправки (dispatch).

Для того что бы изменить переменную состояния в случае с использованием `useReducer()`, нужно вызвать функцию
отправки (dispatch) и передать в нее действие (action), то есть простыми словами, указать что необходимо выполнить с
текущим состоянием.

По соглашению, действие (action) обычно представляет собой объект со свойством `type`, идентифицирующим самое действие.
Так же этот объект при необходимости может содержать и другие свойства с дополнительной информацией необходимой для
изменения состояния.

```jsx
const [state, dispatch] = useReducer(reducer, {age: 42});

const handleClick = () => {
  dispatch({type: 'increment_age'});
  // ...
};
```

В результате вызова функции `dispatch({type: 'increment_age'})`, функция `reducer()` получит `action` в виде
объекта `{type: 'increment_age'}`, выполнит необходимые действия над текущем значением состояния и вернет следующее
состояние.

Функция `reducer()` должна иметь представление о передаваемом действии:

```jsx
const reducer = (state, action) => {
  switch (action.type) {
    case 'increment_age': {
      return {
        age: state.age + 1
      };
    }
  }

  throw Error('Unknown action.');
};
```

Здесь функция `reducer()` принимает текущее состояние в виде аргумента `state` и действие в виде аргумента `action`, и
если будет найдено соответствие для `action.type`, то функция `reducer()` вернет значение следующего состояния. Далее
React обновит состояние компонента до нового значения, и запустит повторный рендеринг.

💡 Функция отправки `dispatch`, возвращаемая хуком `useReducer()`, позволяет обновить состояние и запускает повторный
рендеринг.

Полный пример с `useReducer()` будет выглядеть следующим образом:

```jsx
import { useReducer } from 'react';

const reducer = (state, action) => {
  switch (action.type) {
    case 'increment_age': {
      return {
        age: state.age + 1
      };
    }
  }

  throw Error('Unknown action.');
};

const initialState = {
  age: 25,
};

const MyComponent = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleClick = () => {
    dispatch({type: 'increment_age'});
  };

  return (
    <>
      <h2>Current age is {state.age}</h2>
      <button onClick={handleClick}>Increment age</button>
    </>
  );
};
```

### Рефакторинг приложения "Todo App"

> Рефакторинг (refactoring) - это процесс изменения внутренней структуры исходного кода программы без изменения её
> внешнего поведения. Целью рефакторинга является улучшение качества программного кода - увеличение его читаемости,
> понятности, гибкости, расширяемости, нацеленное на дальнейшее сокращение времени разработки и поддержки программы.

Первым делом нужно создать функцию `todoReducer()` (reducer для хука `useReducer()`) и вынести в нее всю логику
связанную с изменением списка Todo:

```jsx
// src/reducers/todo/reducer.js
export const todoReducer = (state, action) => {
  const getLastId = () => state.length ? state[state.length - 1].id : 0;

  const {type, todoId, title} = action;

  switch (type) {
    case 'add_new_todo': {
      if (!title) {
        break;
      }

      const newTodo = {
        id: getLastId() + 1,
        title,
        completed: false,
      };

      const newState = structuredClone(state);

      newState.push(newTodo);

      return newState;
    }

    case 'remove_todo': {
      if (!todoId) {
        break;
      }

      return structuredClone(state).filter(({id}) => id !== todoId);
    }

    case 'toggle_completed': {
      if (!todoId) {
        break;
      }

      const findIndex = state.findIndex(({id}) => id === todoId);

      if (findIndex !== -1) {
        const newState = structuredClone(state);

        const todo = newState[findIndex];

        newState[findIndex] = {...todo, completed: !todo.completed};

        return newState;
      }
    }
  }

  // Return unchanged state
  return structuredClone(state);
};
```

По соглашению, код который вычисляет следующее состояние, обычно записывают в виде инструкции `switch`.
Для каждого блока `case` в инструкции `switch` будет вычисляться и возвращаться следующее состояние.

❗ Если `todoReducer()` получит действие которого нет в инструкции `switch` или какие-то данные будут отсутствовать,
то `todoReducer()` вернет неизмененное состояние. На практике такое поведение не является типичным, правильнее будет
сгенерировать исключение с соответствующим сообщением об ошибке, это позволит избежать побочных эффектов и обнаружить
ошибки в реализации логики в работе с редюсером.

Теперь компонент `<App />` будет выглядеть следующим образом:

```jsx
import { ReactElement, useReducer } from 'react';

import { TodoList } from '@/components/todo-list';
import { AddTodoForm } from '@/components/add-todo-form';
import { todoReducer } from '@/reducers/todo';

const App = () => {
  const [todos, dispatch] = useReducer(todoReducer, []);

  const handleAddTodo = (title) => dispatch({type: 'add_new_todo', title});

  const handleRemoveTodo = (todoId) => dispatch({type: 'remove_todo', todoId});

  const handleToggleTodo = (todoId) => dispatch({type: 'toggle_completed', todoId});

  return (
    <>
      <h1>Todo App</h1>
      <AddTodoForm onAddTodo={handleAddTodo} />
      <TodoList todos={todos} onToggleComplete={handleToggleTodo} onRemove={handleRemoveTodo} />
    </>
  );
};
```

Итоги рефакторинга:

- У нас есть отдельная функция `todoReducer()`, которая содержит всю логику для работы со списком Todo, является чистой
  функцией и вынесена в отдельный файл (модуль).
- Компонент `<App />` больше не содержит описание логики для управления состоянием, вместо этого он использует
  вызов функции `dispatch()` с передачей действий (action).

### Константы и генераторы экшенов (Action Creators)

🔗 [Ссылка на деплой приложения](https://todo-app-ab1e50.netlify.app/)

Готовый пример с приложением находится в `src` раздела chapter-15.

Для запуска примера с готовым приложением выполните команды:

```shell
git clone https://github.com/shopot/react-101.git

git checkout chapter-15

npm install

npm run dev
```

Документация по теме:

- 🔗 [React Hook useReducer()](https://react.dev/reference/react/useReducer)

[⬆ Back to Top](#знакомство-с-хуком-usereducer)
