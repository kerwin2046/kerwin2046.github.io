---
title: "告别「知其然而不知其所以然」：优雅的 React 官方文档深度拆解与内功心法"
description: "从 React 思想与前端演进、声明式 UI、组件化到 Hooks，系统拆解 React 官方文档背后的设计理念与内功心法。"
date: "2024-08-20"
author: "Kerwin"
tag: "Frontend"
---

# 1. React 思想与前端演进

## 1.1 早期前端与命令式编程

在 Web 开发的早期，开发者们使用 **JavaScript** 和 **jQuery** 等库来为静态的 HTML 页面注入活力。

1. **核心思路：** “命令式编程”
    * 开发者需要**精确地**告诉浏览器每一步操作：
        1.  找到这个 DOM 元素；
        2.  修改它的样式；
        3.  替换它的文本内容。

2. **面临的困境：**
    * 随着应用规模和复杂度不断攀升，直接操作 DOM 的方式很快会导致 **代码逻辑混乱**。
    * UI 状态与数据状态的同步变得异常困难。
    * 代码最终演变成难以维护的 **“面条代码”**。

## 1.2 过渡与设计模式的引入

为了解决这一困境，前端社区引入了 **MVC** 和 **MVVM** 等设计模式，诞生了像 **AngularJS** 和 **早期 Vue** 这样的框架。

* 它们通过 **数据绑定** 的方式，将开发者从繁琐的 DOM 操作中解放出来，这是一个巨大的进步。
* 然而，React 的出现，带来了一种更为**纯粹和强大**的心智模型。

## 1.3 React 核心思想：声明式编程

React 的核心思想可以被一个优美的公式精炼：

**UI= f(State）**

### 1.3.1 公式含义

| 元素 | 含义 |
| :--- | :--- |
| **UI** | 用户界面 (User Interface) |
| **State** | 应用程度状态 (Application State) |
| **$f$** | 一个函数 (Function) |

![](https://assets2025.oss-cn-beijing.aliyuncs.com/static/20251101112429748.png)

### 1.3.2 核心理念

你不再需要思考当数据变化时，应该分步去修改界面。你唯一需要做的，就是：

> **清晰地描述出“在任何特定状态下，你的界面应该是什么样子”**。

### 1.3.3 状态管理机制

* 当状态发生改变时，React 会像一个**高效的管家**。
* 它自动地、以最优的方式去计算出新旧界面之间的**差异**。
* 并更新 DOM 中需要变化的部分，**就会自动地体现在视图上**。

🆚 编程范式对比

这种编程范式被称为 **“声明式编程”**，它与早期的 **“命令式编程”** 形成了鲜明对比。

# 2.使用vite搭建React + Typescript 开发环境 🌱

### 2.1 现代化的开发环境

> 理论的种子需要实践的土壤才能发芽。

要将 React 的思想付诸实践，我们首先需要一个**现代化的开发环境**。在过去，这通常意味着与复杂和复杂的 **Webpack** 配置进行一番搏斗。但现在，我们有了更优的选择：**Vite**。

### 2.2 Vite：颠覆性的前端构建工具

#### 2.2.1 核心优势

Vite 是一个**颠覆性的前端构建工具**，它极大地提升了前端的开发体验。

**其核心优势在于：**

1.  它利用了现代浏览器原生支持 **ES Module** 的特性。
2.  在开发阶段**无需对所有代码进行打包**。

#### 2.2.2 带来的体验提升

Vite 从而实现了：

* **几乎瞬时** 的服务器启动。
* **快如闪电** 的热模块更新 (HMR)。

这意味着您修改代码后，**几乎可以立即在浏览器中看到变化**，这极大地加速了开发和测试的反馈循环。

### 2.3 搭建项目：选择用什么来做构建呢？

搭建一个基于 **Vite 的 React + TypeScript** 项目非常简单。整个过程始于您的 **终端（或命令行工具）**。

#### 2.3.1 创建项目

首先，运行创建项目的命令（我们选择使用 Vite 进行构建）：

#### 使用 NPM (Node Package Manager)

```bash
npm create vite@latest
```

#### 使用 Yarn (Node Package Manager)

```
yarn create vite@latest
```

#### 使用 PNPM (Node Package Manager)

```
pnpm create vite@latest
```

基于react

### 2.4 深入JSX语法与实战技巧

初次接触 React 代码时，最引人注目的无疑是 **JSX**。

#### 2.4.1 关键点：JSX 不是 HTML

JSX 是一种允许我们在 **JavaScript 文件中编写类似 HTML 结构代码** 的语法扩展。

> **请务必记住一个关键点：** **JSX 不是 HTML**，而是 **JavaScript 的一种特殊语法**。

#### 2.4.2 JSX 的本质

实际上，我们编写的每一行 JSX 代码，在经过**编译**（通常由 **Babel** 完成）后，都会被转换为一个普通的 **JavaScript 函数调用**——`React.createElement()`。

例如，这样一行 JSX：

```jsx
// 原始 JSX 代码
<h1 className="title">Hello, React</h1>
```

其本质是下面这段代码的**“语法糖”**：

JavaScript

```js
// 编译后的 JavaScript 代码
React.createElement(
  'h1', // 元素类型
  { className: 'title' }, // 属性 (Props)
  'Hello, React' // 子元素 (Children)
);
```

理解了 JSX 的本质是 **JavaScript**，我们就能更好地掌握它的语法规则。因为它基于 JS，所以它具备了 JavaScript 的全部动态能力。

我们可以使用**大括号 `{}`** 在 JSX 中嵌入任何有效的 **JavaScript 表达式**，无论是变量、数学运算，还是函数调用。

### 示例：嵌入 JavaScript 表达式

```javascript
const user = { name: 'Alice', level: 5 };

const greeting = (
  <h1>
    Welcome, {user.name.toUpperCase()}! Your access level is {user.level + 1}.
  </h1>
);
```

### 2.5 JSX 描述界面的核心规则

在使用 JSX 描述界面结构时，有几条核心规则需要遵守：

#### 2.5.1 单一根元素 (Single Root Element)

首先，一个组件返回的 JSX **必须拥有一个单一的根元素**。

* **如果想返回并列的多个元素：**
    * 可以使用一个外层 `div` 包裹它们。
    * **更好的做法** 是使用 **Fragment** (`<>...</>`)，它允许我们对元素进行分组，而不会在最终的 DOM 结构中添加额外的节点。

#### 2.5.2 属性的写法调整 (Case-Sensitive Attributes)

其次，由于 JSX 最终会被编译成 JavaScript，一些 HTML 属性的写法需要调整以避免与 JavaScript 的**保留关键字**冲突。

* **最常见的例子：**
    * `class` 属性需要写成 **`className`**。
    * `for` 属性需要写成 **`htmlFor`**。
* **事件名（Event Names）：** 事件名也遵循**驼峰命名法**，如 `onclick` 变为 **`onClick`**。

### 2.6 函数式组件（推荐）与类组件

在 React 中，定义组件主要有两种历史悠久的方式：**Class 组件** 和 **函数式组件**。虽然您在一些旧的项目或文档中仍会见到 Class 组件的身影，但理解它们之间的差异，将帮助您清晰地认识到为何整个 React 生态已经全面拥抱了函数式组件。

#### 2.6.1 类

```js
class App extends React.Component {
  render() {
    return (
      <div className="App">
        <h1>Hello, React with Vite and TypeScript!</h1>
      </div>
    )
  }
}
```

Class 组件是早期 React 中创建组件的主要方式。它基于 **ES6 的 Class 语法**，需要继承 `React.Component`。

* **状态管理：** 通过 `this.state` 来管理内部状态。
* **状态更新：** 通过 `this.setState()` 来更新状态。
* **UI 渲染：** UI 的描述必须放在 `render()` 方法中。

###### 示例：Class 组件实现的计数器

```javascript
class Counter extends React.Component {
  state = { count: 0 };

  handleIncrement = () => {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.handleIncrement}>Increment</button>
      </div>
    );
  }
}
```

####  2.6.2 函数式组件与 Hooks (现代实现)

与此相对，函数式组件是一个更为简洁和直观的方式。在早期，函数式组件仅仅是接收 Props 并返回 JSX 的**“哑”组件**，无法拥有自己的状态。然而，自 **React 16.8 引入 Hooks** 之后，一切都改变了。

**Hooks** (例如 `useState`) 让函数式组件也能拥有状态和其它 React 特性。现在，我们可以用一种更简单、更符合 JavaScript 函数式编程的方式来实现上面的计数器：

###### 示例：函数式组件 + Hooks 实现的计数器

```
import { useState } from 'react';

const FunctionalCounter = () => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
};
```

###### 总结：函数式组件的优势

两相对比，函数式组件的优势显而易见：

- **更简洁：** 代码量更少，并且完全消除了 `this` 关键字带来的困扰。
- **更重要的：** Hooks 的设计使得状态逻辑的复用变得异常简单。我们可以轻松地将相关逻辑封装在自定义 Hook 中，这在 Class 组件的时代是难以想象的。

正是由于这些压倒性的优势，**函数式组件与 Hooks 已成为现代 React 开发的绝对标准。**

### 2.7 如何写样式

在 React 中，为组件添加样式有多种主流方式，它们各有优势。

###### 🌟主流样式方案

| 方案                         | 描述                                                         | 适用场景                                     |
| :--------------------------- | :----------------------------------------------------------- | :------------------------------------------- |
| **外部 CSS/CSS Modules**     | 将样式写在独立的 `.css` 或 `.module.css` 文件中，并通过 `import` 导入。CSS Modules 可以自动隔离样式（避免命名冲突）。 | 大型项目、需要模块化和隔离样式时。           |
| **内联样式 (Inline Styles)** | 将样式直接写在元素的 `style` 属性中，属性值是一个 **JavaScript 对象**。 | 动态样式、小范围的局部调整。                 |
| **CSS-in-JS**                | 使用 JavaScript 对象或模板字符串来定义 CSS，并将其注入组件。代表工具有 Styled Components、Emotion 等。 | 样式需要依赖 JS 逻辑、希望深度组件化样式时。 |

###### 内联样式示例

注意：CSS 属性名需要从 **中划线命名** 转换为 **驼峰命名**。

```jsx
function MyComponent() {
  const styles = {
    color: 'blue',
    fontSize: '16px', // CSS中的 font-size
    padding: '10px'
  };

  return (
    <p style={styles}>
      这段文本应用了内联样式。
    </p>
  );
}
```

### 2.8 数据显示

React 组件通过 `props`（组件的输入）和 `state`（组件内部的状态）来驱动 UI 渲染。数据的显示主要通过 **JSX 嵌入表达式 `{}`** 来实现。

###### 示例：显示 Props 和 State 中的数据

```js
// 假设这是组件的 State 和 Props
const username = 'Leo';
const score = 95;

function WelcomeMessage(props) {
  return (
    <div>
      {/* 显示 Props 中的数据 */}
      <h1>欢迎回来, {props.name}!</h1> 
      {/* 显示组件内部的变量或计算结果 */}
      <p>您的分数是: {score}</p>
      <p>当前时间: {new Date().toLocaleTimeString()}</p>
    </div>
  );
}
```

### 2.9 条件渲染 (Conditional Rendering)

在 React 中，我们可以根据条件来决定渲染哪些元素，或者如何渲染一个元素。常用的方法有：

| **方法**                | **语法特点**                                            | **适用场景**                    |
| ----------------------- | ------------------------------------------------------- | ------------------------------- |
| **`if...else` 语句**    | 在 JSX **外部**使用标准 JS 逻辑判断。                   | 逻辑复杂、需要渲染不同组件时。  |
| **三元运算符 (`? :`)**  | 在 JSX **内部**实现简单的二选一渲染。                   | 简单的条件切换，例如显示/隐藏。 |
| **逻辑与运算符 (`&&`)** | 在 JSX **内部**实现条件渲染，如果条件为真，则渲染元素。 | 仅在满足条件时渲染某元素。      |

###### 示例：逻辑与运算符

JavaScript

```js
function WarningBanner(props) {
  // 如果 props.warn 为 false 或 null，则不渲染任何内容
  return props.warn && (
    <div className="warning">
      警告！您已触发一个错误！
    </div>
  );
}
```

### 3.1 列表渲染 (List Rendering)

列表渲染通常使用 JavaScript 的 **`Array.prototype.map()`** 方法。`map()` 用于将一个数组转换为一个元素数组（即 React 元素列表）。

### 3.1.2 关键点：`key` 属性

渲染列表时，**每个列表项必须包含一个唯一的 `key` 属性**。

- **作用：** `key` 帮助 React 识别哪些元素发生了变化、被添加或被删除。它能保证列表的性能和稳定性。
- **要求：** `key` 必须在兄弟元素中是唯一的。通常使用数据项本身的唯一 ID。

###### 示例：使用 `map()` 渲染列表

```js
const posts = [
  { id: 1, title: 'Hello World', content: 'Welcome to the blog.' },
  { id: 2, title: 'Installation', content: 'How to install React.' }
];

function PostList() {
  return (
    <ul>
      {posts.map(post =>
        // **注意：每个列表项都需要一个唯一的 key**
        <li key={post.id}> 
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </li>
      )}
    </ul>
  );
}
```

### 3.2 事件

React 事件处理与 DOM 事件处理非常相似，但有一些不同：

- **驼峰命名：** React 事件名使用驼峰命名法（例如 `onClick`，而不是 `onclick`）。
- **传递函数：** 您传入的是一个 **JavaScript 函数** 作为事件处理程序，而不是一个字符串。
- **事件对象：** React 会传递一个合成事件对象（SyntheticEvent），它封装了浏览器的原生事件对象。

#### 3.2.1 事件名（不带括号）

在 JSX 中，事件处理函数通常是这样引用的（注意：**不带括号**，因为我们传递的是函数本身，而不是函数的调用结果）：

### 3.3 更新界面 State：第一个 Hook - `useState`

在函数式组件中，使用 `useState` 这个 Hook 来添加和管理状态。

###### `useState` 的用法

`useState` 返回一个包含两个元素的数组：

1. **当前 State 的值**。
2. **一个用于更新 State 的函数**（Setter 函数）。

###### 示例

```js
import React, { useState } from 'react';

function Counter() {
  // 数组解构赋值：count 是状态值，setCount 是更新函数，0 是初始值
  const [count, setCount] = useState(0); 

  const handleIncrement = () => {
    // 使用 Setter 函数来更新 State
    setCount(count + 1); 
    // **注意：永远不要直接修改状态值，如 count = 5，必须使用 setCount**
  };

  return (
    <div>
      <p>当前的计数值是: {count}</p>
      <button onClick={handleIncrement}>增加</button>
    </div>
  );
}
```

### 3.4 Hooks 的使用规则

Hooks 是一组特殊的函数，它们有严格的使用限制：

> **“Hook 比普通函数更为严格。你只能在组件（或其他 Hook）的顶层调用 Hook。”**

###### ⚠️ 必须遵守的规则

1. **只在最顶层调用 Hook：** 不要在循环、条件语句或嵌套函数中调用 Hook。这保证了 Hook 在组件的每次渲染中都以相同的顺序被调用。
2. **只在 React 函数中调用 Hook：** 只能在函数式组件或自定义 Hook 中调用 Hook。不要在普通的 JavaScript 函数或 Class 组件中调用。

遵守这些规则是确保 React 状态逻辑正确运行的关键。

完整代码见GitHub: https://github.com/yi-echo/yi-echo