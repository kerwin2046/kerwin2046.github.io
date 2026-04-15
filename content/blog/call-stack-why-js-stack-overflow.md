---
title: "调用栈：为什么JavaScript代码会出现栈溢出"
description: "在上篇文章中，我们讲到了，当一段代码被执行时，JavaScript 引擎先会对其进行编译，并创建执行上下文。但是并没有明确说明到底什么样的代码才算符合规范。 那么接下来我们就来明确下，哪些情况下代码才算是\"一段\"代码，才会在执行之前就进行编译并创建执行上下文。一般说来，有这么三种情况。 - 当..."
date: "2024-01-23"
author: "Kerwin"
tag: "Frontend"
---



> **2025 更新说明**：本文在原有内容基础上进行了较大幅度的补充和更新。新增了现代浏览器调用栈大小限制的具体数据、ES2015 尾调用优化（TCO）的实现现状与争议、多种解决栈溢出的现代方法（蹦床函数、生成器、协作式调度等），以及现代 DevTools 中异步调用栈的使用方式。如果你之前读过本文，建议重点关注新增的"现代解决栈溢出的方法"和"异步调用栈"两个章节。

在上篇文章中，我们讲到了，当一段代码被执行时，JavaScript 引擎先会对其进行编译，并创建执行上下文。但是并没有明确说明到底什么样的代码才算符合规范。

那么接下来我们就来明确下，哪些情况下代码才算是"一段"代码，才会在执行之前就进行编译并创建执行上下文。一般说来，有这么三种情况。

- 当 JavaScript 执行全局代码的时候，会编译全局代码并创建全局执行上下文，而且在整个页面的生存周期内，全局执行上下文只要一份。

- 当调用一个函数的时候，函数体内的代码会被编译，并创建函数执行上下文，一般情况下，函数执行结束之后，创建的函数执行上下文会被销毁。

- 当使用 eval 函数的时候，eval 的代码也会被编译，并创建执行上下文。

好了，又进一步理解了执行上下文，那本节我们就在这基础之上继续深入，一起聊聊调用栈。学习调用栈至少有以下三点好处：

- 可以帮助你了解 JavaScript 引擎背后的工作原理。

- 让你有调试 JavaScript 代码的能力。

- 帮助你搞定面试，因为面试过程中，调用栈也是出境率非常高的题目。

比如你在写 JavaScript 代码的时候，有时候可能会遇到栈溢出的错误，如下图所示：

![栈溢出错误](/images/browser/call-stack-why-js-stack-overflow/stack-overflow-error.png)

那为什么会出现这种错误呢？这就涉及到了调用栈的内容。你应该知道 JavaScript 中有很多函数，经常会出现在一个函数中调用另外一个函数的情况，调用栈就是用来管理函数调用关系的一种数据结构。因此要讲清楚调用栈，你还要先弄明白函数调用和栈结构。

## 什么是函数调用

函数调用就是运行一个函数，具体使用方式是使用函数名称跟着一对小括号。下面我们看个简单的示例代码。

```js
var a = 2
function add() {
  var b = 10
  return a + b
}
add()
```

这段代码很简单，先是创建了一个 add 函数，接着在代码的最下面又调用了该函数。

那么下面我们就利用这段简单的代码来解释下函数调用的过程。

在执行到函数 add() 之前，JavaScript 引擎会为上面这段代码创建全局执行上下文，包含了声明的函数和变量，你可以参考下图：

![全局执行上下文](/images/browser/call-stack-why-js-stack-overflow/global-execute-context.png)

从图中可以看出，代码中全局变量和函数都保存在全局上下文的变量环境中。

执行上下文准备好之后，便开始执行全局代码，当执行到 add 这儿时，JavaScript 判断这是一个函数调用，那么将执行以下操作：

- 首先，从全局执行上下文中，取出 add 函数代码。

- 其次，对 add 函数的这段代码进行编译，并创建该函数的执行上下文和可执行代码。

- 最后，执行代码，输出结果。

完整流程你可以参考下图：

![完整流程](/images/browser/call-stack-why-js-stack-overflow/full-process.png)

就这样，当执行到 add 函数的时候，我们就有了两个执行上下文了——全局执行上下文和 add 函数的执行上下文。

也就是说在执行 JavaScript 时，可能会存在多个执行上下文，那么 JavaScript 引擎是如何管理这些执行上下文的呢？

答案是通过一种叫**栈的数据结构来管理的**。那什么是栈呢？它又是如何管理这些执行上下文呢？

## 什么是栈

关于栈，你可以结合这么一个贴切的例子来理解，一条单车道的单行线，一端被堵住了，而另一端入口处没有任何提示信息，堵住之后就只能后进去的车子先出来，这时这个堵住的单行线就可以被看作是一个栈容器，车子开进单行线的操作叫做入栈，车子倒出去的操作叫做出栈。

在车流量较大的场景中，就会发生反复的入栈、栈满、出栈、空栈和再次入栈，一直循环。

所以，栈就是类似于一端被堵住的单行线，车子类似于栈中的元素，栈中的元素满足后进先出的特点。你可以参看下图：

![栈结构](/images/browser/call-stack-why-js-stack-overflow/stack-construction.png)

## 什么是JavaScript的调用栈

JavaScript 引擎正是利用栈的这种结构来管理执行上下文的。在执行上下文创建好后，JavaScript 引擎会将执行上下文压入栈中，通常把这种用来管理执行上下文的栈称为执行上下文栈，又称调用栈。

为便于你更好地理解调用栈，下面我们再来看段稍微复杂点的示例代码：

```js
var a = 2
function add(b, c) {
  return b + c
}
function addAll(b, c) {
  var d = 10
  result = add(b, c)
  return  a + result + d
}
addAll(3,6)
```

在上面这段代码中，你可以看到它是在 addAll 函数中调用了 add 函数，那在整个代码的执行过程中，调用栈是怎么变化的呢？

下面我们就一步步地分析在代码的执行过程中，调用栈的状态变化情况。

**第一步，创建全局上下文，并将其压入栈底**。如下图所示：

![调用栈](/images/browser/call-stack-why-js-stack-overflow/call-stack.png)

从图中你也可以看出，变量 a、函数 add 和 addAll 都保存到了全局上下文的变量环境对象中。

全局执行上下文压入到调用栈后，JavaScript 引擎便开始执行全局代码了。首先会执行 a = 2 的赋值操作，执行该语句会将全局上下文变量环境中 a 的值设置为2。设置后的全局上下文的状态如下图所示：

![全局执行上下文状态](/images/browser/call-stack-why-js-stack-overflow/global-execute-context-status.png)

接下来，**第二步是调用addAll函数**。当调用该函数时，JavaScript 引擎会编译该函数，并为其创建一个执行上下文，最后还将该函数的执行上下文压入栈中，如下图所示：

![addAll调用栈](/images/browser/call-stack-why-js-stack-overflow/addAll-call-stack.png)

addAll 函数的执行上下文创建好之后，便进入了函数代码的执行阶段了，这里先执行的是 d = 10 的赋值操作，执行语句会将 addAll 函数执行上下文中的 d 由 undefined 变成了 10。

然后接着往下执行，**第三步，当执行到 add 函数调用语句时，同样会为其创建执行上下文，并将其压入调用栈**，如下图所示：

![add调用栈](/images/browser/call-stack-why-js-stack-overflow/add-call-stack.png)

当 add 函数返回时，该函数的执行上下文就会从栈顶弹出，并将 result 的值设置为 add 函数的返回值，也就是9。如下图所示：

![add弹出](/images/browser/call-stack-why-js-stack-overflow/add-call-stack-popup.png)

紧接着 addAll 执行最后一个相加操作后并返回，addAll 的执行上下文也会从栈顶部弹出，此时调用栈中就只剩下全局上下文了。最终如下图所示：

![addAll弹出](/images/browser/call-stack-why-js-stack-overflow/addAll-call-stack-popup.png)

至此，整个 JavaScript 流程执行结束了。

好了，现在你应该知道了**调用栈是 JavaScript 引擎追踪函数执行的一个机制**，当一次有多个函数被调用时，通过调用栈就能够追踪到哪个函数正在被执行以及各个函数之间的调用关系。

## 在开发中，如何利用好调用栈

鉴于调用栈的重要性和实用性，那么接下来我们就一起来看看在实际工作中，应该如何查看和利用好调用栈。

### 1.如何利用浏览器查看调用栈的信息

当你执行一段复杂的代码时，你可能很难从代码文件中分析其调用关系，这时候你可以在你想要查看的函数中加入断点，然后当执行到该函数时，就可以查看该函数的调用栈了。

这么说可能有点抽象，这里我们拿上面的那段代码做个演示，你可以打开"开发者工具"，点击"Source"标签（即"源代码"面板），选择 JavaScript 代码的页面，然后在第3行加上断点，并刷新页面。你可以看到执行到 add 函数时，执行流程就暂停了，这时可以通过右边"Call Stack"来查看当前的调用栈的情况，如下图：

![Chrome开发者工具查看调用栈情况](/images/browser/call-stack-why-js-stack-overflow/chrome-call-stack.png)

从图中可以看出，右边的"Call Stack"下面显示出来了函数的调用关系：栈的最底部是 anonymous，也就是全局的函数入口；中间是 addAll 函数；顶部是 add 函数。这就清晰地反映了函数的调用关系，所以在分析复杂结构代码，或者检查 bug 时，调用栈都是非常有用的。

除了通过断点来查看调用栈，你还可以使用 `console.trace()` 来输出当前的函数调用关系，比如在示例代码中的 add 函数里面加上了 `console.trace()`，你就可以看到控制台输出的结果，如下图：

![console.trace](/images/browser/call-stack-why-js-stack-overflow/console-trace.png)

值得一提的是，现代 Chrome DevTools 还支持**异步调用栈追踪**（Async Stack Traces）。当你在调试涉及 `setTimeout`、`Promise`、`async/await` 等异步操作的代码时，DevTools 能够在 Call Stack 面板中显示完整的异步调用链。这意味着你不仅能看到当前同步执行的调用栈，还能看到是哪段代码发起了这个异步操作。这个功能默认是开启的，极大地提升了调试异步代码的体验。我们会在后文的"异步调用栈"章节中详细讨论。

### 2.栈溢出（Stack Overflow）

现在你知道了调用栈是一种用来管理执行上下文的数据结构，符合后进先出的规则。不过还有一点你要注意，**调用栈是有大小的**，当入栈的执行上下文超过一定数目，JavaScript 引擎就会报错，我们把这种错误叫做栈溢出。

#### 调用栈的大小限制

不同的 JavaScript 引擎和不同的运行环境对调用栈的大小限制有所不同。以现代 Chrome 浏览器（V8 引擎）为例，调用栈的深度上限大约在 **10,000 到 15,000 帧**之间，具体数值取决于每个栈帧所消耗的内存大小——如果函数中声明了大量的局部变量，每个栈帧占用的内存就更多，可容纳的栈帧总数就越少。你可以通过以下代码来粗略测试当前环境的栈深度上限：

```js
let count = 0
function testStackSize() {
  count++
  testStackSize()
}
try {
  testStackSize()
} catch (e) {
  console.log(`最大栈深度: ${count}`) // Chrome 中通常在 10000~15000 之间
}
```

Firefox 的 SpiderMonkey 引擎和 Safari 的 JavaScriptCore 引擎各有各的限制。Node.js 基于 V8 引擎，其默认栈大小约为 984KB（可通过 `--stack-size` 参数调整）。了解这些限制有助于你在编写深度递归代码时做出正确的判断。

#### 典型的栈溢出场景

特别是在你写递归代码的时候，就很容易出现**栈溢出**的情况。比如下面这段代码：

```js
function division(a, b){
  return division(a, b)
}
console.log(division(1, 2))
```

当执行时，就会抛出栈溢出错误，如下图：

![栈溢出](/images/browser/call-stack-why-js-stack-overflow/stack-overflow.webp)

从上图你可以看到，抛出的错误信息为：超出了最大栈调用大小（Maximum call stack size exceeded）。

那为什么会出现这个问题呢？这是因为当 JavaScript 引擎开始执行这段代码时，它首先调用函数 division，并创建执行上下文，压入栈中；然而，这个函数是递归的，并且没有任何终止条件，所以它会一直创建新的函数执行上下文，并反复将其压入栈中，但栈是有容量限制的，超过最大数量后就会出现栈溢出的错误。

#### 尾调用优化（TCO）的理想与现实

说到递归和栈溢出，不得不提 ES2015（ES6）规范中引入的**尾调用优化**（Tail Call Optimization, TCO）。所谓"尾调用"，是指一个函数的最后一步操作是调用另一个函数（或自身），并且直接返回这个调用的结果，不再进行任何额外的计算。例如：

```js
// 这是一个尾调用——return 语句直接返回函数调用的结果
function factorial(n, acc = 1) {
  if (n <= 1) return acc
  return factorial(n - 1, n * acc) // 尾调用位置
}

// 这不是尾调用——return 之后还有一个乘法运算
function factorialBad(n) {
  if (n <= 1) return 1
  return n * factorialBad(n - 1) // 不是尾调用，因为还要乘以 n
}
```

按照 ES2015 规范，引擎在检测到尾调用时，应该复用当前栈帧而不是创建新的栈帧，这样递归调用就不会导致栈增长，从根本上消除了栈溢出的风险。这个特性被称为**正确的尾调用**（Proper Tail Calls, PTC）。

然而现实是，**目前只有 Safari 的 JavaScriptCore 引擎实现了 PTC**。V8（Chrome/Node.js）和 SpiderMonkey（Firefox）团队明确选择了不实现这一特性，主要原因包括：

1. **调试困难**：PTC 会复用栈帧，导致调用栈中的中间帧被"吞掉"，在 DevTools 中你将看不到完整的调用历史，给调试带来极大困难。
2. **性能开销**：判断一个调用是否处于尾调用位置需要额外的运行时检查，这会给非尾调用的正常代码带来性能损耗。
3. **隐式行为的争议**：PTC 是隐式发生的——开发者并不能明确知道自己的代码是否被优化了，这与 JavaScript 社区追求"显式优于隐式"的理念相悖。

为此，曾经有一个替代方案被提出，叫做**语法化尾调用**（Syntactic Tail Calls, STC）。其核心思想是引入一个新的语法（如 `return continue`），让开发者显式地标记"我期望这里进行尾调用优化"。这样既保留了优化的可能性，又不会影响普通代码的调试体验。但这个提案最终也未能推进到标准化阶段。

所以，在实际开发中，你不能依赖尾调用优化来避免栈溢出——除非你确定代码只在 Safari 上运行。接下来我们来看看更为实用和可靠的解决方案。

## 现代解决栈溢出的方法

理解了栈溢出的原因后，我们来系统地看看在现代 JavaScript 开发中，有哪些切实可行的方法来解决或规避栈溢出问题。

### 1. 将递归转换为迭代

这是最直接、最可靠的方法。大多数递归算法都可以改写为使用循环的迭代版本。迭代不会创建新的栈帧，因此不存在栈溢出的风险。

```js
// 递归版本——大数值会栈溢出
function sumRecursive(n) {
  if (n === 0) return 0
  return n + sumRecursive(n - 1)
}

// 迭代版本——永远不会栈溢出
function sumIterative(n) {
  let result = 0
  for (let i = n; i > 0; i--) {
    result += i
  }
  return result
}

console.log(sumIterative(1000000)) // 正常运行，无栈溢出
```

对于更复杂的递归（如树的遍历），你可以用一个**显式的栈**（数组）来模拟调用栈：

```js
// 用显式栈模拟递归的树遍历
function traverseTree(root) {
  const stack = [root]
  const result = []
  while (stack.length > 0) {
    const node = stack.pop()
    result.push(node.value)
    // 将子节点压入栈中（注意顺序）
    if (node.right) stack.push(node.right)
    if (node.left) stack.push(node.left)
  }
  return result
}
```

### 2. 蹦床函数（Trampolining）

蹦床函数是一种非常优雅的模式，它让递归函数不直接调用自身，而是返回一个"待执行的函数"，由外部的蹦床循环来驱动执行。这样每次递归实际上只使用一层栈帧，彻底避免了栈溢出。

```js
// 蹦床函数——通用的递归"脱栈"工具
function trampoline(fn) {
  return function(...args) {
    let result = fn(...args)
    // 只要返回值还是函数，就继续调用
    while (typeof result === 'function') {
      result = result()
    }
    return result
  }
}

// 将递归改为返回"延迟调用"的形式
function _factorial(n, acc = 1) {
  if (n <= 1) return acc
  // 不直接递归调用，而是返回一个函数
  return () => _factorial(n - 1, n * acc)
}

const factorial = trampoline(_factorial)
console.log(factorial(100000)) // Infinity（数值溢出但不会栈溢出！）
```

蹦床函数的核心思想是：**用循环代替递归的栈增长**，同时保持递归的代码结构和可读性。这在函数式编程中是一种非常常见的技巧。

### 3. 使用生成器（Generator）进行惰性求值

ES2015 引入的生成器函数（Generator）可以暂停和恢复执行，这使得它天然适合处理需要分步执行的递归逻辑：

```js
// 使用生成器实现惰性的斐波那契数列
function* fibonacci() {
  let a = 0, b = 1
  while (true) {
    yield a
    ;[a, b] = [b, a + b]
  }
}

// 按需取值，无论取多少个都不会栈溢出
function getNthFib(n) {
  const gen = fibonacci()
  let result
  for (let i = 0; i <= n; i++) {
    result = gen.next().value
  }
  return result
}

console.log(getNthFib(10000)) // 正常返回，不会栈溢出
```

生成器的优势在于它的**惰性求值**特性——只在需要时才计算下一个值，不需要一次性展开整个递归树。

### 4. 使用 setTimeout / requestAnimationFrame 拆分任务

当你需要处理大量计算但又不想阻塞主线程时，可以将大任务拆分成小块，利用 `setTimeout` 或 `requestAnimationFrame` 将每小块的执行放到不同的事件循环周期中。每次新的宏任务开始时，调用栈都是空的，因此不会发生栈溢出。

```js
// 将大量计算拆分到多个事件循环周期中
function processLargeArray(array, callback, chunkSize = 1000) {
  let index = 0
  
  function processChunk() {
    const end = Math.min(index + chunkSize, array.length)
    for (; index < end; index++) {
      callback(array[index], index)
    }
    if (index < array.length) {
      // 让出主线程，下一个事件循环继续处理
      setTimeout(processChunk, 0)
    }
  }
  
  processChunk()
}

// 使用 requestAnimationFrame 做动画相关的分帧处理
function processWithRAF(items, processFn) {
  let index = 0
  
  function step() {
    const start = performance.now()
    // 每帧最多执行 16ms 的工作，确保 60fps
    while (index < items.length && performance.now() - start < 16) {
      processFn(items[index])
      index++
    }
    if (index < items.length) {
      requestAnimationFrame(step)
    }
  }
  
  requestAnimationFrame(step)
}
```

### 5. 使用 scheduler.yield() 进行协作式调度

在更现代的浏览器中（Chrome 129+），新的 `scheduler.yield()` API 提供了一种更优雅的方式来让出主线程控制权。与 `setTimeout` 不同，`scheduler.yield()` 会将后续任务放到任务队列的**前面**，避免被其他低优先级任务插队，从而在保持响应性的同时尽快恢复执行：

```js
// 使用 scheduler.yield() 的协作式长任务处理
async function processLargeDataset(data, processFn) {
  for (let i = 0; i < data.length; i++) {
    processFn(data[i])
    
    // 每处理 1000 个项目，主动让出主线程
    if (i % 1000 === 0 && i > 0) {
      // scheduler.yield() 让出控制权后会尽快恢复
      if ('scheduler' in globalThis && 'yield' in scheduler) {
        await scheduler.yield()
      } else {
        // 降级方案
        await new Promise(resolve => setTimeout(resolve, 0))
      }
    }
  }
}
```

`scheduler.yield()` 的出现代表了浏览器在"协作式多任务"方向上的演进。它本质上是在告诉浏览器："我愿意暂时让出控制权给更紧急的任务（比如用户交互），但请尽快让我继续。" 这比粗暴的 `setTimeout(fn, 0)` 要精细得多。

### 方法对比

| 方法 | 适用场景 | 优点 | 缺点 |
|------|---------|------|------|
| 转换为迭代 | 简单递归 | 最直接，性能最好 | 复杂递归改写难度大 |
| 蹦床函数 | 需要保持递归结构 | 保持代码可读性 | 有轻微性能开销 |
| 生成器 | 需要惰性求值 | 天然支持暂停/恢复 | 需要理解生成器概念 |
| setTimeout/rAF | 长任务拆分 | 不阻塞主线程 | 异步化，逻辑变复杂 |
| scheduler.yield() | 现代浏览器长任务 | 精细控制，快速恢复 | 兼容性有限 |

## 异步调用栈

在现代 JavaScript 开发中，异步编程无处不在。从 `setTimeout` 到 `Promise`，再到 `async/await`，异步操作构成了前端代码的核心骨架。但这也给调试带来了一个棘手的问题：**异步操作会"切断"调用栈**。

为什么会这样？因为当 `setTimeout` 的回调函数执行时，原来发起 `setTimeout` 的那段代码早已执行完毕，其栈帧早已弹出。回调函数是在一个全新的调用栈中执行的。如果你在回调中设断点，你只会看到从事件循环开始的调用栈，而看不到是哪段业务代码发起了这个异步操作。

```js
function fetchUserData() {
  // 发起异步操作
  setTimeout(function processResponse() {
    // 在这里设断点——传统调用栈只会显示 processResponse
    // 看不到是 fetchUserData 发起的调用
    console.log('处理响应数据')
  }, 1000)
}

fetchUserData()
```

### 现代 DevTools 的异步调用栈追踪

好消息是，现代 Chrome DevTools 已经很好地解决了这个问题。它引入了**异步调用栈追踪**（Async Stack Traces），能够跨越异步边界记录完整的调用历史。

当你在 Chrome DevTools 的 Source（源代码）面板中调试代码时，Call Stack 区域会用 `async` 标签来标记异步边界。例如：

```
processResponse        (app.js:5)
  — async —
fetchUserData          (app.js:3)
  (anonymous)          (app.js:10)
```

这意味着你可以清楚地看到：`processResponse` 是由 `fetchUserData` 通过 `setTimeout` 异步发起的。

DevTools 支持以下异步操作的调用栈追踪：

- **`setTimeout` / `setInterval`**：显示设置定时器的调用栈
- **`Promise.then/catch/finally`**：显示 Promise 链的创建位置
- **`async/await`**：显示 await 表达式的上下文
- **`requestAnimationFrame`**：显示注册动画回调的位置
- **`MutationObserver`**：显示观察者注册的位置
- **`addEventListener`**：显示事件监听器注册的位置

### 在代码中利用异步调用栈

除了 DevTools，你还可以在代码层面利用异步调用栈信息。`Error` 对象在异步上下文中捕获的堆栈信息越来越完善：

```js
async function outerFunction() {
  await innerFunction()
}

async function innerFunction() {
  // 在 async 函数中抛出的错误会包含异步调用栈信息
  throw new Error('出错了')
}

outerFunction().catch(err => {
  console.log(err.stack)
  // Error: 出错了
  //   at innerFunction (app.js:6)
  //   at outerFunction (app.js:2)
  // 注意：async/await 使得错误堆栈是连贯的
})
```

这也是推荐使用 `async/await` 而非裸 `Promise` 链的一个重要原因——它能产生更清晰、更完整的调用栈信息，极大地提升了可调试性。

## 总结

好了，今天的内容就讲到这里，下面来总结下今天的内容。

- 每调用一个函数，JavaScript 引擎会为其创建执行上下文，并把该执行上下文压入调用栈，然后 JavaScript 引擎开始执行函数代码。

- 如果在一个函数 A 中调用了另外一个函数 B，那么 JavaScript 引擎会为 B 函数创建执行上下文，并将 B 函数的执行上下文压入栈顶。

- 当前函数执行完毕后，JavaScript 引擎会将该函数的执行上下文弹出栈。

- 当分配的调用栈空间被占满时，会引发"堆栈溢出"问题。现代 Chrome（V8 引擎）的栈深度上限大约在 10,000 到 15,000 帧之间。

- ES2015 规范中定义了尾调用优化（TCO），但目前仅 Safari 实现了该特性。V8 和 SpiderMonkey 出于调试体验的考虑选择了不实现。

- 解决栈溢出有多种现代方法：转换为迭代、蹦床函数、生成器惰性求值、setTimeout/rAF 任务拆分，以及新的 `scheduler.yield()` 协作式调度 API。

- 现代 DevTools 支持异步调用栈追踪，能够跨越 `setTimeout`、`Promise`、`async/await` 等异步边界显示完整的调用历史。

- 栈是一种非常重要的数据结构，不光应用在 JavaScript 语言中，其他的编程语言，如 C/C++、Java、Python 等语言，在执行过程中也都使用了栈来管理函数之间的调用关系。所以栈是非常基础且重要的知识点，你必须得掌握。

## 思考时间

最后，我给你留个思考题，你可以看下面这段代码：

```js
function runStack(n) {
  if(n === 0) return 100
  return runStack(n - 2)
}
runStack(50000)
```

这是一段递归代码，可以通过传入参数 n，让代码递归执行 n 次，也就意味着调用栈的深度能达到 n，当输入一个较大的数时，比如50000，就会出现栈溢出的问题，那么你能优化下这段代码吗，以解决栈溢出的问题吗？

下面提供三种优化方案：

**方案一：转换为迭代（最直接）**

```js
function runStack(n) {
  while (true) {
    if (n === 0) return 100
    if (n === 1) return 200  // 防止奇数输入导致死循环
    n = n - 2
  }
}
console.log(runStack(50000)) // 100
```

这是最简单直接的方式，把递归改成 `while` 循环，完全不消耗额外的栈空间。

**方案二：蹦床函数（保持递归风格）**

```js
function trampoline(fn) {
  return function(...args) {
    let result = fn(...args)
    while (typeof result === 'function') {
      result = result()
    }
    return result
  }
}

function _runStack(n) {
  if (n === 0) return 100
  if (n === 1) return 200
  return () => _runStack(n - 2)  // 返回函数而非直接递归
}

const runStack = trampoline(_runStack)
console.log(runStack(50000)) // 100
```

蹦床函数的优势在于：你几乎不需要改变原有的递归逻辑，只需要把 `return recursiveCall()` 改成 `return () => recursiveCall()`，然后用 `trampoline` 包装一下即可。对于更复杂的递归场景（比如互相递归调用的两个函数），蹦床函数尤其有用。

**方案三：使用 setTimeout 异步化（适合需要让出主线程的场景）**

```js
function runStackAsync(n) {
  return new Promise(resolve => {
    function step(current) {
      if (current === 0) return resolve(100)
      if (current === 1) return resolve(200)
      setTimeout(() => step(current - 2), 0)
    }
    step(n)
  })
}

runStackAsync(50000).then(result => console.log(result)) // 100
```

这种方式将递归改为异步执行，每一步都在新的事件循环中运行，调用栈始终保持浅层。但需要注意，由于 `setTimeout` 的最小延迟（约 4ms），处理 50000 次递归需要较长时间。在实际场景中，可以结合批处理来提升效率。