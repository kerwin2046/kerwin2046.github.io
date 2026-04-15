---
title: "变量提升：JavaScript代码是按顺序执行的吗"
description: "讲解完宏观视角下的浏览器后，从这篇文章开始，我们就进入下一个新的模块了，这里我会对 JavaScript 执行原理做深入介绍。 今天在该模块的第一篇，我们主要讲解执行上下文相关的内容。那为什么先讲执行上下文呢？它这么重要吗？可以这么说，只有理解了 JavaScript 的执行上下文，你才能更好地理..."
date: "2024-01-20"
author: "Kerwin"
tag: "Frontend"
---



> **更新说明（ES2015—ES2025）**：本文最初撰写时以 ES5 的 `var` 和 `function` 为核心展开。随着 ECMAScript 标准从 ES2015（ES6）到 ES2025 的持续演进，`let`、`const`、`class`、箭头函数、模块化等新特性对"变量提升"这一概念产生了深刻影响。本次更新在保留原有核心内容的基础上，补充了现代 JavaScript 视角下的变量提升行为、暂时性死区（TDZ）、严格模式差异以及当代最佳实践，帮助读者建立更加完整和准确的认知模型。

讲解完宏观视角下的浏览器后，从这篇文章开始，我们就进入下一个新的模块了，这里我会对 JavaScript 执行原理做深入介绍。

今天在该模块的第一篇，我们主要讲解执行上下文相关的内容。那为什么先讲执行上下文呢？它这么重要吗？可以这么说，只有理解了 JavaScript 的执行上下文，你才能更好地理解 JavaScript 语言本身，比如变量提升、作用域和闭包等。不仅如此，理解执行上下文和调用栈的概念还能助你成为一名更合格的前端开发者。

不过由于我们专栏不是专门讲 JavaScript 语言的，所以我并不会对 JavaScript 语法本身做过多介绍。本文主要是从 JavaScript 的顺序执行讲起，然后一步步带你了解 JavaScript 是怎么运行的。

接下来咱们先看段代码，你觉得下面这段代码输出的结果是什么？

```js
showName()
console.log(myname)
var myname = '极客时间'
function showName() {
  console.log('函数showName被执行')
}
```

使用过 JavaScript 开发的程序员应该都知道，JavaScript 是按顺序执行的。若按照这个逻辑来理解的话，那么：

- 当执行到第1行的时候，由于函数 showName 还没有定义，所以执行应该会报错。

- 同样执行第2行的时候，由于变量 myname 也未定义，所以同样也会报错。

然而实际执行结果却并非如此，如下图：

![代码打印结果](/images/browser/variable-hoisting-is-js-executed-in-order/console-result.png)

第1行输出"函数showName被执行"，第2行输出"undefined"，这和前面想象中的顺序执行有点不一样啊！

通过上面的执行结果，你应该已经知道了函数或者变量可以在定义之前使用，那如果使用没有定义的变量或者函数，JavaScript 代码还能继续执行吗？为了验证这点，我们可以删除第3行 myname 的定义，如下所示：

```js
showName()
console.log(myname)
function showName() {
  console.log('函数showName被执行')
}
```

然后再次执行这段代码时，JavaScript 引擎就会报错，结果如下：

![代码报错](/images/browser/variable-hoisting-is-js-executed-in-order/console-reference-error.png)

从上面两段代码的执行结果来看，我们可以得出如下三个结论。

- 执行过程中，若使用了未声明的变量，那么 JavaScript 执行会报错。

- 在一个变量定义之前使用它，不会出错，但是该变量的值会为 undefined，而不是定义时的值。

- 在一个函数定义之前使用它，不会出错，且函数能正确执行。

第一个结论很好理解，因为变量没有定义，这样在执行 JavaScript 代码时，就找不到该变量，所以 JavaScript 会抛出错误。

但是对于第二个和第三个结论，就挺让人费解的：

- 变量和函数为什么能在其定义之前使用？这似乎表明 JavaScript 代码并不是一行一行执行的。

- 同样的方式，变量和函数的处理结果为什么不一样？比如上面的执行结果，提前使用的 showName 函数能打印出来完整结果，但是提前使用的 myname 变量值却是 undefined，而不是定义时使用的"极客时间"这个值。

## 变量提升（hoisting）

要解释这两个问题，你就需要先了解下什么是变量提升。

不过在介绍变量提升之前，我们先通过下面这段代码，来看看什么是 JavaScript 中的声明和赋值。

```js
var myname = '极客时间'
```

这段代码你可以把它看成是两行代码组成的：

```js
var myname  // 声明部分
myname = '极客时间' // 赋值部分
```

![声明和赋值](/images/browser/variable-hoisting-is-js-executed-in-order/statement-and-assignment.png)

上面是变量的声明和赋值，那接下来我们再来看看函数的声明和赋值，结合下面这段代码：

```js
function foo() {
  console.log('foo')
}

var bar = function() {
  console.log('bar')
}
```

第一个函数 foo 是一个完整的函数声明，也就是说没有涉及到赋值操作；第二个函数是先声明变量 bar，再把 `function() {console.log('bar')}` 赋值给 bar。为了直观理解，你可以参考下图：

![函数声明](/images/browser/variable-hoisting-is-js-executed-in-order/function-statement.png)

好了，理解了声明和赋值操作，那接下来我们就可以聊聊什么是变量提升了。

**所谓的变量提升，是指在 JavaScript 代码执行过程中，JavaScript 引擎把变量的声明部分和函数的声明部分提升到代码开头的"行为"。变量被提升后，会给变量设置默认值，这个默认值就是我们熟悉的 undefined。**

**需要特别强调的是，"变量提升"本质上是一个概念模型，用来帮助我们理解代码的行为。** 在 JavaScript 引擎的实际实现中，代码并没有被物理地"移动"到作用域顶部。真实的机制是：JavaScript 引擎在**创建执行上下文**的过程中，会先经历一个**编译（解析）阶段**，在这个阶段中，引擎会扫描代码中的所有声明，并将它们注册到当前执行上下文的变量环境（Variable Environment）或词法环境（Lexical Environment）中。换句话说，声明的"提升"只是编译阶段提前处理声明的一个外在表现，而非代码的物理移动。

理解这一点非常重要——这也是为什么 `let`/`const` 存在"暂时性死区"而 `var` 不存在的根本原因，我们将在后面的章节中详细讨论。

下面我们来模拟下实现：

```js
/* 变量提升部分 */
// 把变量 myname 提升到开头
// 同时给 myname 赋值为 undefined
var myname = undefined
// 把函数 showName 提升到开头
function showName() {
  console.log('showName被调用')
}

/* 可执行代码部分 */
showName()
console.log(myname)
// 去掉var声明部分，保留赋值语句
myname = '极客时间'
```

为了模拟变量提升的效果，我们对代码做了以下调整，如下图：

![模拟变量提升](/images/browser/variable-hoisting-is-js-executed-in-order/simulation-variable-promote.png)

从图中可以看出，对原来的代码主要做了两处调整：

- 第一处是把声明的部分都提升到了代码开头，如变量 `myname` 和函数 `showName`，并给变量设置默认值 `undefined`。

- 第二处是移除原本声明的变量和函数，如 `var myname = '极客时间'` 的语句，移除了 `var` 声明，整个移除 `showName` 的函数声明。

- 通过这两步，就可以实现变量提升的效果。你也可以执行这段模拟变量提升的代码，其输出结果和第一段代码应该是完全一样的。

通过这段模拟的变量提升代码，相信你已经明白了可以在定义之前使用变量或者函数的原因——函数和变量在执行之前都提升到了代码开头。

## JavaScript代码的执行流程

从概念的字面意义上来看，"变量提升"意味着变量和函数的声明会在物理层面移动到代码的最前面，正如我们所模拟的那样。但，这并不准确。实际上变量和函数声明在代码里的位置是不会改变的，而且是在编译阶段被 JavaScript 引擎放入内存中。对，你没听错，一段 JavaScript 代码在执行之前需要被 JavaScript 引擎编译，编译完成之后，才会进入执行阶段。大致流程你可以参考下图：

![执行流程](/images/browser/variable-hoisting-is-js-executed-in-order/execute-process.png)

**关于现代引擎的补充说明：** 这里提到的"编译"并不是像 C/C++ 那样一步到位地编译成机器码。现代 JavaScript 引擎采用的是**多层编译架构**：

- **V8 引擎**（Chrome/Node.js）：源代码首先经过 **Parser** 解析为 AST（抽象语法树），然后由 **Ignition**（解释器）编译为**字节码**（bytecode）并解释执行。当某些函数被频繁调用（热点代码）时，**TurboFan**（优化编译器）会将其进一步编译为高度优化的**机器码**。
- **SpiderMonkey 引擎**（Firefox）：同样先编译为字节码，由 **Baseline Interpreter** 解释执行，之后热点代码会经过 **Baseline Compiler** 和 **IonMonkey**（现已被 Warp 取代）逐级优化为机器码。
- **JavaScriptCore 引擎**（Safari）：使用 **LLInt**（Low Level Interpreter）→ **Baseline JIT** → **DFG JIT** → **FTL JIT** 四级编译管线。

虽然各引擎的实现细节不同，但有一个共同点：**源代码不会被直接编译为机器码，而是先编译为字节码**。不过在理解变量提升这个概念时，你只需要关注"编译阶段"和"执行阶段"这两个大的步骤即可——在编译阶段，引擎会处理所有的声明。

### 1.编译阶段

那么编译阶段和变量提升存在什么关系呢？

为了搞清楚这个问题，我们还是回过头来看上面那段模拟变量提升的代码，为了方便介绍，可以把这段代码分成两部分。

**第一部分：变量提升部分的代码**

```js
var myname = undefined
function showName() {
  console.log('函数showName被执行')
}
```

**第二部分：执行部分的代码**

```js
showName()
console.log(myname)
myname = '极客时间'
```

下面我们就可以把 JavaScript 的执行流程细化，如下图所示：

![JavaScript执行流程细化](/images/browser/variable-hoisting-is-js-executed-in-order/execute-process-thining.png)

从上图可以看出，输入一段代码，经过编译后，会生成两部分内容：执行上下文（Execution context）和可执行代码。

执行上下文是 JavaScript 执行一段代码时的运行环境，比如调用一个函数，就会进入这个函数的执行上下文，确定该函数在执行期间用到的诸如 this、变量、对象以及函数等。

关于执行上下文的细节，我会在下一篇文章《08 | 调用栈：为什么 JavaScript 代码会出现栈溢出？》做详细介绍，现在你只需要知道，在执行上下文中存在一个变量环境的对象（Viriable Environment），该对象中保存了变量提升的内容，比如上面代码中的变量 myname 和函数 showName，都保存在该对象中。

你可以简单地把变量环境对象看成是如下结构：

```js
VariableEnvironment:
  myname -> undefined, 
  showName -> function : {console.log(myname)}
```

了解完变量环境对象的结构后，接下来，我们再结合下面这段代码来分析下是如何生成变量环境对象的。

```js
showName()
console.log(myname)
var myname = '极客时间'
function showName() {
  console.log('函数showName被执行')
}
```

我们可以一行一行来分析上述代码：

- 第1行和第2行，由于这两行代码不是声明操作，所以 JavaScript 引擎不会做任何处理。

- 第3行，由于这行是经过 var 声明的，因此 JavaScript 引擎将在环境对象中创建一个名为 myname 的属性，并使用 undefined 对其初始化。

- 第4行，JavaScript 引擎发现一个通过 function 定义的函数，所以它将函数定义存储到堆（HEAP）中，并在环境对象中创建一个 showName 的属性，然后将该属性值指向堆中函数的位置（不了解堆也没关系，JavaScript 的执行堆和执行栈我会在后续文章中介绍）。这样就生成了变量环境对象。接下来 JavaScript 引擎会把声明以外的代码编译为字节码，至于字节码的细节，我也会在后面文章中做详细介绍，你可以类比如下的模拟代码：

```js
showName()
console.log(myname)
myname = '极客时间'
```

好了，现在有了执行上下文和可执行代码了，那么接下来就到了执行阶段了。

### 2.执行阶段

JavaScript 引擎开始执行"可执行代码"，按照顺序一行一行地执行。下面我们就来一行一行分析下这个执行过程。

- 当执行到 showName 函数时，JavaScript 引擎便开始在变量环境对象中查找该函数，由于变量环境对象中存在该函数的引用，所以 JavaScript 引擎便开始执行该函数，并输出"函数showName被执行"结果。

- 接下来打印"myname"信息，JavaScript 引擎继续在变量环境对象中查找该对象，由于变量环境存在 myname 变量，并且其值为 undefined，所以这时候就输出 undefined。

- 接下来执行第3行，把"极客时间"赋给 myname 变量，赋值后变量环境中的 myname 属性值改变为"极客时间"，变量环境如下所示：

```js
VariableEnvironment:
  myname -> '极客时间', 
  showName -> function: {console.log(myname)}
```

好了，以上就是一段代码的编译和执行流程。实际上，编译阶段和执行阶段都是非常复杂的，包括了词法分析、语法解析、代码优化、代码生成等，这些内容我会在《14 | 编译器和解释器：V8是如何执行一段JavaScript代码的？》那节详细介绍，在本篇文章中你只需要知道 JavaScript 代码经过编译生成了什么内容就可以了。

## 代码中出现相同的变量或者函数怎么办？

现在你已经知道了，在执行一段 JavaScript 代码之前，会编译代码，并将代码中的函数和变量保存到执行上下文的变量环境中，那么如果代码中出现了重名的函数或者变量，JavaScript 引擎会如何处理？

我们先看下面这样一段代码：

```js
function showName() {
  console.log('极客邦')
}
showName()
function showName() {
  console.log('极客时间')
}
showName()
```

在上面代码中，我们先定义了一个 showName 的函数，该函数打印出来"极客邦"；然后调用 showName，并定义了一个 showName 函数，这个 showName 函数打印出来的是"极客时间"；最后接着继续调用 showName。那么你能分析出来这两次调用打印出来的值是什么吗？

**我们来分析下其完整执行流程：**

- **首先是编译阶段**。遇到了第一个 showName 函数，会将该函数体存放到变量环境中。接下来是第二个 showName 函数，继续存放至变量环境中，但是变量环境中已经存在一个 showName 函数了，此时，第二个 showName 函数会将第一个 showName 函数覆盖掉。这样变量环境中就只存在第二个 showName 函数了。

- **接下来是执行阶段**。先执行第一个 showName 函数，但由于是从变量环境中查找 showName 函数，而变量环境中只保存了第二个 showName 函数，所以最终调用的是第二个函数，打印的内容是"极客时间"。第二次执行 showName 函数也是走同样的流程，所以输出的结果也是"极客时间"。

综上所述，**一段代码如果定义了两个相同名字的函数，那么最终生效的是最后一个函数**。

## 现代视角下的变量提升

前面我们讨论的变量提升主要围绕 `var` 和 `function` 声明展开，这是 ES5 时代的核心知识。随着 ES2015 引入了 `let`、`const`、`class` 等新的声明方式，"变量提升"这一概念变得更加微妙。让我们从现代 JavaScript 的角度重新审视各种声明的提升行为。

### `var` 声明：提升声明，不提升赋值

这是我们前面已经详细讨论过的行为。`var` 声明的变量会被提升到当前函数作用域（或全局作用域）的顶部，并且在提升时被初始化为 `undefined`：

```js
console.log(x); // undefined —— 已声明但未赋值
var x = 10;
console.log(x); // 10
```

等价于：

```js
var x = undefined; // 声明被提升，初始化为 undefined
console.log(x);    // undefined
x = 10;            // 赋值留在原位
console.log(x);    // 10
```

### `function` 声明：完整提升（声明 + 定义）

函数声明是唯一一种**既提升声明又提升定义**的方式。这意味着不仅函数名会被注册到变量环境中，函数体也会一并被关联上：

```js
greet(); // "Hello!" —— 完整的函数定义已被提升

function greet() {
  console.log("Hello!");
}
```

但是，**函数表达式**的行为完全不同——它遵循变量提升的规则，而非函数声明的规则：

```js
sayHi(); // TypeError: sayHi is not a function

var sayHi = function() {
  console.log("Hi!");
};
```

在上面的代码中，`var sayHi` 被提升并初始化为 `undefined`，所以在调用 `sayHi()` 时，实际上是在对 `undefined` 执行函数调用，因此抛出的是 `TypeError`（类型错误），而非 `ReferenceError`（引用错误）。

这一区别在实际开发中非常重要：如果你使用函数声明，可以在代码中的任何位置调用它；但如果你使用函数表达式（包括箭头函数），就必须在赋值之后才能调用。

### `let` 和 `const`：提升但不初始化（暂时性死区）

很多开发者认为 `let` 和 `const` 不存在提升，但这并不准确。**`let` 和 `const` 同样会被提升**，只是它们的提升行为与 `var` 有着本质区别：

- `var`：提升 + 初始化为 `undefined`
- `let`/`const`：提升 + **不初始化**（进入暂时性死区 TDZ）

所谓**暂时性死区（Temporal Dead Zone，TDZ）**，是指从作用域开始到变量声明语句之间的区域。在 TDZ 内访问该变量会抛出 `ReferenceError`：

```js
{
  // TDZ 开始 ——————————————
  console.log(name); // ReferenceError: Cannot access 'name' before initialization
  // TDZ 结束 ——————————————
  let name = "JavaScript";
  console.log(name); // "JavaScript"
}
```

注意这里错误信息是 "Cannot access 'name' **before initialization**"，而不是 "name is not defined"——这恰恰说明引擎已经**知道** `name` 的存在（因为声明被提升了），但在初始化之前拒绝访问它。

为什么要引入 TDZ？这是为了让代码行为更加可预测：在变量声明之前使用它本身就是不良实践，`let`/`const` 通过 TDZ 机制将这种隐患从静默的 `undefined` 提升为显式的运行时错误，帮助开发者在开发阶段就发现问题。

> 关于 `let` 和 `const` 的块级作用域以及 TDZ 的更多细节，将在后续文章《09 | 块级作用域：var缺陷以及为什么要引入let和const？》中详细介绍。

### `class` 声明：行为类似 `let`

`class` 声明的提升行为与 `let` 完全一致——声明被提升，但不会初始化，同样存在 TDZ：

```js
const dog = new Animal("Dog"); // ReferenceError: Cannot access 'Animal' before initialization

class Animal {
  constructor(name) {
    this.name = name;
  }
}
```

这与函数声明形成了鲜明对比。之所以 `class` 不像 `function` 那样完整提升，是因为类可能有继承关系（`extends`），父类表达式需要在正确的时机求值：

```js
// 如果 class 完整提升，下面的 getBase() 可能还未定义
class Child extends getBase() {
  // ...
}
```

### 各种声明提升行为对比

| 声明方式 | 是否提升 | 提升时的初始值 | 作用域 | TDZ |
|---------|---------|-------------|-------|-----|
| `var` | 是 | `undefined` | 函数作用域 | 无 |
| `function` 声明 | 是 | 完整函数体 | 函数作用域（非严格模式下块内有特殊行为） | 无 |
| `let` | 是 | **未初始化** | 块级作用域 | 有 |
| `const` | 是 | **未初始化** | 块级作用域 | 有 |
| `class` | 是 | **未初始化** | 块级作用域 | 有 |
| 函数表达式 / 箭头函数 | 遵循 `var`/`let`/`const` 的规则 | 遵循所用声明关键字 | 遵循所用声明关键字 | 遵循所用声明关键字 |

## 严格模式下的变量提升

在非严格模式下，**块级作用域中的函数声明**有着令人困惑的行为——它们在不同引擎中的表现甚至不一致。ES2015 规范明确了这一行为，但也保留了一些"web 遗留兼容"规则。让我们通过具体代码来看看严格模式的差异。

### 非严格模式：块内函数声明会"泄漏"

```js
// 非严格模式
console.log(typeof foo); // "undefined"（不是 ReferenceError）

if (true) {
  function foo() {
    return "inside block";
  }
  console.log(foo()); // "inside block"
}

console.log(typeof foo); // "function" —— foo "泄漏"到了外部！
console.log(foo());      // "inside block"
```

在非严格模式下，块内的函数声明会通过一种"遗留兼容"机制同时影响外部作用域。简单来说，`var foo` 会被提升到外层函数作用域，但函数体的赋值则发生在块内声明所在的位置。这种行为既复杂又容易出错。

### 严格模式：块内函数声明被限制在块内

```js
"use strict";

console.log(typeof foo); // "undefined"

if (true) {
  function foo() {
    return "inside block";
  }
  console.log(foo()); // "inside block"
}

console.log(typeof foo); // "undefined" —— foo 没有泄漏到外部！
```

在严格模式下，块内的函数声明仅在块级作用域中有效，不会影响外部作用域。这种行为更加清晰和可预测。

### 实践建议

鉴于块内函数声明在不同模式下行为不一致，**最佳实践是避免在块内使用函数声明**：

```js
// ❌ 不推荐：块内函数声明
if (condition) {
  function doSomething() { /* ... */ }
}

// ✅ 推荐：使用函数表达式
let doSomething;
if (condition) {
  doSomething = function() { /* ... */ };
}

// ✅ 更推荐：使用 const + 箭头函数
const doSomething = condition
  ? () => { /* ... */ }
  : () => { /* fallback */ };
```

## 总结

好了，今天就到这里，下面我来总结下今天的主要内容：

- JavaScript 代码执行过程中，需要先做变量提升，而之所以需要实现变量提升，是因为 JavaScript 代码在执行之前需要先编译。在编译阶段，变量和函数会被存放到变量环境中，变量的默认值会被设置为 undefined；在代码执行阶段，JavaScript 引擎会从变量环境中去查找自定义的变量和函数。

- **"变量提升"是一个概念模型**，用于描述编译阶段声明被提前处理的行为，代码并没有被物理移动。

- 如果在编译阶段，存在两个相同的函数，那么最终存放在变量环境中的是最后定义的那个，这是因为后定义的会覆盖掉之前定义的。

- 现代 JavaScript 引擎（如 V8 的 Ignition + TurboFan）采用**多层编译架构**，源代码先被编译为字节码再解释执行，热点代码会被进一步优化编译为机器码。

- `let`、`const`、`class` 声明同样存在提升，但它们不会被初始化，而是进入**暂时性死区（TDZ）**，在声明语句之前访问会抛出 `ReferenceError`。

- `function` 声明会被**完整提升**（包括函数体），函数表达式则遵循其所使用的声明关键字的规则。

- 在严格模式下，块内函数声明会被限制在块级作用域内，不会泄漏到外部。

- **现代最佳实践**：优先使用 `const`（适用于不需要重新赋值的绑定）> 其次使用 `let`（需要重新赋值时）> **永远不要使用 `var`**。`const` 和 `let` 拥有块级作用域、TDZ 保护以及不可重复声明等特性，能从根本上避免变量提升带来的各种陷阱。

- 以上就是今天所讲的主要内容，当然，学习这些内容并不是让你掌握一些 JavaScript 小技巧，其主要目的是让你清楚 JavaScript 的执行机制：**先编译，再执行**。

如果你了解了 JavaScript 执行流程，那么在编写代码时，你就能避开一些陷阱；在分析代码过程中，也能通过分析 JavaScript 的执行过程来定位问题。

## 思考时间

最后，看下面这段代码：

```js
showName()
var showName = function() {
  console.log(2)
}
function showName() {
  console.log(1)
}
```

你能按照 JavaScript 的执行流程，来分析最终输出结果吗？

分析

```js
输出1
```

编译阶段：

```js
var showName
function showName() {console.log(1)}
```

在编译阶段，首先处理 `var showName`，将 showName 注册到变量环境并初始化为 `undefined`。接着遇到函数声明 `function showName()`，由于函数声明的优先级高于变量声明（函数声明会覆盖同名的变量声明），所以此时变量环境中的 showName 指向该函数体。

执行阶段

```js
showName() // 输出1，因为此时 showName 指向 function showName() {console.log(1)}
showName = function() {console.log(2)} // 将 showName 重新赋值为新的函数表达式
// 如果后面再有 showName 执行的话，就输出2，因为这时候函数引用已经变了
```

> **延伸思考**：如果把 `var` 改成 `let` 或 `const`，会发生什么？答案是会直接报语法错误——因为 `let`/`const` 不允许与同一作用域内的函数声明重名。这也是现代 JavaScript 帮助我们避免命名冲突的方式之一。