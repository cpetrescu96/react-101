# Получение данных - Fetching data

📚 Оглавление:

- [Получение данных с помощью эффектов](#получение-данных-с-помощью-эффектов)
- [Пример создания пользовательского хука useFetch](#пример-создания-пользовательского-хука-usefetch)

### Получение данных с помощью эффектов

Вы можете использовать эффект для получения данных для вашего компонента. Обратите внимание: если вы используете
какой-либо фреймворк, то использование механизма выборки данных фреймворка будет намного эффективнее, чем написание
эффектов вручную.

Если вы хотите получить данные из эффекта вручную, ваш код может выглядеть так:

```jsx
export const CharacterDetail = ({characterId}) => {
  const [character, setCharacter] = useState(null);

  useEffect(() => {
    const fetchData = async (id) => {
      const response = await fetch(`https://rickandmortyapi.com/api/character/${id}/`);
      const newData = await response.json();
      setData(newData);
    };

    fetchData(characterId);
  }, [characterId]);

  if (character) {
    return <div>{character.name}</div>;
  } else {
    return null;
  }
};
```

Используя эту реализацию, вы можете заметить странную вещь: иногда компонент отображает правильные данные, а иногда
неверные или устаревшие.

Скорее всего, вы столкнулись с [Race Condition](https://en.wikipedia.org/wiki/Race_condition).

Обычно `состояние гонки` (в React) происходит когда были сделаны два разных запроса на данные, и приложение отображает
разные результаты в зависимости от того, какой запрос завершится первым.

Возможно пример описанный выше будет не очевидным, демонстрацию реального примера можно посмотреть тут
🔗 [CodeSandbox](https://codesandbox.io/s/beating-async-race-conditions-in-react-forked-v8yfjp?file=/src/CharacterDetail.js).

Для решения данной проблемы можно использовать несколько подходов, давайте посмотрим на один из них, который использует
преимущества функции очистки хука `useEffect`. Если ваш компонент может сделать несколько запросов и но нужно отобразить
только последний результат, то вы можете использовать для этого логический флаг.

```jsx
export const CharacterDetail = ({characterId}) => {
  const [character, setCharacter] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchData = async (id) => {
      const response = await fetch(`https://rickandmortyapi.com/api/character/${id}/`);
      const newData = await response.json();

      if (active) {
        setData(newData);
      }
    };

    fetchData(characterId);

    return () => {
      active = false;
    };

  }, [characterId]);

  if (character) {
    return <div>{character.name}</div>;
  } else {
    return null;
  }
};
```

Обратите внимание на переменную `active`, которая инициализируется значением `true` и устанавливается в значение `false`
во время очистки. Это гарантирует, что ваш код не будет страдать от `состояний гонки`: сетевые ответы могут приходить в
другом порядке, чем вы их отправили.

Второй пример реализации с `AbortController` можно найти в оригинальной
статье
🔗 [Fixing Race Conditions in React with useEffect](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect).

Если вы постоянно размещаете код для получения данных непосредственно внутри функции `useEffect` в компонентах React,
это
может привести к нескольким проблемам:

- Если вы размещаете код для получения данных внутри `useEffect` в каждом компоненте, который требует эти данные, это
  может привести к дублированию кода.
- Когда код получения данных размещается внутри `useEffect`, кэширование данных может быть сложным, так как каждый раз
  при монтировании компонента будет выполняться новый запрос.
- Если вы внезапно решите добавить оптимизации, такие как кэширование, серверный рендеринг или управление состоянием
  данных с использованием библиотеки управления состоянием (например, Redux), вам придется переписывать множество
  компонентов, в которых код получения данных был размещен непосредственно в `useEffect`.

Вместо этого, более оптимальным и легким для обслуживания подходом может быть вынесение кода для получения данных в
отдельные функции или хуки и использование их внутри `useEffect`. Такой подход позволяет сделать код более модульным,
уменьшить повторяемость и облегчить внесение оптимизаций в будущем.

Этот список недостатков не относится только к React. Это применимо к выборке данных при монтировании с помощью любой
библиотеки. Как и в случае с маршрутизацией, получение данных не является тривиальной задачей, поэтому разработчики
React рекомендуют следующие подходы:

- Если вы используете фреймворк, используйте его встроенный механизм получения данных. Современные фреймворки React
  имеют интегрированные механизмы получения данных, которые эффективны и не страдают от вышеперечисленных ошибок.
- В противном случае рассмотрите возможность использования или создания кэша на стороне клиента. Популярные решения с
  открытым исходным кодом включают [React Query](https://react-query.tanstack.com/), [useSWR](https://swr.vercel.app/) и
  [React Router 6.4+](https://reactrouter.com/en/main/start/overview). Вы также можете создать свое собственное решение,
  и в этом случае вы будете использовать `Effects` «под капотом», а также добавить логику для дедупликации запросов,
  кэширования ответов и предотвращения сетевых водопадов (путем предварительной загрузки данных или повышения
  требований к данным для маршрутов).

[⬆ Back to Top](#получение-данных---fetching-data)

### Пример создания пользовательского хука useFetch

Мы можем определить для запроса два состояния внутри нашего пользовательского хука useFetch: переменная с полученными
данными и переменная которая будет содержать ошибку в случае неудачи запроса. Когда запрос выполняется успешно и данные
получены, они будут переданы компоненту из этого хука. Если что-то пойдет не так, хук вернет ошибку.

```jsx
import { useState, useEffect } from 'react';

export const useFetch = (uri) => {
  const [data, setData] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    if (!uri) {
      return;
    }

    async function getData(uri) {
      try {
        const response = await fetch(uri);

        if (response?.ok) {
          const data = (await response.json();

          setData(data);
        } else {
          setError(new Error(`Something went wrong...`));
        }
      } catch (error) {
        setError(error);
      }
    }

    void getData(uri);

    return () => {
      setError(undefined);
      setData(undefined);
    };
  }, [uri]);

  return {data, error};
};
```

Все два состояния управляются внутри хука `useEffect`. Этот хук вызывается каждый раз при изменении значения `uri`. Если
`uri` отсутствует, запрос на выборку не выполняется. Когда uri есть, начинается запрос на выборку. Если запрос
выполняется успешно, мы передаем полученный JSON в функцию `setData`, изменяя значение состояния для данных. Если что-то
пойдет не так, мы перехватим значение и передадим его в `setError`, который изменит значение состояния на `error`.

🔗 [Ссылка на деплой приложения с примером запроса](https://fetch-data-ab1e50.netlify.app)

Готовый пример с приложением находится в `src` раздела chapter-13.

Для запуска примера с готовым приложением выполните команды:

```shell
git clone https://github.com/shopot/react-101.git

git checkout chapter-13

npm install

npm run dev
```

Документация по теме:

- 🔗 [Fetching data with Effects](https://react.dev/reference/react/useEffect#fetching-data-with-effects)
- 🔗 [Fetching data](https://react.dev/learn/you-might-not-need-an-effect#fetching-data)
- 🔗 [Fixing Race Conditions with useEffect](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)
- 🔗 [TypeScript useFetch](https://usehooks-ts.com/react-hook/use-fetch)
- 🔗 [How to fetch data in React with performance in mind](https://www.developerway.com/posts/how-to-fetch-data-in-react)

[⬆ Back to Top](#получение-данных---fetching-data)
