---
title: "栈空间和堆空间：数据是如何存储的"
description: "对于前端开发者来说，JavaScript 的内存机制是一个不被经常提及的概念，因此很容易被忽视。特别是一些非计算机专业的同学，对内存机制可能没有非常清晰地认识，甚至有些同学根本就不知道 JavaScript 的内存机制是什么。 但是如果你想成为行业专家，并打造高性能前端应用，那么你就必须要搞清楚..."
date: "2024-02-05"
author: "Kerwin"
tag: "Frontend"
---



> **2025 更新说明**：本文在原有内容基础上进行了全面修订。新增了 V8 引擎内部实现细节（Tagged Pointer、Hidden Class、Inline Cache），补充了 ES2020/ES2021 以来的现代内存优化手段（SharedArrayBuffer、WeakRef、FinalizationRegistry 等），并深入解析了闭包在 V8 Context 链中的实际存储机制。代码示例已全面使用 `let`/`const` 替代 `var`，以符合现代 JavaScript 最佳实践。

对于前端开发者来说，JavaScript 的内存机制是一个不被经常提及的概念，因此很容易被忽视。特别是一些非计算机专业的同学，对内存机制可能没有非常清晰地认识，甚至有些同学根本就不知道 JavaScript 的内存机制是什么。

但是如果你想成为行业专家，并打造高性能前端应用，那么你就必须要搞清楚 JavaScript 的内存机制了。

其实，要搞清楚 JavaScript 的内存机制并不是一件很困难的事，在接下来的三篇文章（数据在内存中的存放、JavaScript 处理垃圾回收以及 V8 执行代码）中，我们将通过内存机制的介绍，循序渐进带你走进 JavaScript 内存的世界。

今天我们讲述第一部分的内容——JavaScript 中的数据是如何存储在内存中的。虽然 JavaScript 并不需要直接去管理内存，但是在实际项目中为了能避开一些不必要的坑，你还是需要了解数据在内存中的存储方式的。

## 让人疑惑的代码

首先，我们先看下面这两段代码：

```js
function foo() {
  let a = 1
  let b = a
  a = 2
  console.log(a)
  console.log(b)
}
foo()
```

```js
function foo() {
  let a = { name: '极客时间' }
  let b = a
  a.name = '极客邦'
  console.log(a)
  console.log(b)
}
foo()
```

若执行上述这两段代码，你知道它们输出的结果是什么吗？下面我们就来一个一个分析下。

执行第一段代码，打印出来 a 的值是2，b 的值是1，这没什么难以理解的。

接着，再执行第二段代码，你会发现，仅仅改变了 a 中 name 的属性值，但是最终 a 和 b 打印出来的值都是 { name: '极客邦' }。这就和我们预期的不一致了，因为我们想改变的仅仅是 a 的内容，但 b 的内容也同时被改变了。

要彻底弄清楚这个问题，我们就得先从"JavaScript 是什么类型的语言"讲起。

## JavaScript是什么类型的语言

每种编程语言都具有内建的数据类型，但它们的数据类型常有不同之处，使用方式也很不一样，比如 C 语言在定义变量之前，就需要确定变量的类型，你可以看下面这段 C 代码：

```c++
int main()
{
  int a = 1;
  char* b = '极客时间';
  bool c = true;
  return 0;
}
```

上述代码声明变量的特点是：在声明变量之前需要先定义变量类型。我们把这种在使用之前就需要确认其变量数据类型的称为静态语言。

相反地，我们把在运行过程中需要检查数据类型的语言称为动态语言。比如我们所讲的 JavaScript 就是动态语言，因为在声明变量之前并不需要确认其数据类型。

虽然 C 语言是静态，但是在 C 语言中，我们可以把其他类型数据赋予给一个声明好的变量，如：

```js
c = a
```

前面代码中，我们把 int 型的变量 a 赋值给了 bool 型的变量 c，这段代码也是可以编译的，因为在赋值过程中，C 编译器会把 int 型的变量悄悄转换为 bool 型的变量，我们通常把这种偷偷转换的操作称为隐式类型装换。而支持隐式类型转换的语言称为弱类型语言，不支持隐式类型装换的语言称为强类型语言。在这点上，C 和 JavaScript 都是弱类型语言。

对于各种语言的类型，你可以参考下图：

![语言类型](/images/browser/stack-heap-how-data-stored/language-type.png)

## JavaScript的数据类型

现在我们知道了，JavaScript 是一种弱类型的、动态的语言。那这些特点意味着什么呢？

- **弱类型**，意味着你不需要告诉 JavaScript 引擎这个或那个变量是什么数据类型，JavaScript 引擎在运行代码的时候自己会计算出来。

- **动态**，意味着你可以使用同一个变量保存不同类型的数据。

那么接下来，我们再来看看 JavaScript 的数据类型，你可以看下面这段代码：

```js
let bar
bar = 12
bar = '极客时间'
bar = true
bar = null
bar = { name: '极客时间' }
bar = 9007199254740991n // BigInt 类型
bar = Symbol('id')      // Symbol 类型
```

从上述代码中你可以看出，我们声明了一个 bar 变量，然后可以使用各种类型的数据值赋予给该变量。

在 JavaScript 中，如果你想要查看一个变量到底是什么类型，可以使用 `typeof` 运算符。具体使用方式如下所示：

```js
let bar
console.log(typeof bar)  // undefined
bar = 12
console.log(typeof bar)  // number
bar = '极客时间'
console.log(typeof bar)  // string
bar = true
console.log(typeof bar)  // boolean
bar = null
console.log(typeof bar)  // object（历史遗留 Bug）
bar = { name: '极客时间' }
console.log(typeof bar)  // object
bar = Symbol('id')
console.log(typeof bar)  // symbol
bar = 9007199254740991n
console.log(typeof bar)  // bigint
```

执行这段代码，你可以看到打印出来了不同的数据类型，有 undefined、number、string、boolean、object、symbol、bigint 等。那么接下来我们就来谈谈 JavaScript 到底有多少种数据类型。

JavaScript 中的数据类型一共有 **8 种**，它们分别是：

1. **Boolean** —— 布尔值，只有 `true` 和 `false` 两个值
2. **Null** —— 空值，表示"无"的特殊值
3. **Undefined** —— 未定义，变量声明但未赋值时的默认值
4. **Number** —— 数字，包含整数和浮点数，遵循 IEEE 754 双精度标准
5. **String** —— 字符串，不可变的字符序列
6. **Symbol**（ES2015）—— 符号，独一无二的标识符，常用于对象属性键
7. **BigInt**（ES2020）—— 大整数，可以表示任意精度的整数，弥补了 Number 类型无法精确表示超过 2^53 - 1 的整数的限制
8. **Object** —— 对象，包括普通对象、数组、函数、Date、RegExp 等

![JavaScript的数据类型](/images/browser/stack-heap-how-data-stored/javascript-data-type.png)

了解这些类型之后，还有几点需要你注意一下。

- 第一点，使用 typeof 检测 Null 类型时，返回的是 Object。这是当初 JavaScript 语言的一个 Bug，一直保留至今，之所以一直没修改过来，主要是为了兼容老的代码。

- 第二点，BigInt 是 ES2020 新增的原始类型，它能够表示任意精度的整数。当你需要处理超大整数运算时（例如加密算法、高精度金融计算），BigInt 非常有用。你可以在数字后加 `n` 来创建 BigInt，如 `const big = 123456789012345678901234567890n`。需要注意的是，BigInt 和 Number 不能直接混合运算，需要显式转换。

- 第三点，Object 类型比较特殊，它是由上述 7 种类型组成的一个包含了 key-value 对的数据类型。如下所示：

```js
const myObj = {
  name: '极客时间',
  update: function() {....}
}
```

从中你可以看出来，Object 是由 key-value 组成的，其中的 value 可以是任何类型，包括函数，这也就意味着你可以通过 Object 来存储数据，Object 中的函数有称为方法，比如上述代码中的 update 方法。

- 第四点，我们把前面的 7 种数据类型称为原始类型，把最后一个对象类型称为引用类型，之所以把它们区分为两种不同的类型，是因为它们在内存中存放的位置不一样。到底怎么个不一样法呢？接下来，我们就来讲解一下 JavaScript 的原始类型和引用类型到底是怎么储存的。

## 内存空间

要理解 JavaScript 在运行过程中数据是如何存储的，你就得先搞清楚其存储空间的种类。下面是我画的 JavaScript 的内存模型，你可以参考下：

![内存模型](/images/browser/stack-heap-how-data-stored/memory-model.png)

从图中可以看出，在 JavaScript 的执行过程中，主要有三种类型的内存空间，分别是代码空间、栈空间和堆空间。

其中的代码空间主要是存储可执行代码的，这个我们后面再做介绍，今天主要来说说栈空间和堆空间。

## 栈空间和堆空间

这里的栈空间就是我们之前反复提及的调用栈，是用来存储执行上下文的。为了搞清楚栈空间是如何存储数据的，我们还是先看下面这段代码：

```js
function foo() {
  const a = '极客时间'
  const b = a
  const c = { name: '极客时间' }
  const d = c
}
foo()
```

前面文章我们已经讲解过了，当执行一段代码时，需要先编译，并创建执行上下文，然后再按照顺序执行代码。那么下面我们来看看，当执行到第 3 行代码时，其调用栈的状态，你可以参考下面这张调用栈状态图：

![调用栈状态](/images/browser/stack-heap-how-data-stored/call-stack-status.png)

从图中可以看出来，当执行到第 3 行时，变量 a 和变量 b 的值都被保存在执行上下文中，而执行上下文又被压入到栈中，所以你也可以认为变量 a 和变量 b 的值都是存放在栈中的。

接下来继续执行第 4 行代码，由于 JavaScript 引擎判断右边的值是一个引用类型，这时候处理的情况就不一样了，JavaScript 引擎并不是直接将该对象存放到变量环境中，而是将它分配到堆空间里面，分配后该对象会有一个在"堆"中的地址，然后再将该数据的地址写进 c 的变量值，最终分配好内存的示意图如下所示：

![内存示意图](/images/browser/stack-heap-how-data-stored/memory-sketch.png)

从上图你可以清晰地观察到，对象类型是存放在堆空间的，在栈空间中只是保留了对象的引用地址，当 JavaScript 需要访问该数据的时候，是通过栈中的引用地址来访问的，相当于多了一道转手流程。

好了，现在你应该知道了原始类型的数据值都是直接保存在"栈"中的，引用类型的值是存放在"堆"中的。不过你也许会好奇，为什么一定要分"堆"和"栈"两个存储空间呢？所有数据直接存放在"栈"中不就可以了吗？

答案是不可以的。这是因为 JavaScript 引擎需要用栈来维护程序执行期间上下文的状态，如果栈空间大的话，所有的数据都存放在栈空间里面，那么会影响到上下文切换的效率，进而又影响到整个程序的执行效率。比如文中的 foo 函数执行结束了，JavaScript 引擎需要离开当前的执行上下文，只需要将指针下移到上个执行上下文的地址就可以了，foo 函数执行上下文栈区间全部回收，具体过程你可以参考下图：

![调用栈切换执行上下文状态](/images/browser/stack-heap-how-data-stored/call-stack-switch-status.png)

所以通常情况下，栈空间都不会设置太大，主要用来存放一些原始类型的小数据。而引用类型的数据占用的空间都比较大，所以这一类数据会被存放到堆中，堆空间很大，能存放很多大的数据，不过缺点是分配内存和回收内存都会占用一定的时间。

解释了程序在执行过程中为什么需要堆和栈两种数据结构后，我们还是回到示例代码那里，看看它最后一步将变量 c 赋值给变量 d 是怎么执行的？

在 JavaScript 中，赋值操作和其他语言有很大的不同，原始类型的赋值会完整复制变量值，而引用类型的赋值是复制引用地址。

所以 d = c 的操作就是把 c 的引用地址赋值给 d，你可以参考下图：

![赋值引用地址](/images/browser/stack-heap-how-data-stored/assign-quote-site.png)

从图中你可以看到，变量 c 和变量 d 都指向了同一个堆中的对象，所以这就很好地解释了文章开头的那个问题，通过 c 修改 name 的值，变量 d 的值也跟着改变，归根结底它们是同一个对象。

## 深入 V8 引擎：数据的真实存储方式

上面我们从 JavaScript 语言层面讨论了栈和堆的区别。但如果你想真正理解数据是如何存储的，就需要深入到 V8 引擎的内部实现中去看一看。

### Tagged Pointer（标记指针）与 SMI 优化

在 V8 内部，所有的 JavaScript 值都通过一种叫做 **Tagged Pointer（标记指针）** 的机制来表示。V8 利用指针的最低位（Least Significant Bit）来区分一个值是指向堆对象的指针，还是一个直接嵌入的小整数（Small Integer，简称 **SMI**）。

具体来说：

- **最低位为 0**：表示这是一个 SMI（小整数），实际的整数值存储在指针的高位中。在 64 位系统上，SMI 的范围是 -2^31 到 2^31 - 1。
- **最低位为 1**：表示这是一个指向堆对象的指针（Strong Pointer）。

```js
// 以下代码在 V8 内部的存储方式截然不同：

const a = 42        // SMI：直接编码在指针中，不需要堆分配！
const b = 3.14      // HeapNumber：需要在堆上分配一个 HeapNumber 对象
const c = 2 ** 31   // HeapNumber：超出 SMI 范围，也需要堆分配
const d = 'hello'   // HeapObject：字符串对象存储在堆上
```

这种设计的巧妙之处在于：**大量常见的小整数运算完全避免了堆内存分配**。在实际的 JavaScript 程序中，整数是最常见的数据类型之一（循环计数器、数组索引、状态码等），SMI 优化极大地减少了 GC（垃圾回收）的压力，提升了运行性能。

### Hidden Class（隐藏类）与对象布局

当 V8 在堆上创建一个对象时，它不会像字典那样用哈希表来存储属性。相反，V8 会为每个对象关联一个 **Hidden Class**（也叫 Map 或 Shape），用来描述对象的"形状"——即该对象有哪些属性、每个属性在内存中的偏移量。

```js
const point1 = { x: 1, y: 2 }
const point2 = { x: 3, y: 4 }
// point1 和 point2 共享同一个 Hidden Class
// Hidden Class 记录了：x 在偏移量 0，y 在偏移量 1

const point3 = { x: 5, y: 6, z: 7 }
// point3 有不同的 Hidden Class，因为它多了一个 z 属性
```

Hidden Class 的核心机制是 **转换链（Transition Chain）**：

1. 创建空对象 `{}` 时，V8 分配一个初始 Hidden Class（C0）
2. 添加属性 `x` 时，V8 创建新的 Hidden Class（C1），并在 C0 上记录"添加 x → 转换到 C1"
3. 添加属性 `y` 时，V8 再创建 Hidden Class（C2），并在 C1 上记录"添加 y → 转换到 C2"

如果后续创建的对象按照**相同的顺序**添加相同的属性，它们就会复用同一条转换链，共享同一个 Hidden Class。这就是为什么 V8 鼓励你：

- **以相同的顺序初始化对象属性**——确保对象共享 Hidden Class
- **避免在对象创建后动态添加/删除属性**——这会导致 Hidden Class 分裂，产生大量不同的 Shape
- **使用构造函数或类来创建对象**——这样所有实例天然共享同一个 Hidden Class

### Inline Cache（内联缓存）

有了 Hidden Class 之后，V8 还利用 **Inline Cache（IC）** 来加速属性访问。IC 的原理是"记住"上次访问某个属性时对象的 Hidden Class 和属性偏移量，下次再访问时直接跳过查找过程。

```js
function getX(point) {
  return point.x  // V8 在这里插入一个 Inline Cache
}

const p1 = { x: 1, y: 2 }
const p2 = { x: 3, y: 4 }

getX(p1) // 第一次调用：IC 记录 Hidden Class 和 x 的偏移量
getX(p2) // 第二次调用：p2 与 p1 共享 Hidden Class，IC 命中！直接读取偏移量
```

IC 有三种状态：

- **Uninitialized（未初始化）**：还没有被调用过
- **Monomorphic（单态）**：只见过一种 Hidden Class，性能最优
- **Polymorphic（多态）**：见过 2-4 种 Hidden Class，性能略有下降
- **Megamorphic（超多态）**：见过太多种 Hidden Class，退化为通用的哈希查找，性能最差

这也解释了为什么编写"形状一致"的代码在性能上至关重要：

```js
// 好的写法：所有对象形状一致，IC 保持 Monomorphic
function processPoints(points) {
  let sum = 0
  for (const p of points) {
    sum += p.x + p.y
  }
  return sum
}

const points = [
  { x: 1, y: 2 },
  { x: 3, y: 4 },
  { x: 5, y: 6 },
]
processPoints(points)

// 差的写法：对象形状不一致，IC 退化为 Megamorphic
const mixedPoints = [
  { x: 1, y: 2 },
  { x: 3, y: 4, z: 0 },   // 多了 z 属性
  { y: 6, x: 5 },          // 属性顺序不同
]
processPoints(mixedPoints) // 性能更差
```

## 再谈闭包

现在你知道了作用域内的原始类型数据会被存储到栈空间，引用类型会被存储到堆空间，基于这两点的认知，我们再深入一步，探讨下闭包的内存模型。

```js
function foo() {
  let myName = '极客时间'
  let test1 = 1
  const test2 = 2
  const innerBar = {
    setName: function(newName) {
      myName = newName
    },
    getName: function() {
      console.log(test1)
      return myName
    }
  }
  return innerBar
}
const bar = foo()
bar.setName('极客邦')
bar.getName()
console.log(bar.getName())
```

当执行这段代码的时候，你应该有过这样的分析：由于变量 myName、test1、test2 都是原始类型数据，所以在执行 foo 函数的时候，它们会被压入到调用栈中；当 foo 函数执行结束之后，调用栈中 foo 函数的执行上下文会被销毁，其内部变量 myName、test1、test2 也应该一同被销毁。

要解释这个现象，我们就得站在内存模型的角度来分析这段代码的执行流程。

- 当 JavaScript 引擎执行到 foo 函数时，首先会编译，并创建一个空执行上下文。

- 在编译过程中，遇到内部函数 setName，JavaScript 引擎还要对内部函数做一次快速的词法扫描，发现该内部函数引用了 foo 函数中的 myName 变量，由于是内部函数引用了外部函数的变量，所以 JavaScript 引擎判断这是一个闭包，于是在堆空间创建了一个 `closure(foo)` 的对象（这是一个内部对象，JavaScript 是无法访问的），用来保存 myName 变量。

- 接着继续扫描到 getName 方法时，发现该函数内部还引用变量 test1，于是 JavaScript 引擎又将 test1 添加到 `closure(foo)` 对象中。这时候堆中的 `closure(foo)` 对象中就包含了 myName 和 test1 两个变量了。

- 由于 test2 并没有被内部函数引用，所以 test2 依然保存在调用栈中。

通过上面的分析，我们可以画出执行到 foo 函数中 return innerBar 语句时的调用栈状态，如下图所示：

![闭包的产生过程](/images/browser/stack-heap-how-data-stored/closure-produce-process.png)

从上图你可以清晰地看出，当执行到 foo 函数时，闭包就产生了；当 foo 函数执行结束之后，返回的 getName 和 setName 方法都引用 `closure(foo)` 对象，所以即使 foo 函数退出了，`closure(foo)` 依然被其内部的 getName 和 setName 方法引用。所以在下次调用 bar.setName 或者 bar.getName 时，创建的执行上下文中就包含了 `closure(foo)`。

总的来说，产生闭包的核心有两步：

- 第一步是需要预扫描内部函数。

- 第二步是把内部函数引用的外部变量保存到堆中。

### 深入 V8：闭包与 Context 链

上面我们从宏观上理解了闭包的产生过程。现在让我们更深入地看看 V8 引擎内部是如何实现闭包的。

在 V8 中，闭包的实现依赖于 **Context（上下文）对象**。当 V8 编译一个函数并发现其中存在闭包变量（被内部函数引用的外部变量）时，它不会将这些变量分配到栈上，而是创建一个 **Context 对象**存储在堆中。

具体流程如下：

1. **编译阶段**：V8 的解析器（Parser）分析函数的 AST（抽象语法树），识别出哪些变量被内部函数"捕获"（captured）。
2. **Context 分配**：被捕获的变量不会放在栈帧中，而是分配到一个堆上的 Context 对象里。未被捕获的局部变量仍然留在栈上。
3. **Context 链**：如果存在多层嵌套闭包，每一层都会创建自己的 Context 对象，它们通过 `previous` 指针串联成一条 **Context 链**，类似于作用域链。

```js
function outer() {
  let outerVal = 'outer'         // 被 inner 捕获 → 存入 outer 的 Context

  function middle() {
    let middleVal = 'middle'     // 被 inner 捕获 → 存入 middle 的 Context

    function inner() {
      // inner 访问 outerVal 时：
      // 先查找 middle 的 Context → 没有 → 沿 previous 指针找到 outer 的 Context → 找到！
      console.log(outerVal, middleVal)
    }

    return inner
  }

  return middle
}

const mid = outer()    // outer 的 Context 被 middle 引用，不会被回收
const inn = mid()      // middle 的 Context 被 inner 引用，不会被回收
inn()                  // 输出 'outer middle'
```

这种 Context 链机制意味着：

- **内存占用是精确的**：V8 只会把实际被引用的变量放入 Context，而不是整个作用域的所有变量。
- **访问外层变量有额外开销**：每多一层嵌套，就需要多跳一次 `previous` 指针，所以深层嵌套的闭包访问外层变量会比访问本层变量稍慢。
- **闭包可能导致意外的内存泄漏**：如果闭包的生命周期很长（例如被绑定为事件监听器），那么整条 Context 链上的所有 Context 对象都不会被回收。

一个常见的陷阱是：

```js
function createHandler() {
  const hugeData = new Array(1000000).fill('*')  // 大量数据
  const id = 42

  return function handler() {
    // 虽然 handler 只引用了 id，
    // 但在某些旧版引擎中，hugeData 可能也被保留在 Context 中
    // 现代 V8 已经优化了这一点，只捕获实际引用的变量
    console.log(id)
  }
}
```

**好消息是**，现代 V8 的编译器非常智能，它只会将实际被闭包引用的变量分配到 Context 中。在上面的例子中，`hugeData` 不会被放入 Context，当 `createHandler` 执行完毕后会被正常回收。但为了代码的可读性和安全性，建议仍然保持闭包尽量"轻量"。

## 现代内存优化：ES2020+ 新特性

随着 JavaScript 语言的演进和 Web 应用的复杂化，ES2020 和 ES2021 引入了一系列与内存管理紧密相关的新特性。了解这些特性能帮助你编写更高效、更安全的代码。

### SharedArrayBuffer 与 Atomics：Worker 间的共享内存

传统的 Web Worker 通信基于消息传递（`postMessage`），数据在主线程和 Worker 之间需要被序列化和反序列化（或通过 Transferable 转移所有权），这在处理大量数据时会产生显著的性能开销。

**SharedArrayBuffer** 提供了一种真正的共享内存机制——多个 Worker 可以同时访问同一块内存区域，无需拷贝：

```js
// 主线程
const sharedBuffer = new SharedArrayBuffer(1024) // 分配 1KB 共享内存
const sharedArray = new Int32Array(sharedBuffer)

const worker = new Worker('worker.js')
worker.postMessage(sharedBuffer) // 只传递引用，不拷贝数据

// worker.js
self.onmessage = function(e) {
  const sharedArray = new Int32Array(e.data)
  // 直接读写共享内存
  Atomics.add(sharedArray, 0, 1)       // 原子性加 1
  Atomics.store(sharedArray, 1, 42)    // 原子性写入
  const val = Atomics.load(sharedArray, 0)  // 原子性读取
}
```

由于多个线程可能同时读写共享内存，**Atomics** 对象提供了一组原子操作来避免数据竞争（data race）：

- `Atomics.add/sub/and/or/xor` —— 原子性算术和位运算
- `Atomics.load/store` —— 原子性读取和写入
- `Atomics.compareExchange` —— CAS（Compare-And-Swap）操作
- `Atomics.wait/notify` —— 线程同步（阻塞/唤醒）

### ArrayBuffer 与 TypedArray：高效的二进制数据处理

不同于 SharedArrayBuffer 用于多线程共享，**ArrayBuffer** 是单线程下管理原始二进制数据的基础。**TypedArray**（如 Int8Array、Float64Array 等）则提供了类型化的视图来读写 ArrayBuffer：

```js
// 创建一个 256 字节的缓冲区
const buffer = new ArrayBuffer(256)

// 通过不同的 TypedArray 视图来读写同一块内存
const uint8View = new Uint8Array(buffer)    // 每个元素 1 字节
const float64View = new Float64Array(buffer) // 每个元素 8 字节

// 写入数据
uint8View[0] = 255
float64View[0] = 3.14

// 实际应用：处理二进制文件、WebGL 纹理数据、音频处理等
```

与普通 JavaScript 数组相比，TypedArray 的优势在于：

- **内存紧凑**：元素连续存储，没有对象头和类型标签的开销
- **类型固定**：不需要运行时类型检查
- **可预测的性能**：V8 可以生成高度优化的机器码来处理 TypedArray

### WeakRef 与 FinalizationRegistry（ES2021）：弱引用与清理回调

在常规的引用关系中，只要有一个引用指向某个对象，该对象就不会被垃圾回收。但有些场景下，我们希望"观察"一个对象而不阻止其被回收——这就是 **WeakRef** 的用途：

```js
let target = { name: '极客时间', data: new Array(100000) }
const weakRef = new WeakRef(target)

// 通过 deref() 获取原始对象（如果它还没有被回收的话）
console.log(weakRef.deref()?.name)  // '极客时间'

target = null  // 移除强引用

// 在某个未来的时间点，GC 可能回收了 target 指向的对象
// 此时 weakRef.deref() 将返回 undefined
setTimeout(() => {
  console.log(weakRef.deref())  // 可能是 undefined
}, 10000)
```

**FinalizationRegistry** 允许你在对象被垃圾回收时收到通知，执行清理回调：

```js
const registry = new FinalizationRegistry((heldValue) => {
  console.log(`对象被回收了，关联信息: ${heldValue}`)
  // 执行清理操作，例如关闭文件句柄、释放外部资源等
})

let obj = { name: '临时对象' }
registry.register(obj, 'obj-cleanup-token')  // 注册监听

obj = null  // 移除引用，等待 GC 回收后触发回调
```

> **注意**：WeakRef 和 FinalizationRegistry 的回调时机是不确定的，取决于 GC 的执行策略。不要依赖它们来执行关键的业务逻辑，它们更适合用于缓存、资源池、诊断等辅助场景。

### WeakMap 与 WeakSet：防止内存泄漏的利器

**WeakMap** 和 **WeakSet** 是 ES2015 就引入的特性，但在防止内存泄漏方面的重要性随着应用复杂度的提升而日益凸显。

WeakMap 的键必须是对象，且对键的引用是弱引用——当键对象没有其他强引用时，它会被垃圾回收，对应的键值对也会自动从 WeakMap 中移除：

```js
const cache = new WeakMap()

function processElement(element) {
  if (cache.has(element)) {
    return cache.get(element)
  }

  const result = heavyComputation(element)
  cache.set(element, result)
  return result
}

// 当 element 从 DOM 中移除且没有其他引用时，
// WeakMap 中对应的缓存项也会自动被回收，不会造成内存泄漏

// 对比：如果使用普通 Map，即使 element 被移除，
// Map 仍然持有对 element 的强引用，导致内存泄漏
```

WeakMap 的典型使用场景：

- **DOM 元素关联数据**：为 DOM 节点附加额外数据而不阻止其被回收
- **对象私有数据**：实现类似私有属性的效果
- **缓存与 Memoization**：自动清理不再需要的缓存项

WeakSet 与 WeakMap 类似，只存储对象引用且为弱引用，常用于"标记"对象（例如标记已处理的节点、检测循环引用等）。

## 总结

好了，今天就讲到这里，下面我来简单总结下今天的要点。

我们介绍了 JavaScript 中的 8 种数据类型（Boolean、Null、Undefined、Number、String、Symbol、BigInt、Object），它们可以分为两大类——原始类型和引用类型。

其中，原始类型的数据是存放在栈中，引用类型的数据是存放在堆中的。堆中的数据是通过引用和变量关联起来的。也就是说，JavaScript 的变量是没有数据类型的，值才有数据类型，变量可以随时持有任何类型的数据。

在 V8 引擎内部，数据的存储远比"栈和堆"更为精细：小整数通过 Tagged Pointer 直接编码在指针中（SMI 优化），避免了堆分配；对象通过 Hidden Class 描述其形状，实现了高效的属性访问；Inline Cache 进一步加速了热点代码中的属性查找。

然后我们分析了，在 JavaScript 中将一个原始类型的变量 a 赋值给 b，那么 a 和 b 会相互独立、互不影响；但是将引用类型的变量 a 赋值给变量 b，那会导致 a、b 两个变量都同时指向了堆中的同一块数据。

我们还深入探讨了闭包在 V8 中的实际实现——通过 Context 对象和 Context 链来精确捕获和保存闭包变量，以及如何避免闭包导致的内存泄漏。

最后，我们介绍了现代 JavaScript 中与内存管理相关的重要特性：SharedArrayBuffer 实现了 Worker 间的零拷贝共享内存，TypedArray 提供了高效的二进制数据处理，WeakRef/FinalizationRegistry 实现了弱引用和回收通知，WeakMap/WeakSet 则是防止内存泄漏的得力工具。

## 思考时间

在实际的项目中，经常需要完整地拷贝一个对象，也就是说拷贝完成之后两个对象之间就不能互相影响。那该如何实现呢？

结合下面这段代码，你可以分析下它是如何将对象 jack 拷贝给 jack2，然后在完成拷贝操作时两个 jack 还互不影响的呢。

```js
const jack = {
  name: 'jack.ma',
  age: 40,
  like: {
    dog: {
      color: 'black',
      age: 3,
    },
    cat: {
      color: 'white',
      age: 2
    }
  }
}

function copy(src) {
  // 方法一：JSON 序列化（简单但有局限性，无法处理函数、Symbol、循环引用等）
  // return JSON.parse(JSON.stringify(src))

  // 方法二：现代方法，使用 structuredClone（推荐，支持循环引用和更多类型）
  // return structuredClone(src)

  // 方法三：递归实现深拷贝
  let dest
  if (typeof src !== 'object' || src === null) {
    return src
  }
  dest = Array.isArray(src) ? [] : {}
  for (const key in src) {
    if (Object.prototype.hasOwnProperty.call(src, key)) {
      dest[key] = copy(src[key])
    }
  }
  return dest
}

const jack2 = copy(jack)

// 比如修改 jack2 中的内容，不会影响到 jack 中的值
jack2.like.dog.color = 'green'
console.log(jack.like.dog.color) // 打印出来的应该是 'black'
```

> **补充**：在现代浏览器和 Node.js v17+ 中，推荐使用内置的 `structuredClone()` 方法来实现深拷贝。它支持循环引用、Map、Set、Date、RegExp、ArrayBuffer 等类型，是目前最可靠的深拷贝方案。

关于 foo 函数执行上下文销毁过程：foo 函数执行结束之后，当前执行状态的指针下移到栈中的全局执行上下文的位置，foo 函数的执行上下文的那块数据就挪出来，这也就是 foo 函数执行上下文的销毁过程，这个文中有提到，你可以参考"调用栈中切换执行上下文状态"图。

第二个问题：innerBar 返回后，含有 setName 和 getName 对象，这两个对象里面包含了堆中的 closure(foo) 的引用。虽然 foo 执行上下文销毁了，foo 函数中的对 closure(foo) 的引用也断开了，但是 setName 和 getName 里面又重新建立起来了对象 closure(foo) 引用。

你可以：

- 打开"开发者工具"。

- 在控制台执行上述代码。

- 然后选择"Memory"标签，点击"take snapshot"获取 V8 的堆内存快照。

- 然后"command + f"（mac）或者"ctrl + f"（win），搜索 setName，然后你就会发现 setName 对象下面包含了 `raw_outer_scope_info_or_feedback_metadata`，对闭包的引用数据就在这里面。