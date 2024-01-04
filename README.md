# Списки и ключи - React Key Concepts

Для отображения несколько похожих компонентов из коллекции данных (списки) следует использовать [методы массива JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), например такие как `map` и `filter`.

Например имеется следующий список:

```html
<ul>
  <li>Creola Katherine Johnson: mathematician</li>
  <li>Mario José Molina-Pasquel Henríquez: chemist</li>
  <li>Mohammad Abdus Salam: physicist</li>
  <li>Percy Lavon Julian: chemist</li>
  <li>Subrahmanyan Chandrasekhar: astrophysicist</li>
</ul>
```

💡 Единственная разница между элементами этого списка - это их содержимое и данные.

Следующий пример демонстрирует как создать список элементов из массива при помощи `Array.prototype.map()`:

```jsx
// Переместить данные в массив
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist',
];

export const List = () => {
  // Создать новый массив из JSX элементов (ReactNode) listItems
  const listItems = people.map((person) => <li>{person}</li>);

  // Вернуть listItems из компонента, обернутого в тег <ul>
  return <ul>{listItems}</ul>;
};
```

Если выполнить данный код, то в консоли можно увидеть предупреждение о том, что каждый дочерний элемент массива или итератора должен иметь уникальный ключ:

```diff
- Warning: Each child in a list should have a unique “key” prop.
```

Данное предупреждение появляется, потому что при попытке рендеринга коллекции внутри компонента необходимо добавить ключ.

В React уникальный ключ используется для того, чтобы определить, для каких компонентов в коллекции требуется повторный рендеринг.

Представьте, что файлы на вашем рабочем столе не имеют имен. Вместо этого вы будете обращаться к ним по порядку - первый файл, второй файл и так далее. К этому можно привыкнуть, но как только вы удалите файл, это приведет к путанице. Второй файл станет первым файлом, третий файл станет вторым файлом и так далее.

Имена файлов в папке и ключи JSX в массиве служат той же цели. Они позволяют нам однозначно идентифицировать элемент между его соседями. Хорошо выбранный ключ предоставляет больше информации, чем позиция в массиве. Даже если позиция изменится из-за изменения порядка, ключ позволяет React идентифицировать элемент на протяжении всего его существования.

💡 Добавление уникального ключа позволяет React не выполнять повторный рендеринг всей коллекции целиком при каждом обновлении и выполнить только обновление тех компонентов которые действительно были изменены.

### Где взять ключ

Различные источники данных предоставляют разные источники ключей:

- Если ваши данные поступают из базы данных, можно (нужно) использовать ключи/идентификаторы базы данных, которые уникальны по своей природе.
- Если ваши данные генерируются и сохраняются локально (например, заметки в приложении для создания заметок), используйте увеличивающийся счетчик, `crypto.randomUUID()` или такой пакет, как `uuid`, при создании элементов.

### ⚠️ Правила для ключей

- Ключи должны быть уникальными в пределах одной коллекции (массива). Однако можно использовать одни и те же ключи для узлов JSX в разных массивах.
- Ключи не должны меняться, иначе это противоречит их назначению! Не генерируйте их во время рендеринга.
- Избегайте использования индекса элемента в массиве в качестве его ключа. Такой индекс как ключ часто приводит к тонким и запутанным ошибкам.

Вместо того, чтобы генерировать ключи на лету, вам следует включить их в свои данные.

```jsx
// Массив данных где каждый элемент содержит уникальный идентификатор (id)
const people = [
  {
    id: 1, // Used in JSX as a key
    name: 'Creola Katherine Johnson',
    profession: 'mathematician',
  },
  {
    id: 2, // Used in JSX as a key
    name: 'Mario José Molina-Pasquel Henríquez',
    profession: 'chemist',
  },
  {
    id: 3, // Used in JSX as a key
    name: 'Mohammad Abdus Salam',
    profession: 'physicist',
  },
  {
    id: 4, // Used in JSX as a key
    name: 'Percy Lavon Julian',
    profession: 'chemist',
  },
  {
    id: 5, // Used in JSX as a key
    name: 'Subrahmanyan Chandrasekhar',
    profession: 'astrophysicist',
  },
];

export const List = () => {
  // Создание списка из нескольких узлов DOM для каждого элемента
  const listItems = people.map(({ id, name, profession }) => (
    <Fragment key={id}>
      <h1>{name}</h1>
      <p>{profession}</p>
    </Fragment>
  ));

  // Вернуть listItems из компонента, обернутого в тег <ul>
  return <ul>{listItems}</ul>;
};
```

Фрагменты исчезают из DOM, поэтому создается плоский список `<h1>`, `<p>`, `<h1>`, `<p>` и т. д.

**[⬆ Back to Top](#списки-и-ключи---react-key-concepts)**

Готовый пример с приложением находится в `src`.

![list-keys](./list-keys-app.png)

Для запуска примера с готовым приложением выполните команды:

```shell
git clone https://github.com/shopot/react-101.git

git checkout rendering-lists

npm install

npm run dev
```

Документация по теме:

- 🔗 [Rendering Lists (react.dev)](https://react.dev/learn/rendering-lists)

**[⬆ Back to Top](#списки-и-ключи---react-key-concepts)**
