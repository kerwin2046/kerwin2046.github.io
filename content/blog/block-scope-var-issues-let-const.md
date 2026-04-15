---
title: "块级作用域：var缺陷以及为什么要引入let和const"
description: "在前面《变量提升：JavaScript代码是按顺序执行的吗》这篇文章中，我们已经讲解了 JavaScript 中变量提升的相关内容，正是由于 JavaScript 存在变量提升这种特性，从而导致了很多与直觉不符的代码，这也是 JavaScript 的一个重要设计缺陷。 虽然 ES6（ECMAScr..."
date: "2024-01-26"
author: "Kerwin"
tag: "Frontend"
---



> **更新说明（2025）**：本文基于 ES2015-ES2025 标准进行了全面更新，补充了暂时性死区（TDZ）的深层机制、`const` 的不可变性本质、`for` 循环中 `let` 的特殊绑定行为、以及 ES2022+ 新增的块级作用域相关特性（如类字段声明、`using` 声明等）。

在前面《变量提升：JavaScript代码是按顺序执行的吗》这篇文章中，我们已经讲解了 JavaScript 中变量提升的相关内容，正是由于 JavaScript 存在变量提升这种特性，从而导致了很多与直觉不符的代码，这也是 JavaScript 的一个重要设计缺陷。

虽然 ES6（ECMAScript 2015）已经通过引入块级作用域并配合 `let`、`const` 关键字来避开了这种设计缺陷，但是由于 JavaScript 需要保持向下兼容，所以变量提升在相当长一段时间内还会继续存在。到了今天，`let` 和 `const` 已经成为 JavaScript 社区的绝对主流，几乎所有现代项目的 ESLint 规则都强制使用 `const`/`let`，禁用 `var`。但理解 `var` 的行为依然重要——在维护老项目、阅读底层库代码时你仍会遇到它。更关键的是，**理解 `var` 和 `let`/`const` 在执行上下文中的不同处理方式，是深入理解 JavaScript 引擎工作原理的核心**。

这两套机制同时运行在"一套"系统中，这加大了理解的难度。但如果抛开 JavaScript 的底层去理解这些，那么你大概率会很难深入理解其概念。所以今天这篇文章会先"探病因"——分析为什么在 JavaScript 中会存在变量提升，以及变量提升所带来的问题；然后再来"开药方"——介绍如何通过块级作用域并配合 `let` 和 `const` 关键字来修复这种缺陷；最后，我们还会深入探讨**暂时性死区（TDZ）的底层机制**、**`const` 不可变性的本质**、以及 **ES2022+ 对块级作用域的进一步扩展**。

## 作用域（scope）

为什么 JavaScript 中会存在变量提升这个特性，而其他语言似乎没有这个特性呢？要讲清楚这个问题，我们就得先从作用域讲起。

**作用域是指在程序中定义变量的区域，该位置决定了变量的生命周期。通俗地理解，作用域就是变量与函数的可访问范围，即作用域控制着变量和函数的可见性和生命周期。**

在 ES6 之前，ES 的作用域只有两种：全局作用域和函数作用域。

- 全局作用域中的对象在代码中的任何地方都能访问，其生命周期伴随着页面的生命周期。

- 函数作用域就是在函数内部定义的变量或者函数，并且定义的变量或者函数只能在函数内部被访问。函数执行结束之后，函数内部定义的变量会被销毁。

在 ES6 之前，JavaScript 只支持这两种作用域，相较而言，其他语言则都普遍支持块级作用域。块级作用域就是使用一对大括号包裹的一段代码，比如函数、判断语句、循环语句，甚至单独的一个 `{}` 都可以被看作是一个块级作用域。

为了更好地理解块级作用域，你可以参考下面的一些示例代码：

```js
// if块
if (1) {}

// while块
while (1) {}

// 函数块
function foo() {}

// for循环块
for (let i = 0; i < 100; i++) {}

// 单独一个块
{}
```

简单来讲，如果一种语言支持块级作用域，那么其代码块内部定义的变量在代码外部是访问不到的，并且等该代码块中的代码执行完成之后，代码块中定义的变量会被销毁。你可以看下面这段 C 代码：

```c
char* myname = "极客时间";
void showName() {
  printf("%s \n", myname);
  if (0) {
    char* myname = "极客邦";
  }
}

int main() {
  showName();
  return 0;
}
```

上面这段 C 代码执行后，最终打印出来的是上面全局变量 myname 的值，之所以这样，是因为 C 语言是支持块级作用域的，所以 if 块里面定义的变量是不能被 if 块外面的语句访问到的。

和 Java、C/C++ 不同，ES6 之前是不支持块级作用域的，因为当初设计这门语言的时候，并没有想到 JavaScript 会火起来，所以只是按照最简单的方式来设计。没有了块级作用域，再把作用域内部的变量统一提升无疑是最快速、最简单的设计，不过这也直接导致了函数中的变量无论是在哪里声明的，在编译阶段都会被提取到执行上下文的变量环境中，所以这些变量在整个函数体内的任何地方都是能被访问的，这也就是 JavaScript 的变量提升。

## 变量提升所带来的问题

由于变量提升作用，使用 JavaScript 来编写和其他语言相同逻辑的代码，都有可能会导致不一样的执行结果。那为什么会出现这种情况呢？主要有以下两个原因。

### 1. 变量容易在不被察觉的情况下被覆盖掉

比如我们重新使用 JavaScript 来实现上面那段 C 代码，实现后的 JavaScript 代码如下：

```js
var myname = '极客时间'
function showName() {
  console.log(myname)
  if (0) {
    var myname = '极客邦'
  }
  console.log(myname)
}
showName()
```

执行上面这段代码，打印出来的是 `undefined`，而并没有像前面 C 代码那样打印出来"极客时间"的字符串。为什么输出的内容是 `undefined` 呢？我们再来分析一下。

首先当刚执行到 showName 函数调用时，执行上下文和调用栈的状态是怎样的？具体分析过程你可以回顾《调用栈：为什么JavaScript代码会出现栈溢出》这篇文章的分析过程，这里我就直接展示出来了，最终的调用栈状态如下图所示：

![showName调用栈](/images/browser/block-scope-var-issues-let-const/showName-call-stack.png)

showName 函数的执行上下文创建后，JavaScript 引擎便开始执行 showName 函数内部的代码了。首先执行的是：

```js
console.log(myname)
```

执行这段代码需要使用变量 myname，结合上面的调用栈状态图，你可以看到这里有两个 myname 变量：一个在全局执行上下文中，其值是"极客时间"；另外一个在 showName 函数的执行上下文中，其值是 undefined。那么到底该使用哪个呢？

这是因为在函数执行过程中，JavaScript 会优先从当前的执行上下文中查找变量，由于变量提升，当前的执行上下文就包含了变量 myname，而值是 `undefined`，所以获取到的 myname 的值就是 `undefined`。

这输出的结果和其他大部分支持块级作用域的语言都不一样，比如上面 C 语言输出的就是全局变量，所以这会很容易造成误解，特别是在你会一些其他语言的基础之上，再来学习 JavaScript，你会觉得这种结果很不自然。

### 2. 本应销毁的变量没有被销毁

接下来我们再来看下面这段让人误解更大的代码：

```js
function foo() {
  for (var i = 0; i < 7; i++) {}
  console.log(i)
}
foo()
```

如果你使用 C 语言或者其他的大部分语言实现类似代码，在 for 循环结束之后，i 就已经被销毁了，但是在 JavaScript 代码中，i 的值并未被销毁，所以最后打印出来的是 7。

这同样也是由变量提升而导致的，在创建执行上下文阶段，变量 i 就已经被提升了，所以当 for 循环结束之后，变量 i 并没有被销毁。

这依旧和其他支持块级作用域的语言表现是不一致的，所以必然会给一些人造成误解。

### 3. 经典的循环闭包陷阱（补充）

这是 `var` 最臭名昭著的问题之一，也是面试高频题：

```js
for (var i = 0; i < 5; i++) {
  setTimeout(function() {
    console.log(i) // 全部输出 5
  }, 1000)
}
```

由于 `var` 没有块级作用域，整个 `for` 循环共享同一个 `i`，当 `setTimeout` 的回调执行时，循环早已结束，`i` 的值是 5。在 ES6 之前，开发者不得不使用 IIFE（立即调用函数表达式）来创建额外的函数作用域：

```js
for (var i = 0; i < 5; i++) {
  (function(j) {
    setTimeout(function() {
      console.log(j) // 依次输出 0, 1, 2, 3, 4
    }, 1000)
  })(i)
}
```

而使用 `let` 之后，这个问题被优雅地解决了——这是因为 `let` 在 `for` 循环中有一个**特殊的绑定行为**，后面我们会详细分析。

## ES6是如何解决变量提升带来的缺陷

上面我们介绍了变量提升而带来的一系列问题，为了解决这些问题，ES6 引入了 `let` 和 `const` 关键字，从而使 JavaScript 也能像其他语言一样拥有了块级作用域。

关于 `let` 和 `const` 的用法，你可以参考下面代码：

```js
let x = 5
const y = 6
x = 7
y = 9 // TypeError: Assignment to constant variable.
```

从这段代码你可以看出，两者之间的区别是，使用 `let` 关键字声明的变量是可以被修改的，而使用 `const` 声明的变量其值是不可以被改变的。但不管怎样，两者都可以生成块级作用域。

### const 的不可变性本质（深入理解）

这里需要特别深入理解 `const` 的本质：**`const` 保证的不是"值不可变"，而是"变量标识符所指向的内存地址不可变"**。对于原始类型（number、string、boolean 等），值就存储在栈上的那个内存地址中，所以等同于值不可变。但对于引用类型（对象、数组），变量存储的是堆内存的引用地址，`const` 只保证这个引用地址不变，而对象内部的属性是可以修改的：

```js
const obj = { name: '极客时间' }
obj.name = '极客邦'     // 完全合法，修改的是堆内存中的属性
console.log(obj.name)   // '极客邦'

obj = {}                // TypeError! 不能改变 obj 指向的地址
```

```js
const arr = [1, 2, 3]
arr.push(4)             // 完全合法
console.log(arr)        // [1, 2, 3, 4]

arr = [5, 6]            // TypeError!
```

如果你需要真正的深度不可变，可以使用 `Object.freeze()`（浅冻结）或者第三方库如 Immer、Immutable.js。ES2024 还引入了 `Record` 和 `Tuple` 提案（目前仍在 Stage 2），旨在提供原生的深度不可变数据结构。

**现代最佳实践**：默认使用 `const`，只有在确实需要重新赋值时才使用 `let`，永远不使用 `var`。这不仅是风格问题，更是利用了引擎对 `const` 的优化——V8 引擎知道 `const` 变量不会被重新赋值，可以做出更激进的优化。

### for 循环中 let 的特殊绑定行为（深入理解）

回到前面的循环闭包问题，使用 `let` 可以完美解决：

```js
for (let i = 0; i < 5; i++) {
  setTimeout(function() {
    console.log(i) // 依次输出 0, 1, 2, 3, 4
  }, 1000)
}
```

这背后的原因并非仅仅是"let 有块级作用域"这么简单。ECMAScript 规范对 `for` 循环中的 `let` 做了**特殊处理**：每次迭代都会创建一个新的词法环境（Lexical Environment），并将当前迭代变量的值复制到新的环境中。伪代码如下：

```js
// 引擎内部大致等价于：
{
  let i = 0
  {
    let _i = i  // 创建当前迭代的副本
    setTimeout(function() { console.log(_i) }, 1000)
  }
  i++
  {
    let _i = i
    setTimeout(function() { console.log(_i) }, 1000)
  }
  // ... 以此类推
}
```

这是 `let` 在规范层面的特殊行为，不是其他块级作用域自然推导出来的。理解这一点有助于你准确把握 `let` 的语义。

那么接下来，我们就通过实际的例子来分析下，ES6 是如何通过块级作用域来解决上面的问题的？

你可以先参考下面这段存在变量提升的代码：

```js
function varTest() {
  var x = 1
  if (true) {
    var x = 2 // 同样的变量
    console.log(x) // 2
  }
  console.log(x) // 2
}
```

在这段代码中，有两个地方都定义了变量 x，第一个地方在函数块的顶部，第二个地方在 if 块的内部，由于 `var` 的作用范围是整个函数，所以在编译阶段，会生成如下的执行上下文：

![varTest执行上下文](/images/browser/block-scope-var-issues-let-const/varTest-execute-context.png)

从执行上下文的变量环境中可以看出，最终生成了一个变量 x，函数体内所有对 x 的赋值操作都会直接改变变量环境中的 x 值。

所以上述代码最后通过 `console.log(x)` 输出的是 2，而对于相同逻辑的代码，其他语言最后一步输出的值应该是 1，因为在 if 块里面的声明不应该影响到块外面的变量。

既然支持块级作用域和不支持块级作用域的代码执行逻辑是不一样的，那么接下来我们就来改造上面的代码，让其支持块级作用域。

这个改造过程其实很简单，只需要把 `var` 关键字替换为 `let` 关键字，改造后的代码如下：

```js
function letTest() {
  let x = 1
  if (true) {
    let x = 2 // 不同的变量
    console.log(x) // 2
  }
  console.log(x) // 1
}
```

执行这段代码，其输出结果就和我们的预期是一致的。这是因为 `let` 关键字是支持块级作用域的，所以在编译阶段，JavaScript 引擎并不会把 if 块中通过 `let` 声明的变量存放到变量环境中，这也就意味着在 if 块通过 `let` 声明的关键字，并不会提升到全函数可见。所以在 if 块之内打印出来的值是 2，跳出语块之后，打印出来的值就是 1 了。这种就非常符合我们的编程习惯了：**作用块内声明的变量不影响块外面的变量**。

## JavaScript是如何支持块级作用域的

现在你知道了 ES6 可以通过使用 `let` 或者 `const` 关键字来实现块级作用域，不过你是否有过这样的疑问："在同一段代码中，ES6 是如何做到既要支持变量提升的特性，又要支持块级作用域的呢？"

那么接下来，我们就要**站在执行上下文的角度来揭开答案**。

你已经知道 JavaScript 引擎是通过变量环境实现函数级作用域的，那么 ES6 又是如何在函数级作用域的基础之上，实现对块级作用域的支持呢？你可以先看下面这段代码：

```js
function foo() {
  var a = 1
  let b = 2
  {
    let b = 3
    var c = 4
    let d = 5
    console.log(a)
    console.log(b)
  }
  console.log(b) 
  console.log(c)
  console.log(d)
}   
foo()
```

当执行上面这段代码的时候，JavaScript 引擎会先对其进行编译并创建执行上下文，然后再按照顺序执行代码，关于如何创建执行上下文我们在前面的文章中已经分析过了，但是现在的情况有点不一样，我们引入了 `let` 关键字，`let` 关键字会创建块级作用域，那么 `let` 是如何影响执行上下文的呢？

接下来我们就来一步步分析上面这段代码的执行流程。

**第一步是编译并创建执行上下文**，下面是我画出来的执行上下文示意图，你可以参考下：

![foo执行上下文](/images/browser/block-scope-var-issues-let-const/foo-execute-context-1.png)

通过上图，我们可以得出以下结论：

- 函数内部通过 `var` 声明的变量，在编译阶段全都被存放到**变量环境**（Variable Environment）里面了。

- 通过 `let` 声明的变量，在编译阶段会被存放到**词法环境**（Lexical Environment）中。

- 在函数的作用域块内部（即 `{}` 块），通过 `let` 声明的变量并没有被放到词法环境中（**注意：此时块级代码还没有执行，所以块内的 `let` 声明在这个阶段还未被处理**）。

接下来，**第二步继续执行代码**，当执行到代码块里面时，变量环境中 a 的值已经被设置成了 1，词法环境中 b 的值已经被设置成了 2。

这时候函数的执行上下文就如下图所示：

![foo执行上下文](/images/browser/block-scope-var-issues-let-const/foo-execute-context-2.png)

从图中可以看出，当进入函数的作用域块时，作用域块中通过 `let` 声明的变量，会被存放在词法环境的一个单独的区域中，这个区域中的变量并不影响作用域块外面的变量，比如在作用域外面声明了变量 b，在该作用域块内部也声明了变量 b，当执行到作用域内部时，它们都是独立的存在。

其实，**在词法环境内部，维护了一个小型栈结构**，栈底是函数最外层的变量，进入一个作用域块后，就会把该作用域块内部的变量压到栈顶；当作用域执行完成之后，该作用域的信息就会从栈顶弹出，这就是词法环境的结构。需要注意下，我这里所讲的变量是指通过 `let` 或者 `const` 声明的变量。

再接下来，当执行到作用域块中的 `console.log(a)` 这行代码时，就需要在词法环境和变量环境中查找变量 a 的值了，具体查找方式是：沿着词法环境的栈顶向下查询，如果在词法环境中的某个块中查找到了，就直接返回给 JavaScript 引擎，如果没有找到，那么继续在变量环境中查找。

这样一个变量查找过程就完成了，你可以参考下图：

![foo执行上下文](/images/browser/block-scope-var-issues-let-const/foo-execute-context-3.png)

从上图你可以清晰地看出变量查找流程，不过要完整理解查找变量或者查找函数的流程，就涉及到作用域链了，这个我们会在下篇文章中做详细介绍。

当作用域块执行结束之后，其内部定义的变量就会从词法环境的栈顶弹出，最终执行上下文如下图所示：

![foo执行上下文](/images/browser/block-scope-var-issues-let-const/foo-execute-context-4.png)

通过上面的分析，想必你已经理解了词法环境的结构和工作机制，块级作用域就是通过词法环境的栈结构来实现的，而变量提升是通过变量环境来实现的，通过这两者的结合，JavaScript 引擎也就同时支持了变量提升和块级作用域了。

## 深入理解暂时性死区（Temporal Dead Zone）

前面我们知道了 `let`/`const` 声明的变量不会被提升到函数级作用域，但其实更精确地说，**`let`/`const` 声明的变量也会被"提升"，只是提升方式不同**。

具体来说：

- `var` 声明的变量：提升到函数/全局作用域顶部，并初始化为 `undefined`。
- `let`/`const` 声明的变量：提升到块级作用域顶部，但**不会被初始化**——它们进入了一种"已创建但未初始化"的状态。

从**进入作用域**到**执行到声明语句**之间的这段区域，就叫做**暂时性死区（TDZ, Temporal Dead Zone）**。在 TDZ 内访问这些变量，会抛出 `ReferenceError`。

```js
{
  // TDZ 开始 ——————————
  console.log(x)  // ReferenceError: Cannot access 'x' before initialization
  console.log(y)  // ReferenceError: Cannot access 'y' before initialization
  // TDZ 结束 ——————————
  let x = 1
  const y = 2
  console.log(x)  // 1
  console.log(y)  // 2
}
```

**TDZ 的存在不是"巧合"，而是刻意设计**。它的目的是：

1. **消除变量在声明前被使用的隐患**——`var` 时代 `undefined` 的默认值掩盖了很多 bug。
2. **为 `const` 提供语义保障**——如果 `const` 变量先被初始化为 `undefined`，再赋值为真正的值，那就违反了"只赋值一次"的语义。
3. **使代码行为更可预测**——与其他语言（Java、C++、Rust）的行为保持一致。

### TDZ 的一些"陷阱"

TDZ 不仅出现在简单的块作用域中，还会出现在一些你意想不到的地方：

```js
// 陷阱1：函数参数默认值中的 TDZ
function foo(x = y, y = 1) {
  console.log(x, y)
}
foo() // ReferenceError: Cannot access 'y' before initialization
// 因为参数从左到右求值，求值 x 时 y 还在 TDZ 中

// 陷阱2：typeof 也无法绕过 TDZ
{
  typeof x  // ReferenceError!（如果 x 是 let/const 声明的）
  let x
}
// 注意：对于完全未声明的变量，typeof 返回 'undefined'，不会报错
// 但对于 TDZ 中的变量，typeof 也会抛出 ReferenceError

// 陷阱3：class 声明也有 TDZ
{
  const instance = new Foo() // ReferenceError
  class Foo {}
}
```

从 V8 引擎实现的角度来看，TDZ 是通过在词法环境中给变量打上一个"未初始化"的标记来实现的。当引擎尝试读取变量时，如果发现这个标记还在，就会抛出 `ReferenceError`；只有当执行到声明语句时，这个标记才会被清除，变量才会被正式初始化。

## ES2022+ 对块级作用域的进一步扩展

ES6 引入的块级作用域机制并没有停止演进，后续的 ECMAScript 标准持续在此基础上扩展：

### 1. 类字段声明（ES2022）

ES2022 正式标准化了类的实例字段和静态字段，它们也遵循块级作用域的规则：

```js
class Counter {
  // 实例字段——每个实例独立
  count = 0
  
  // 私有字段——只能在类体内访问
  #secret = 42
  
  // 静态字段
  static instances = 0
  
  constructor() {
    Counter.instances++
  }
  
  getSecret() {
    return this.#secret // 合法
  }
}

const c = new Counter()
// c.#secret  // SyntaxError: Private field '#secret' must be declared in an enclosing class
```

私有字段（`#`）实现了真正的硬私有——不是靠约定（如下划线前缀），而是在引擎层面通过词法作用域来限制访问。

### 2. using 声明与资源管理（ES2025）

ES2025（Explicit Resource Management 提案，已进入 Stage 4）引入了 `using` 关键字，它也遵循块级作用域，当离开作用域时自动调用 `Symbol.dispose` 方法进行资源清理：

```js
{
  using file = openFile('data.txt')
  // 对 file 进行操作...
} // 离开作用域时，自动调用 file[Symbol.dispose]()
```

这类似于 C# 的 `using`、Python 的 `with`、Java 的 `try-with-resources`，是块级作用域的又一次实际应用，体现了 JavaScript 在语言设计上不断向成熟语言靠拢。

### 3. 顶层 await（ES2022）

ES2022 允许在模块的顶层使用 `await`，这也与作用域有关——模块本身就形成了一个独立的作用域：

```js
// 在 ES Module 的顶层可以直接使用 await
const response = await fetch('/api/data')
const data = await response.json()
export { data }
```

## 总结

由于 JavaScript 的变量提升存在着变量覆盖、变量污染等设计缺陷，所以 ES6 引入了块级作用域关键字来解决这些问题。

之后我们还通过对变量环境和词法环境的介绍，分析了 JavaScript 引擎是如何同时支持变量提升和块级作用域的。

**核心要点回顾**：

1. **`var` 存储在变量环境**，提升到函数顶部，初始化为 `undefined`。
2. **`let`/`const` 存储在词法环境**，虽然也会"提升"，但在声明前处于 TDZ 中，不可访问。
3. **词法环境使用栈结构**管理嵌套的块级作用域，进入新块时压栈，离开时弹栈。
4. **`const` 的不可变性是"绑定不可变"**，而非"值不可变"——引用类型的属性仍可修改。
5. **`let` 在 `for` 循环中有特殊行为**——每次迭代创建新的绑定，完美解决循环闭包问题。
6. **TDZ 的存在是刻意设计**——为了安全性和语义正确性。

**现代 JavaScript 的最佳实践**：
- 默认使用 `const`，需要重新赋值时使用 `let`，永远不用 `var`。
- 理解 TDZ，在编码时养成"先声明后使用"的习惯。
- 利用块级作用域限制变量的暴露范围，提高代码可维护性。

## 思考时间

下面给你留个思考题，看下面这样一段代码：

```js
let myname = '极客时间'
{
  console.log(myname) 
  let myname = '极客邦'
}
```

你能通过分析词法环境，得出来最终的打印结果吗？

**分析**

1. 在块级作用域中，从 `{` 开始到 `let myname = '极客邦'` 代码之间形成了一个**暂时性死区（TDZ）**。虽然外层有 `let myname = '极客时间'`，但由于块内也声明了 `let myname`，在块内的 `myname` 声明被提升后（但未初始化），它会"遮蔽"外层的 `myname`。此时访问的是块内那个还在 TDZ 中的 `myname`，所以会报 `Uncaught ReferenceError: Cannot access 'myname' before initialization`。

2. 这个行为验证了我们前面所说的：`let`/`const` 也会被"提升"到块级作用域顶部，但不会被初始化。TDZ 中的变量会遮蔽外层同名变量，且在初始化之前不可访问。

3. 另外上面的 foo 函数最后的 `console.log(d)` 也会报错 `ReferenceError: d is not defined`，因为 d 是在块级作用域中通过 `let` 声明的，在外面是访问不到的。

```js
function foo() {
  var a = 1
  let b = 2
  {
    let b = 3
    var c = 4
    let d = 5
    console.log(a) // 1
    console.log(b) // 3
  }
  console.log(b) // 2
  console.log(c) // 4
  console.log(d) // ReferenceError: d is not defined
}
foo()
```