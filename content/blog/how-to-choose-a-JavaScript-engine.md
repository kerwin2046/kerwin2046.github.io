---
title: "代码中出现相同的变量，JavaScript引擎如何选择"
description: "理解作用域链是理解闭包的基础，而闭包在 JavaScript 中几乎无处不在，同时作用域和作用域链还是所有编程语言的基础。所以，如果你想学透一门语言，作用域和作用域链一定是绕不开的。"
date: "2023-11-15"
author: "Kerwin"
tag: "Articles"
---
> **2025 更新说明**：本文在原有内容基础上进行了深度修订，新增了闭包在 V8 引擎中的内部实现机制、闭包的现代应用模式（包括 React Hooks 中的闭包陷阱）、闭包与内存泄漏的深入分析（包括 ES2021 的 WeakRef 和 FinalizationRegistry），以及词法作用域与动态作用域的更清晰对比。希望这些更新能帮助你在实际开发中更自信地使用闭包。

理解作用域链是理解闭包的基础，而闭包在 JavaScript 中几乎无处不在，同时作用域和作用域链还是所有编程语言的基础。所以，如果你想学透一门语言，作用域和作用域链一定是绕不开的。

那今天我们就来聊聊什么是作用域链，并通过作用域链再来讲讲什么是闭包。

首先我们来看下面这段代码：

```js
function bar() {
  console.log(myName)
}
function foo() {
  var myName = '极客邦'
  bar()
}
var myName = '极客时间'
foo()
```

你觉得这段代码中的 bar 函数和 foo 函数打印出来的内容是什么？这就要分析下这两段代码的执行流程。

通过前面几篇文章的学习，想必你已经知道了如何通过执行上下文分析代码的执行流程了。那么当这段代码执行到 bar 函数内部时，其调用栈的状态图如下所示：

![bar调用栈](./img/bar-call-stack.png)

从图中可以看出，全局执行上下文和 foo 函数的执行上下文中都包含变量 myName，那 bar 函数里面 myName 的值到底该选择哪个呢？

也许你的第一反应是按照调用栈的顺序来查找变量，查找方式如下：

1. 先查找栈顶是否存在 myName 变量，但是这里没有，所以接着往下查找 foo 函数中的变量。

2. 在 foo 函数中查找到了 myName 变量，这时候就使用 foo 函数中的 myName。

如果按照这种方式来查找变量，那么最终执行 bar 函数打印出来的结果就应该是"极客邦"。但实际情况并非如此，如果你试着执行上述代码，你会发现打印出来的结果是"极客时间"。为什么会是这种情况呢？要解释清楚这个问题，那么你就需要先搞清楚作用域链了。

## 作用域链

关于作用域链，很多人会感觉费解，但如果你理解了调用栈、执行上下文、词法环境、变量环境等概念，那么你理解起来作用域链也会很容易。所以很是建议你结合前几篇文章将上面那几个概念学习透彻。

其实在每个执行上下文的变量环境中，都包含了一个外部引用，用来指向外部的执行上下文，我们把这个外部引用称为 `outer`。

当一段代码使用了一个变量时，JavaScript 引擎首先会在"当前的执行上下文"中查找该变量，比如上面那段代码在查找 myName 变量时，如果在当前的变量环境中没有查找到，那么 JavaScript 引擎会继续在 outer 所指向的执行上下文中查找。为了直观理解，你可以看下面这张图：

![outer指向](./img/outer-point.png)

从图中可以看出，bar 函数和 foo 函数的 outer 都是指向全局上下文的，这也就意味着如果在 bar 函数或者 foo 函数中使用了外部变量，那么 JavaScript 引擎会去全局执行上下文中查找。我们把这个查找的链条就称为作用域链。

现在你知道变量是通过作用域链来查找的了，不过还有一个疑问没有解开，foo 函数调用了 bar 函数，那为什么 bar 函数的外部引用是全局执行上下文，而不是 foo 函数的执行上下文？

要回答这个问题，你还需要知道什么是词法作用域。这是因为在 JavaScript 执行过程中，其作用域链是由词法作用域决定的。

## 词法作用域

> 词法作用域就是指作用域是由代码中函数声明的位置来决定的，所以词法作用域是静态的作用域，通过它就能够预测代码在执行过程中如何查找标识符。

这么讲可能不太好理解，你可以看下面这张图：

![词法作用域链](./img/lexical-scope-chain.png)

从图中可以看出，词法作用域就是根据代码的位置来决定的，其中 main 函数包含了 bar 函数，bar 函数中包含了 foo 函数，因为 JavaScript 作用域链是由词法作用域决定的，所以整个词法作用域链的顺序是：foo 函数作用域 --> bar 函数作用域 --> main 函数作用域 --> 全局作用域。

了解了词法作用域以及 JavaScript 中的作用域链，我们再回过头来看看上面的那个问题：在开头那段代码中，foo 函数调用了 bar 函数，那为什么 bar 函数的外部引用是全局执行上下文，而不是 foo 函数的执行上下文？

这是因为根据词法作用域，foo 和 bar 的上级作用域都是全局作用域，所以如果 foo 或者 bar 函数使用了一个它们没有定义的变量，那么它们会到全局作用域去查找。也就是说，词法作用域是代码阶段就决定好的，和函数是怎么调用的没有关系。

### 词法作用域 vs 动态作用域：一个关键区分

这里有必要深入对比一下**词法作用域（Lexical Scope）**和**动态作用域（Dynamic Scope）**，因为这个区分对于理解 JavaScript 的行为至关重要。

**词法作用域**（也叫静态作用域）是在代码编写阶段就确定的——变量的查找取决于函数在源码中**定义的位置**，而不是在运行时**被调用的位置**。JavaScript、Python、C/C++、Java 等绝大多数现代编程语言都采用词法作用域。

**动态作用域**则恰恰相反——变量的查找取决于函数的**调用链**，也就是运行时的调用栈。Bash shell、Emacs Lisp 等少数语言使用动态作用域。

用最开始的例子来说明：

```js
function bar() {
  console.log(myName) // 词法作用域：查找定义时的外部作用域（全局）
}
function foo() {
  var myName = '极客邦'
  bar() // 如果是动态作用域，bar 会在调用栈中查找，找到 foo 中的 myName
}
var myName = '极客时间'
foo() // 实际输出"极客时间"，因为 JavaScript 用的是词法作用域
```

如果 JavaScript 使用动态作用域，那么 `bar()` 会沿着调用栈去找 `myName`，先找到 `foo` 中的 `'极客邦'`。但 JavaScript 使用的是词法作用域，所以 `bar()` 沿着定义时的作用域链去找，直接找到全局的 `'极客时间'`。

**那 JavaScript 中有没有"动态作用域"的影子呢？** 严格来说没有，但 `this` 的绑定机制是 JavaScript 中最接近动态作用域的特性。`this` 的值不是在定义时确定的，而是在调用时根据调用方式动态决定的——这和动态作用域的思路非常相似。理解这一点，对你理解下一篇关于 `this` 的文章会有很大帮助。

```js
const obj = {
  name: '极客时间',
  getName() {
    return this.name // this 的值取决于调用方式，不是定义位置
  }
}

const fn = obj.getName
console.log(obj.getName()) // '极客时间' —— 通过 obj 调用，this 指向 obj
console.log(fn())          // undefined —— 直接调用，this 指向全局（严格模式下 undefined）
```

所以可以这样记忆：**JavaScript 的变量查找遵循词法作用域（静态），而 `this` 的绑定遵循调用规则（动态）**。这两套机制并行存在，也是 JavaScript 中最容易混淆的两个概念。

## 块级作用域中的变量查找

前面我们通过全局作用域和函数作用域来分析了作用域链，那接下来我们再来看看块级作用域中变量是如何查找的？在编写代码的时候，如果你使用了一个在当前作用域中不存在的变量，这时 JavaScript 引擎就需要按照作用域链在其他作用域中查找该变量，如果你不了解该过程，那就会有很大概率写出不稳定的代码。

我们还是先看下面这段代码：

```js
function bar() {
  var myName = '极客世界'
  let test1 = 100
  if(1) {
    let myName = 'Chrome 浏览器'
    console.log(test)
  }
}
function foo() {
  var myName = '极客邦'
  let test = 2
  {
    let test = 3
    bar()
  }
}
var myName = '极客时间'
let myAge = 10
let test = 1
foo()
```

你可以自己先分析下这段代码的执行流程，看看能否分析出来执行结果。

要想得出其执行结果，那接下来我们就得站在作用域链和词法环境的角度来分析下其执行过程。

在上篇文章中我们已经介绍过了，ES6 是支持块级作用域的，当执行到代码块时，如果代码块中有 let 或者 const 声明的变量，那么变量就会存放到该函数的词法环境中。对于上面这段代码，当执行到 bar 函数内部的 if 语句块时，其调用栈的情况如下图所示：

![调用栈](./img/call-stack.png)

现在是执行到 bar 函数的 if 语块之内，需要打印出来变量 test，那么就需要查找到 test 变量的值，其查找过程我已经在上图中使用序号 1、2、3、4、5 标记出来了。

下面我就来解释下这个过程。首先是在 bar 函数的执行上下文中查找，但因为 bar 函数的执行上下文中没有定义 test 变量，所以根据词法作用域的规则，下一步就在 bar 函数的外部作用域中查找，也就是全局作用域。

至于单个执行上下文中如何查找变量，我在上一篇文章中已经做了介绍，这里就不重复了。

## 闭包

了解了作用域链，接着我们就可以来聊聊闭包了。关于闭包，理解起来可能会是一道坎，特别是在你不熟悉 JavaScript 这门语言的时候，接触闭包很可能会让你产生一些挫败感，因为你很难通过理解背后的原理来彻底理解闭包，从而导致学习过程中似乎总是似懂非懂。最要命的是，JavaScript 代码中还总是充斥着大量的闭包代码。

但理解了变量环境、词法环境和作用域链等概念，那接下来你再理解什么是 JavaScript 中的闭包就容易多了。这里你可以结合下面这段代码来理解什么是闭包：

```js
function foo() {
  var myName = '极客时间'
  let test1 = 1
  const test2 = 2
  var innerBar = {
    getName: function() {
      console.log(test1)
      return myName
    },
    setName: function(newName) {
      myName = newName
    }
  }
  return innerBar
}
var bar = foo()
bar.setName('极客邦')
bar.getName()
console.log(bar.getName())
```

首先我们看看当执行到 foo 函数内部的 return innerBar 这行代码时调用栈的情况，你可以参考下图：

![foo调用栈](./img/foo-call-stack.png)

从上面的代码可以看出，innerBar 是一个对象，包含了 getName 和 setName 的两个方法（通常我们把对象内部的函数称为方法）。你可以看到，这两个方法都是在 foo 函数内部定义的，并且这两个方法内部都使用了 myName 和 test1 两个变量。

根据词法作用域的规则，内部函数 getName 和 setName 总是可以访问它们的外部函数 foo 中的变量，所以当 innerBar 对象返回给全局变量 bar 时，虽然 foo 函数已经执行结束，但是 getName 和 setName 函数依然可以使用 foo 函数中的变量 myName 和 test1。所以当 foo 函数执行完成之后，其整个调用栈的状态如下图所示：

![foo执行完的调用栈](./img/foo-execute-call-stack.png)

从上图可以看出，foo 函数执行完成之后，其执行上下文从栈顶弹出了，但是由于返回的 setName 和 getName 方法中使用了 foo 函数内部的变量 myName 和 test1，所以这两个变量依然保存在内存中。这像极了 setName 和 getName 方法背的一个专属背包，无论在哪里调用了 setName 和 getName 方法，它们都会背着这个 foo 函数的的专属背包。

之所以是专属背包，是因为除了 setName 个 getName 函数之外，其他任何地方都是无法访问该背包的，我们就可以把这个背包称为 foo 函数的闭包。

好了，现在我们终于可以给闭包一个正式的定义了。在 JavaScript 中，根据词法作用域的规则，内部函数总是可以访问其外部函数中声明的变量，当通过调用一个外部函数返回一个内部函数后，即使该外部函数已经执行结束了，但是内部函数引用外部函数的变量依然保存在内存中，我们就把这些变量的集合称为闭包。比如外部函数是 foo，那么这些变量的集合就称为 foo 函数的闭包。

### 闭包在 V8 引擎中的内部实现

理解了闭包的概念之后，我们再深入一步，看看 V8 引擎到底是如何实现闭包的。这部分知识可以帮你从引擎层面真正理解闭包的行为，而不只是停留在概念层面。

**"Closure" 是 V8 中的一个特殊内部对象。** 在 V8 的实现中，每个 JavaScript 函数在创建时都会生成一个内部的 `JSFunction` 对象，而这个对象上会持有一个叫做 `Context`（上下文）的引用链。当一个函数引用了外部作用域的变量时，V8 会创建一个特殊的 `Context` 对象来存放这些被引用的变量——这就是你在 Chrome DevTools 中看到的 `Closure(foo)` 背后的实体。

**V8 在编译阶段就分析好了哪些变量需要被捕获。** 这一点非常关键。V8 并不是在运行时才"发现"某个变量被闭包引用了，而是在解析（Parse）和编译阶段就通过**预解析器（PreParser）**完成了变量分析。具体过程如下：

1. 当 V8 解析一个函数时，它会扫描内部函数体，检查哪些变量被内部函数引用了。
2. 如果某个变量被内部函数引用（也就是"被捕获"了），V8 会将这个变量标记为 `CONTEXT` 类型，意味着它不会存放在栈上，而是分配到堆上的 `Context` 对象中。
3. 没有被任何内部函数引用的变量，则正常存放在栈上，函数执行完毕后随执行上下文一起被销毁。

回到我们的例子：

```js
function foo() {
  var myName = '极客时间'  // 被 getName 和 setName 引用 → 放入 Context（堆）
  let test1 = 1           // 被 getName 引用 → 放入 Context（堆）
  const test2 = 2         // 没有被任何内部函数引用 → 留在栈上，foo 执行完就销毁
  var innerBar = {
    getName: function() {
      console.log(test1)
      return myName
    },
    setName: function(newName) {
      myName = newName
    }
  }
  return innerBar
}
```

注意 `test2` 虽然和 `myName`、`test1` 定义在同一个函数中，但因为没有被任何内部函数引用，所以 V8 不会把它放进闭包的 `Context` 对象。**只有真正被捕获的变量才会存活在堆上**，这是 V8 的一个重要优化——它避免了不必要的内存占用。

**闭包与垃圾回收的关系。** 理解了 V8 的这个机制后，闭包与垃圾回收的关系就很清晰了：

- `Context` 对象被 `JSFunction` 引用，只要 `JSFunction` 还存活（即还有引用指向它），`Context` 就不会被回收。
- 当所有引用闭包的函数都不再可达时，`Context` 对象就变成了垃圾回收的候选对象。
- 前面说的 `test2`，因为根本没有进入 `Context`，所以 `foo` 执行完毕后就被立即释放了——这就是 V8 "按需捕获"策略的优势。

你可以在 Chrome DevTools 中验证这一点：在断点处查看 Scope 面板，`Closure(foo)` 里只会列出 `myName` 和 `test1`，而不会出现 `test2`。

那这些闭包是如何使用的呢？当执行到 bar.setName 方法中的 `myName = '极客邦'` 这句代码时，JavaScript 引擎会沿着"当前执行上下文 --> foo 函数闭包 --> 全局执行上下文"的顺序来查找 myName 变量，你可以参考下面的调用栈状态图：

![setName的调用栈](./img/setName-call-stack.png)

从图中可以看出，setName 的执行上下文没有 myName 变量，foo 函数的闭包中包含了变量 myName，所以调用 setName 时，会修改 foo 闭包中的 myName 变量的值。

同样的流程，当调用 bar.getName 的时候，所访问的变量 myName 也是位于 foo 函数闭包中的。

你也可以通过"开发者工具"来看看闭包的情况，打开 Chrome 的"开发者工具"，在 bar 函数任意地方打上断点，然后刷新页面，可以看到如下内容：

![Chrome调试工具](./img/chrome-tool-closure.png)

从图中可以看出来，当调用 bar.getName 的时候，右边 Scope 项就体现出了作用域链的情况：Local 就是当前的 getName 函数的作用域，Closure(foo) 是指 foo 函数的闭包，最下面的 Global 就是指全局作用域，从"Local --> Closure(foo) --> Global"就是一个完整的作用域链。

所以说，你以后也可以通过 Scope 来查看实际代码作用域链的情况，这样调试代码也会比较方便。

## 闭包的现代应用模式

闭包不仅是一个理论概念，它在实际的 JavaScript 开发中有着广泛而深入的应用。了解这些应用模式，可以帮你更好地理解现有代码，也能让你在编写代码时做出更明智的设计选择。

### 1. 模块模式（Module Pattern）

在 ES6 模块出现之前，闭包是 JavaScript 中实现模块化和私有变量的主要方式。经典的模块模式基于 IIFE（立即调用函数表达式）：

```js
// 经典模块模式（IIFE + 闭包）
var CounterModule = (function() {
  // 私有变量，外部无法直接访问
  var count = 0
  var log = []

  // 私有函数
  function addLog(action) {
    log.push({ action, count, time: Date.now() })
  }

  // 返回公共 API
  return {
    increment: function() {
      count++
      addLog('increment')
    },
    decrement: function() {
      count--
      addLog('decrement')
    },
    getCount: function() {
      return count
    },
    getLog: function() {
      return [...log] // 返回副本，防止外部修改
    }
  }
})()

CounterModule.increment()
CounterModule.increment()
console.log(CounterModule.getCount()) // 2
console.log(CounterModule.count)      // undefined —— 无法直接访问私有变量
```

这段代码的核心在于：IIFE 执行后返回一个对象，该对象的方法通过闭包持有对 `count` 和 `log` 的引用。外部代码只能通过返回的公共方法来操作这些变量，从而实现了真正的"私有性"。

**你现在还能在很多遗留代码和第三方库中见到这种模式。** 比如 jQuery 插件、一些老旧的前端项目，都大量使用了 IIFE + 闭包的方式来组织代码。理解这种模式对于维护遗留系统非常重要。

### 2. ES Modules：模块模式的现代替代

ES6 引入的原生模块系统（ES Modules）从语言层面提供了模块化支持，本质上取代了基于闭包的模块模式：

```js
// counter.js —— ES Module
let count = 0         // 模块级作用域，外部不可见
const log = []

function addLog(action) {
  log.push({ action, count, time: Date.now() })
}

// 只有 export 的才对外可见
export function increment() {
  count++
  addLog('increment')
}

export function decrement() {
  count--
  addLog('decrement')
}

export function getCount() {
  return count
}
```

ES Modules 中每个文件自成一个模块作用域，未被 `export` 的变量天然就是"私有"的。虽然底层机制不同（ES Modules 靠的是模块记录和模块作用域，而非函数闭包），但达到的效果——变量私有化和接口暴露——是一致的。

**如果你在启动新项目，优先使用 ES Modules。** 它们提供了静态分析能力（有利于 tree-shaking）、明确的依赖关系、以及更好的工具支持。闭包模块模式则适合理解原理和维护遗留代码。

### 3. 闭包在 React Hooks 中的应用（与陷阱）

React Hooks 是闭包在现代前端框架中最具代表性的应用之一。每次组件渲染时，Hooks 函数都会重新执行，而每次执行都会创建一个新的闭包，捕获当时的 state 和 props。这个机制既是 Hooks 强大的基础，也是"过期闭包（Stale Closure）"问题的根源。

```jsx
function Timer() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      // 这里的 count 被闭包捕获了——但它是哪次渲染的 count？
      console.log('当前 count:', count)
      setCount(count + 1)  // 问题！这里的 count 永远是 0
    }, 1000)
    return () => clearInterval(id)
  }, []) // 空依赖数组：effect 只在首次渲染时执行一次

  return <div>{count}</div>
}
```

**问题分析：** `useEffect` 的回调在第一次渲染时创建，此时闭包捕获的 `count` 值是 `0`。由于依赖数组为空，这个 effect 不会在后续渲染中重新创建，所以 `setInterval` 回调中的 `count` 永远停留在 `0`——这就是"过期闭包"。

**解决方案：** 使用函数式更新来避免对 state 值的直接依赖：

```jsx
function Timer() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      // 函数式更新：不依赖外部的 count，而是基于最新的 prev 值
      setCount(prev => prev + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return <div>{count}</div>
}
```

另一个常用的方案是使用 `useRef` 来持有一个"永远指向最新值"的引用：

```jsx
function Timer() {
  const [count, setCount] = useState(0)
  const countRef = useRef(count)
  countRef.current = count  // 每次渲染都更新 ref

  useEffect(() => {
    const id = setInterval(() => {
      console.log('当前 count:', countRef.current) // 始终是最新值
      setCount(prev => prev + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return <div>{count}</div>
}
```

**关键理解：** React Hooks 中的每一次渲染都创建了一个独立的闭包快照。这不是 bug，而是 React 的设计哲学——每次渲染都有自己独立的 state 和 props。理解这一点是正确使用 Hooks 的基础。

### 4. 闭包在事件处理器中的内存影响

事件处理器是闭包的另一个高频应用场景，但也是最容易产生内存问题的地方：

```js
function setupHandlers() {
  const largeData = new Array(1000000).fill('some data')  // 大量数据

  document.getElementById('btn').addEventListener('click', function handler() {
    // handler 闭包捕获了 largeData
    console.log(largeData.length)
  })

  // setupHandlers 执行完后，largeData 本应被释放
  // 但因为 handler 的闭包引用了它，所以 largeData 会一直留在内存中
  // 直到事件监听器被移除或 DOM 元素被销毁
}
```

**最佳实践：** 只在闭包中捕获必要的数据，对于大型数据可以只提取需要的部分：

```js
function setupHandlers() {
  const largeData = new Array(1000000).fill('some data')
  const dataLength = largeData.length  // 只提取需要的信息

  document.getElementById('btn').addEventListener('click', function handler() {
    console.log(dataLength)  // 闭包只捕获了 dataLength，largeData 可以被释放
  })
}
```

### 5. 私有类字段（#）：闭包隐私的替代方案

ES2022 引入的私有类字段（Private Class Fields）为实现数据隐私提供了语言级别的原生支持，在很多场景下可以替代基于闭包的隐私模式：

```js
// 旧方式：用闭包实现私有变量
function createCounter() {
  let count = 0  // 通过闭包实现"私有"
  return {
    increment() { return ++count },
    getCount() { return count }
  }
}

// 新方式：用私有类字段
class Counter {
  #count = 0  // 真正的语言级私有，在类外部访问会抛出语法错误

  increment() { return ++this.#count }
  getCount() { return this.#count }
}

const counter = new Counter()
counter.increment()
console.log(counter.getCount())  // 1
console.log(counter.#count)      // SyntaxError: Private field '#count' must be declared in an enclosing class
```

**闭包隐私 vs `#` 字段的取舍：**

| 特性 | 闭包隐私 | # 私有字段 |
|------|---------|-----------|
| 隐私强度 | 强（外部完全不可见） | 强（语法层面禁止访问） |
| 性能 | 每个实例创建新的函数对象 | 方法在原型上共享，更高效 |
| 序列化/调试 | 无法通过 JSON.stringify 看到 | DevTools 中可以查看 |
| 继承 | 不支持 | 子类无法访问父类私有字段 |
| 适用场景 | 函数式编程、工厂模式 | 面向对象编程、类体系 |

**建议：** 如果你的代码使用了类（class），优先使用 `#` 私有字段；如果你偏好函数式风格或需要工厂模式，闭包仍然是最好的选择。

## 闭包与内存泄漏的深入分析

理解闭包的内存行为，不仅是理论上的需要，更是实际开发中避免性能问题的关键。下面我们深入分析闭包相关的内存泄漏问题，以及如何排查和解决。

### 常见的闭包内存泄漏模式

**1. DOM 引用泄漏**

这是最经典也最常见的闭包内存泄漏模式：

```js
function attachHandler() {
  const element = document.getElementById('huge-table')  // 持有 DOM 引用

  element.addEventListener('click', function() {
    // 闭包持有 element 的引用
    // 即使后面从 DOM 树中移除了 #huge-table，因为闭包还在引用它，
    // element 及其所有子节点都无法被垃圾回收
    console.log('clicked')
  })
}

// 稍后...
document.getElementById('huge-table').remove()
// DOM 元素从页面移除了，但闭包中的引用还在 → 内存泄漏！
```

**修复方式：** 移除 DOM 元素时，同时清理事件监听器：

```js
function attachHandler() {
  const element = document.getElementById('huge-table')
  
  function handler() {
    console.log('clicked')
  }
  
  element.addEventListener('click', handler)
  
  // 返回清理函数
  return function cleanup() {
    element.removeEventListener('click', handler)
  }
}

const cleanup = attachHandler()
// 需要移除时：
cleanup()
document.getElementById('huge-table').remove()
```

**2. 未清除的定时器回调**

```js
function startPolling() {
  const heavyCache = loadHeavyResource()  // 加载大量数据

  setInterval(() => {
    // 闭包持有 heavyCache 的引用
    // 即使不再需要轮询了，如果不清除 interval，heavyCache 永远不会被释放
    processData(heavyCache)
  }, 5000)
}
// 忘记保存 interval ID → 无法清除 → 内存泄漏
```

**修复方式：** 始终保存定时器 ID，并在适当时清除：

```js
function startPolling() {
  const heavyCache = loadHeavyResource()

  const intervalId = setInterval(() => {
    processData(heavyCache)
  }, 5000)

  // 返回停止函数
  return function stop() {
    clearInterval(intervalId)
    // heavyCache 此后可以被垃圾回收
  }
}

const stopPolling = startPolling()
// 不再需要时：
stopPolling()
```

**3. 被遗忘的事件监听器**

```js
class DataView {
  constructor() {
    this.data = new Array(100000).fill('item')

    // 监听窗口 resize
    window.addEventListener('resize', () => {
      // 箭头函数的闭包持有 this（即 DataView 实例）的引用
      this.reflow()
    })
  }

  reflow() {
    // 根据 this.data 重新计算布局
  }

  destroy() {
    this.data = null
    // 问题！忘记移除 resize 监听器
    // 即使调用了 destroy()，窗口上的事件监听器还在
    // 闭包还持有 this 的引用，GC 无法回收这个 DataView 实例
  }
}
```

**修复方式：**

```js
class DataView {
  constructor() {
    this.data = new Array(100000).fill('item')
    this._onResize = () => this.reflow()
    window.addEventListener('resize', this._onResize)
  }

  reflow() { /* ... */ }

  destroy() {
    window.removeEventListener('resize', this._onResize)  // 移除监听器
    this.data = null
    this._onResize = null
  }
}
```

### 使用 Chrome DevTools 检测内存泄漏

Chrome DevTools 的 **Memory 面板**提供了强大的内存分析工具，是排查闭包内存泄漏的利器。

**方法一：Heap Snapshot（堆快照对比）**

1. 打开 DevTools → Memory 面板 → 选择 "Heap snapshot"
2. 在操作前拍一个快照（Snapshot 1）
3. 执行你怀疑会造成泄漏的操作（比如打开再关闭一个弹窗）
4. 手动触发一次 GC（点击面板上的垃圾桶图标）
5. 再拍一个快照（Snapshot 2）
6. 在 Snapshot 2 中选择 "Comparison" 视图，对比两个快照
7. 关注 "Delta" 列中正数的项——这些是新增且未被回收的对象
8. 搜索 "closure" 或特定的构造函数名，找到泄漏的闭包

**方法二：Allocation Timeline（分配时间线）**

1. 打开 DevTools → Memory 面板 → 选择 "Allocation instrumentation on timeline"
2. 点击开始录制
3. 执行操作
4. 停止录制
5. 时间线上的蓝色柱状图表示还存活的内存分配，灰色表示已被回收
6. 如果操作结束后仍有大量蓝色柱——说明有东西没有被正确回收

**方法三：Performance Monitor（实时监控）**

1. 打开 DevTools → 按 Ctrl+Shift+P → 搜索 "Performance Monitor"
2. 观察 "JS heap size" 指标
3. 反复执行同一操作，如果 JS 堆内存持续增长不回落，就很可能存在内存泄漏

### WeakRef 和 FinalizationRegistry：ES2021 的高级内存管理

ES2021 引入了 `WeakRef` 和 `FinalizationRegistry`，为 JavaScript 提供了更精细的内存管理能力。它们在某些闭包场景中特别有用。

**WeakRef：弱引用**

普通引用会阻止垃圾回收器回收对象，而 `WeakRef` 创建的弱引用则不会：

```js
function createCache() {
  const cache = new Map()

  return {
    set(key, value) {
      // 使用 WeakRef 存储值，不阻止值被垃圾回收
      cache.set(key, new WeakRef(value))
    },
    get(key) {
      const ref = cache.get(key)
      if (ref) {
        const value = ref.deref()  // 尝试获取原始对象
        if (value !== undefined) {
          return value
        }
        // 对象已被垃圾回收，清理缓存条目
        cache.delete(key)
      }
      return undefined
    }
  }
}

const cache = createCache()
let hugeObject = { data: new Array(1000000) }
cache.set('data', hugeObject)

console.log(cache.get('data'))  // { data: [...] }

hugeObject = null  // 移除强引用
// 之后某个时刻 GC 运行时，WeakRef 中的对象可能被回收
// cache.get('data') 可能返回 undefined
```

**FinalizationRegistry：清理回调**

`FinalizationRegistry` 允许你在对象被垃圾回收后执行清理逻辑：

```js
const registry = new FinalizationRegistry((heldValue) => {
  console.log(`对象 "${heldValue}" 已被垃圾回收，执行清理...`)
  // 可以在这里清理相关的缓存、关闭连接等
})

function loadResource(name) {
  const resource = fetchExpensiveResource(name)
  
  // 注册清理回调：当 resource 被回收时，执行回调
  registry.register(resource, name)
  
  return resource
}
```

**重要提醒：** `WeakRef` 和 `FinalizationRegistry` 是高级工具，在日常开发中应该谨慎使用。垃圾回收的时机是不确定的，你不应该依赖 `FinalizationRegistry` 来执行关键的业务逻辑。它们最适合的场景是缓存和资源清理。正如 TC39 提案中所说："如果你能不用它们就不用，如果必须用，请格外小心。"

## 闭包是怎么回收的

理解什么是闭包之后，接下来我们再来聊聊闭包什么时候销毁的。因为如果闭包使用不正确，会很容易造成内存泄漏的，关注闭包是如何回收的能让你正确地使用闭包。

通常，如果引用闭包的函数是一个全局变量，那么闭包会一直存在直到页面关闭；但如果这个闭包以后不再使用的话，就会造成内存泄漏。

如果引用闭包的函数是个局部变量，等函数销毁后，在下次 JavaScript 引擎执行垃圾回收时，判断闭包这块内容如果已经不再被使用了，那么 JavaScript 引擎的垃圾回收器就会回收这块内存。

结合我们前面讲的 V8 内部实现，这个过程可以更精确地描述为：当所有持有 `Context` 引用的 `JSFunction` 对象都变得不可达时，V8 的垃圾回收器（Orinoco）就会在下一次 GC 周期中回收这个 `Context` 对象以及其中存储的所有捕获变量。

所以在使用闭包的时候，你要尽量注意一个原则：如果该闭包会一直使用，那么它可以作为全局变量而存在；但如果使用频率不高，而且占用内存又比较大的话，那就尽量让它成为一个局部变量。

**更具体的实践建议：**

1. **及时解除引用。** 当你不再需要某个闭包时，将持有它的变量设为 `null`，帮助垃圾回收器尽早回收。
2. **注意闭包的粒度。** 前面提到 V8 只捕获被引用的变量，但同一个作用域内的所有闭包共享同一个 `Context` 对象。这意味着如果一个闭包引用了大对象，另一个闭包引用了同作用域的小变量，那么只要后者还活着，大对象也不会被回收。
3. **使用 `let`/`const` 代替 `var`。** 因为 `let`/`const` 有块级作用域，可以更精确地控制变量的生命周期，减少不必要的闭包捕获。

关于闭包回收的问题本文只是做了个简单的介绍，其实闭包是如何回收的还牵涉到了 JavaScript 的垃圾回收机制，而关于垃圾回收，后续章节我会再为你做详细介绍的。

## 总结

好了，今天的内容就讲到这里，下面我们来回顾下今天的内容：

首先，介绍了什么是作用域链，我们把通过作用域链查找变量的链条称为作用域链；作用域链是通过词法作用域来确定的，而词法作用域反映了代码的结构。其次，介绍了在块级作用域中是如何通过作用域链来查找变量的。然后，基于作用域链和词法环境介绍了到底什么是闭包，并深入到 V8 引擎层面解释了闭包的内部实现——`Context` 对象、按需捕获和堆存储机制。

我们还特别强调了**词法作用域和动态作用域的区别**：JavaScript 的变量查找采用词法作用域（静态的，由代码结构决定），而 `this` 的绑定则是动态的（由调用方式决定），这两套机制的并存是 JavaScript 中许多困惑的根源。

在现代应用方面，我们探讨了闭包从经典模块模式到 ES Modules 的演进、React Hooks 中的过期闭包问题、事件处理器的内存影响，以及私有类字段作为闭包隐私的替代方案。在内存管理方面，我们分析了常见的闭包内存泄漏模式、Chrome DevTools 的检测方法，以及 ES2021 的 `WeakRef` 和 `FinalizationRegistry`。

通过词法作用域，我们分析了在 JavaScript 的执行过程中，作用域链是已经注定好了，比如即使在 foo 函数中调用了 bar 函数，你也无法在 bar 函数中直接使用 foo 函数中的变量信息。 

因此理解词法作用域对于你理解 JavaScript 语言本身有着非常大帮助，比如有助于你理解下一篇文章中要介绍的 this。另外，理解词法作用域对于你理解其他语言也有很大的帮助，因为它们的逻辑都是一样的。

## 思考时间

今天留给你的思考题是关于词法作用域和闭包，我修改了上面那段产生闭包的代码，如下所示：

```js
var bar = {
  myName: 'time.geekbang.com',
  printName: function() {
    console.log(myName)
  }
}
function foo() {
  let myName = '极客时间'
  return bar.printName
}
let myName = '极客邦'
let _printName = foo()
_printName()
bar.printName()
```

在上面这段代码中有三个地方定义了 myName，分析这段代码，你觉得这段代码在执行过程中会产生闭包吗？最终打印的结果是什么？

> 这道题其实是个障眼法，只需要确定好函数调用栈就可以很轻松的解答，调用了 foo() 后，返回的是 bar.printName，后续就跟 foo 函数没有关系了，所以结果就是调用了两次 bar.printName()，根据词法作用域，结果都是"极客邦"，也不会形成闭包。
