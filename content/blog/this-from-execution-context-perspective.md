---
title: "this：从JavaScript执行上下文视角讲this"
description: "在上篇文章中，我们讲了词法作用域、作用域链以及闭包，并在最后思考题留了下面这样一段代码： ```js var bar = { myName: 'time.geekbang.com', printName: function() { console.log(myName) } }..."
date: "2024-02-01"
author: "Kerwin"
tag: "Frontend"
---



> **2025 更新说明**：本文在原有内容基础上进行了全面更新，新增了 ES6+ 箭头函数与 class 中 this 的行为分析、this 绑定优先级规则、`globalThis`（ES2020）等现代 JavaScript 特性的讲解，并对 `call`/`apply`/`bind` 三者的区别做了更详尽的阐述。同时修正了原文中的若干笔误，补充了更多实际开发中的现代模式与最佳实践。

在上篇文章中，我们讲了词法作用域、作用域链以及闭包，并在最后思考题留了下面这样一段代码：

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

相信你已经知道了，在 printName 函数里面使用的变量 myName 是属于全局作用域下面的，所以最终打印出来的值都是"极客邦"。这是因为 JavaScript 语言的作用域链是由词法作用域决定的，而词法作用域是由代码结构来确定的。

不过按照常理来说，调用 bar.printName 方法时，该方法内部的变量 myName 应该使用 bar 对象中的，因为它们是一个整体，大多数面向对象语言都是这样设计的，比如我用 C++ 改写了上面那段代码，如下所示：

```c++
#include <iostream>
using namespace std;
class Bar{
  public:
  char* myName;
  Bar() {
    myName = 'time.geekbang.com';
  }
  void printName() {
    cout<< myName <<endl;
  }  
} bar;
 
char* myName = '极客邦';
int main() {
	bar.printName();
	return 0;
}
```

在这段 C++ 代码中，我同样调用了 bar 对象中的 printName 方法，最后打印出来的值就是 bar 对象内部变量 myName 值——"time.geekbang.com"，而并不是最外面定义变量 myName 的值——"极客邦"，所以在对象内部的方法中使用对象内部的属性是一个非常普遍的需求。但是 JavaScript 的作用域机制并不支持这一点，基于这个需求，JavaScript 又搞出另外一套 this 机制。

所以，在 JavaScript 中可以使用 this 实现在 printName 函数中访问到 bar 对象的 myName 属性了。具体该怎么操作呢？你可以调整 printName 的代码，如下所示：

```js
printName: function() {
  console.log(this.myName)
}
```

接下来咱们就展开来介绍 this，不过在讲解之前，希望你能区分清楚作用域链和 this 是两套不同的系统，它们之间基本没太多联系。在前期明确这点，可以避免你在学习 this 的过程中，和作用域产生一些不必要的关联。

## JavaScript中的this是什么

关于 this，我们还得先从执行上下文说起。在前面几篇文章中，我们提到执行上下文中包含了变量环境、词法环境、外部环境，但其实还有一个 this 没有提及，具体你可以参考下图：

![执行上下文环境](/images/browser/this-from-execution-context-perspective/execute-context-environment.png)

从图中可以看出，this 是和执行上下文绑定的，也就是说每个执行上下文中都有一个 this。前面《08 | 调用栈：为什么JavaScript代码会出现栈溢出？》中我们提到过，执行上下文主要分为三种——全局执行上下文、函数执行上下文和 eval 执行上下文，所以对应的 this 也只有这三种——全局执行上下文中的 this、函数中的 this 和 eval 中的 this。

那么接下来我们就重点讲解下全局执行上下文中的 this 和函数执行上下文中的 this。

## 全局执行上下文中的this

首先我们来看看全局执行上下文中的 this 是什么。

你可以在控制台中输入 console.log(this) 来打印出来全局执行上下文中的 this，最终输出的是 window 对象。所以你可以得出这样一个结论：在全局执行上下文中的 this 是指向 window 对象的。这也是 this 和作用域链的唯一交点，作用域链的最低端包含了 window 对象，全局执行上下文中的 this 也是指向 window 对象。

## 函数执行上下文中的this

现在你已经知道全局对象中的 this 是指向 window 对象了，那么接下来，我们就来重点分析函数执行上下文中的 this。还是先看下面这段代码：

```js
function foo() {
  console.log(this)
}
foo()
```

> 我们在 foo 函数内部打印出来 this 值，执行这段代码，打印出来的也是 window 对象，这说明在默认情况下调用一个函数，其执行上下文中的 this 也是指向 window 对象的。估计你会好奇，那能不能设置执行上下文中的 this 来指向其他对象呢？答案是肯定的。通常情况下，有下面三种方式来设置函数执行上下文中的 this 值。

### 1.通过函数的call/apply/bind方法设置

你可以通过函数的 `call` 方法来设置函数执行上下文的 this 指向，比如下面这段代码，我们就并没有直接调用 foo 函数，而是调用了 foo 的 call 方法，并将 bar 对象作为 call 方法的参数：

```js
let bar = {
  myName: '极客邦',
  test1: 1
}
function foo() {
  this.myName = '极客时间'
}
foo.call(bar)
console.log(bar)
console.log(myName)
```

执行这段代码，然后观察输出结果，你就能发现 foo 函数内部的 this 已经指向 bar 对象，因为通过打印 bar 对象，可以看出 bar 的 myName 属性已经由"极客邦"变为"极客时间"了，同时在全局执行上下文中打印 myName，JavaScript 引擎提示该变量未定义。

除了 `call` 方法，你还可以使用 `apply` 和 `bind` 方法来设置函数执行上下文中的 this。这三者都能显式地绑定 this，但它们之间存在重要的区别，理解这些区别在实际开发中至关重要：

**`call`：立即调用，参数逐个传递**

`call` 会**立即调用**函数，并将第一个参数作为函数内部的 this，其余参数**逐个传递**给函数：

```js
function greet(greeting, punctuation) {
  console.log(greeting + ', ' + this.name + punctuation)
}
const user = { name: '极客时间' }
greet.call(user, '你好', '！') // 输出：你好, 极客时间！
```

**`apply`：立即调用，参数以数组传递**

`apply` 同样会**立即调用**函数，第一个参数也是 this 的绑定对象，但第二个参数是一个**数组**（或类数组对象），数组中的元素会作为函数的参数依次传入：

```js
greet.apply(user, ['你好', '！']) // 输出：你好, 极客时间！
```

一个简单的记忆方法：**a**pply 对应 **a**rray（数组），**c**all 对应 **c**omma（逗号分隔）。

`apply` 在需要将数组展开为参数列表时特别有用，比如 `Math.max.apply(null, [1, 2, 3])`。不过在现代 JavaScript 中，展开运算符 `...` 已经可以替代这种用法：`Math.max(...[1, 2, 3])`。

**`bind`：返回新函数，不立即调用**

`bind` 与 `call`/`apply` 有本质的不同——它**不会立即调用**函数，而是**返回一个新函数**，这个新函数的 this 被永久绑定为指定的对象：

```js
const boundGreet = greet.bind(user, '你好')
boundGreet('！') // 输出：你好, 极客时间！

// bind 还支持参数的部分应用（柯里化）
const sayHello = greet.bind(user, '你好', '！')
sayHello() // 输出：你好, 极客时间！
```

`bind` 在事件处理、回调函数等需要延迟执行的场景中特别有用。需要注意的是，通过 `bind` 绑定的 this 是**不可再更改**的——即使对已经 bind 过的函数再次使用 call 或 apply，this 仍然指向最初 bind 的对象：

```js
const boundFn = foo.bind(bar)
const anotherObj = { myName: '另一个对象' }
boundFn.call(anotherObj) // this 仍然指向 bar，而非 anotherObj
```

### 2.通过对象调用方法设置

要改变函数执行上下文中的 this 指向，除了通过函数的 call/apply/bind 方法来实现外，还可以通过对象调用的方式，比如下面这段代码：

```js
var myObj = {
  name: '极客时间', 
  showThis: function() {
    console.log(this)
  }
}
myObj.showThis()
```

在这段代码中，我们定义了一个 myObj 对象，该对象是由一个 name 属性和一个 showThis 方法组成的，然后再通过 myObj 对象来调用 showThis 方法。执行这段代码，你可以看到，最终输出的 this 值是指向 myObj 的。

所以，你可以得出这样的结论：使用对象来调用其内部的一个方法，该方法的 this 是指向对象本身的。

其实，你也可以认为 JavaScript 引擎在执行 myObj.showThis() 时，将其转化为了：

```js
myObj.showThis.call(myObj)
```

接下来我们稍微改变下调用方式，把 showThis 赋给一个全局对象，然后再调用该对象，代码如下所示：

```js
var myObj = {
  name: '极客时间',
  showThis: function() {
    this.name = '极客邦'
    console.log(this)
  }
}
var foo = myObj.showThis
foo()
```

执行这段代码，你会发现 this 又指向了全局 window 对象。

所以通过以上两个例子的对比，你可以得出下面这样两个结论：

- 在全局环境中调用一个函数，函数内部的 this 指向的是全局变量 window。

- 通过一个对象来调用其内部的一个方法，该方法的执行上下文中的 this 指向对象本身。

### 3.通过构造函数中设置

你可以像这样设置构造函数中的 this，如下面的示例代码：

```js
function CreateObj(){
  this.name = '极客时间'
}
var myObj = new CreateObj()
```

在这段代码中，我们使用 new 创建了对象 myObj，那你知道此时的构造函数 CreateObj 中的 this 到底指向了谁吗？

其实，当执行 new CreateObj() 的时候，JavaScript 引擎做了如下四件事：

- 首先创建了一个空对象 tempObj。

- 接着调用 CreateObj.call 方法，并将 tempObj 作为 call 方法的参数，这样当 CreateObj 的执行上下文创建时，它的 this 就指向了 tempObj 对象。

- 然后执行 CreateObj 函数，此时的 CreateObj 函数执行上下文中的 this 指向了 tempObj 对象。

- 最后返回 tempObj 对象。

为了直观理解，我们可以用代码来演示下：

```js
var tempObj = {}
CreateObj.call(tempObj)
return tempObj
```

这样，我们就通过 new 关键字构建好了一个新对象，并且构造函数中的 this 其实就是新对象本身。

## this 绑定的优先级

在实际开发中，同一个函数可能同时满足多种 this 绑定规则，此时就需要了解它们之间的优先级。this 的绑定遵循以下优先级，从高到低依次为：

### 1. new 绑定（优先级最高）

通过 `new` 关键字调用构造函数时，this 绑定到新创建的对象上。即使函数已经通过 `bind` 绑定了 this，`new` 仍然会覆盖它：

```js
function Foo(name) {
  this.name = name
}
const boundFoo = Foo.bind({ name: '被绑定的对象' })
const obj = new boundFoo('new 创建的对象')
console.log(obj.name) // 输出：new 创建的对象
```

### 2. 显式绑定（call / apply / bind）

通过 `call`、`apply` 或 `bind` 显式指定 this 的值。显式绑定的优先级高于隐式绑定：

```js
function showName() {
  console.log(this.name)
}
const obj1 = { name: 'obj1', showName }
const obj2 = { name: 'obj2' }
obj1.showName.call(obj2) // 输出：obj2（显式绑定 > 隐式绑定）
```

### 3. 隐式绑定（对象方法调用）

当函数作为对象的方法被调用时，this 指向该对象。但要注意，只有**最后一层**调用位置才会影响 this：

```js
const obj = {
  name: '极客时间',
  inner: {
    name: '内层对象',
    showName: function() {
      console.log(this.name)
    }
  }
}
obj.inner.showName() // 输出：内层对象（this 指向 inner，而非 obj）
```

### 4. 默认绑定（优先级最低）

当函数独立调用时（不带任何修饰符），在非严格模式下 this 指向全局对象 `window`（浏览器环境），在严格模式下 this 为 `undefined`：

```js
function standalone() {
  console.log(this)
}
standalone() // 非严格模式：window；严格模式：undefined
```

用一个综合示例来验证优先级：

```js
function identify() {
  return this.name
}
const person = { name: '隐式绑定' }
const bound = identify.bind({ name: '显式绑定' })

// 默认绑定 < 隐式绑定
person.identify = identify
console.log(person.identify()) // 隐式绑定

// 隐式绑定 < 显式绑定
console.log(identify.call({ name: '显式绑定' })) // 显式绑定

// 显式绑定 < new 绑定
function Person(name) { this.name = name }
const BoundPerson = Person.bind({ name: '被忽略' })
const p = new BoundPerson('new 绑定')
console.log(p.name) // new 绑定
```

记住这个优先级顺序：**new > 显式（call/apply/bind） > 隐式（方法调用） > 默认（独立调用）**。在判断 this 指向时，按照这个顺序从高到低依次检查，第一个匹配的规则就是最终的绑定结果。

## ES6+ 中 this 的新规则

ES6 及其后续版本为 JavaScript 引入了许多新特性，其中一些从根本上改变了 this 的行为。理解这些新规则，是写好现代 JavaScript 的关键。

### 箭头函数：词法 this 绑定

箭头函数（Arrow Function）是 ES6 最重要的特性之一，它对 this 的处理与传统函数截然不同。

**核心规则：箭头函数没有自己的 this。** 箭头函数不会创建自己的执行上下文中的 this 绑定，而是在**定义时**从外层作用域中**捕获** this 的值。注意，是**定义时**而非调用时——这一点与普通函数完全相反。

```js
const obj = {
  name: '极客时间',
  // 传统函数：this 取决于调用方式
  traditional: function() {
    console.log(this.name)
  },
  // 箭头函数：this 取决于定义时的外层作用域
  arrow: () => {
    console.log(this.name)
  }
}

obj.traditional() // 输出：极客时间（this 指向 obj）
obj.arrow()       // 输出：undefined（this 指向 window，因为箭头函数定义在全局作用域中）
```

上面的例子是一个容易踩坑的地方：对象字面量 `{}` 并不会创建新的作用域，所以 `arrow` 箭头函数的外层作用域是全局作用域，this 指向 window 而非 obj。

箭头函数的 this 是在定义时就确定的，之后无论如何调用，this 都不会改变。`call`、`apply`、`bind` 都无法改变箭头函数的 this：

```js
const arrowFn = () => {
  console.log(this)
}
const obj = { name: 'test' }
arrowFn.call(obj)   // 仍然输出 window（或严格模式下的 undefined）
arrowFn.apply(obj)  // 同上
const bound = arrowFn.bind(obj)
bound()              // 同上
```

**箭头函数不能作为构造函数。** 箭头函数没有内部的 `[[Construct]]` 方法，因此不能使用 `new` 关键字调用，否则会抛出 TypeError：

```js
const Foo = () => {}
const obj = new Foo() // TypeError: Foo is not a constructor
```

同样，箭头函数也没有 `prototype` 属性和 `arguments` 对象。

### Class 中的 this

ES6 引入的 `class` 语法虽然本质上仍然是基于原型的语法糖，但在 this 的处理上引入了一些值得注意的特性。

**class 中的方法默认不会自动绑定 this。** 这意味着如果你将 class 的方法提取出来单独调用，this 会丢失：

```js
class Logger {
  constructor(prefix) {
    this.prefix = prefix
  }
  log(message) {
    console.log(`${this.prefix}: ${message}`)
  }
}

const logger = new Logger('App')
logger.log('启动')        // 输出：App: 启动

const detachedLog = logger.log
detachedLog('启动')       // TypeError: Cannot read property 'prefix' of undefined
                          // （class 默认运行在严格模式下，this 为 undefined）
```

为了解决这个问题，现代 JavaScript 提供了**类字段箭头函数**的模式（Class Fields + Arrow Function）：

```js
class Logger {
  constructor(prefix) {
    this.prefix = prefix
  }
  // 使用类字段 + 箭头函数，this 在实例创建时自动绑定
  log = (message) => {
    console.log(`${this.prefix}: ${message}`)
  }
}

const logger = new Logger('App')
const detachedLog = logger.log
detachedLog('启动') // 输出：App: 启动 ✅
```

这种写法之所以有效，是因为类字段在构造函数执行时被初始化，此时箭头函数捕获到的 this 就是正在创建的实例。它等价于在 constructor 中写 `this.log = (message) => { ... }`。

另一种传统的方式是在构造函数中手动绑定：

```js
class Logger {
  constructor(prefix) {
    this.prefix = prefix
    this.log = this.log.bind(this) // 手动绑定
  }
  log(message) {
    console.log(`${this.prefix}: ${message}`)
  }
}
```

### 严格模式下 this 的行为

在前面我们已经提到，严格模式会改变默认绑定下 this 的值。这里再做一个更全面的说明。

在**严格模式**（`'use strict'`）下，当函数以独立调用的方式执行时，this 的值是 `undefined`，而不是全局对象 window：

```js
'use strict'
function foo() {
  console.log(this) // undefined
}
foo()
```

需要注意的是，`class` 内部的代码**始终运行在严格模式下**，无需显式声明 `'use strict'`。这就是为什么上面 class 中方法脱离对象调用时 this 是 `undefined` 而非 window。

严格模式只影响**默认绑定**。`call`、`apply`、`bind`、对象方法调用和 `new` 绑定在严格模式下的行为与非严格模式一致。不过有一个细微差别：在非严格模式下，`call(null)` 或 `call(undefined)` 会把 this 转为全局对象；而在严格模式下，传入什么就是什么：

```js
'use strict'
function show() {
  console.log(this)
}
show.call(null)      // null
show.call(undefined) // undefined
show.call(42)        // 42（非严格模式下会被包装为 Number 对象）
```

## this的设计缺陷以及应对方案

就我个人而言，this 并不是一个很好的设计，因为它的很多使用方法都冲击人的直觉，在使用过程中存在着非常多的坑。下面咱们就来一起看看那些 this 设计缺陷。

### 1.嵌套函数中的this不会从外层函数中继承

我认为这是一个严重的设计错误，并影响了后来的很多开发者，让他们"前赴后继"迷失在该错误中。我们还是结合下面这样一段代码来分析下：

```js
var myObj = {
  name: '极客时间', 
  showThis: function() {
    console.log(this)
    function bar() {
      console.log(this)
    }
    bar()
  }
}
myObj.showThis()
```

我们在这段代码的 showThis 方法里面添加了一个 bar 方法，然后接着在 showThis 函数中调用了 bar 函数，那么现在的问题是：bar 函数中的 this 是什么？

如果你刚接触 JavaScript，那么你可能会很自然地觉得，bar 中的 this 应该和其外层 showThis 函数中的 this 是一致的，都是指向 myObj 对象的，这很符合人的直觉。但实际情况却并非如此，执行这段代码后，你会发现函数 bar 中的 this 指向的是全局 window 对象，而函数 showThis 中的 this 指向的是 myObj 对象。这就是JavaScript 中非常容易让人迷惑的地方之一，也是很多问题的源头。

你可以通过一个小技巧来解决这个问题，比如在 showThis 函数中声明一个变量 self 用来保存 this，然后在 bar 函数中使用 self，代码如下所示：

```js
var myObj = {
  name: '极客时间', 
  showThis: function() {
    console.log(this)
    var self = this
    function bar() {
      self.name = '极客邦'
    }
    bar()
  }
}
myObj.showThis()
console.log(myObj.name)
console.log(window.name)
```

执行这段代码，你可以看到它输出了我们想要的结果，最终 myObj 中的 name 属性值变成了"极客邦"。其实，这个方法的本质是把 this 体系转换为了作用域的体系。

其实，你也可以使用 ES6 中的箭头函数来解决这个问题，结合下面代码：

```js
var myObj = {
  name: '极客时间', 
  showThis: function() {
    console.log(this)
    var bar = () => {
      this.name = '极客邦'
      console.log(this)
    }
    bar()
  }
}
myObj.showThis()
console.log(myObj.name)
console.log(window.name)
```

执行这段代码，你会发现它也输出了我们想要的结果，也就是箭头函数 bar 里面的 this 是指向 myObj 对象的。这是因为 ES6 中的箭头函数并不会创建其自身的执行上下文，所以箭头函数中的 this 取决于它的外部函数。

通过上面的讲解，你现在应该知道了 this 没有作用域的限制，这点和变量不一样，所以嵌套函数不会从调用它的函数中继承 this，这样会造成很多不符合直觉的代码。要解决这个问题，你可以有两种思路：

- 第一种是把 this 保存为一个 self 变量，再利用变量的作用域机制传递给嵌套函数。

- 第二种是继续使用 this，但是要把嵌套函数改为箭头函数，因为箭头函数没有自己的执行上下文，所以它会继承调用函数中的 this。

### 2.普通函数中的this默认指向全局对象window

上面我们已经介绍过了，在默认情况下调用一个函数，其执行上下文中的 this 是默认指向全局对象 window 的。

不过这个设计也是一种缺陷，因为在实际工作中，我们并不希望函数执行上下文中的 this 默认指向全局对象，因为这样会打破数据的边界，造成一些误操作。如果要让函数执行上下文中的 this 指向某个对象，最好的方式是通过 call 方法来显示调用。

这个问题可以通过设置 JavaScript 的 `严格模式` 来解决。在严格模式下，默认执行一个函数，其函数的执行上下文中的 this 值是 undefined，这就解决上面的问题了。

## 现代 JavaScript 中的 this 模式与最佳实践

随着 JavaScript 语言的不断演进，围绕 this 出现了许多现代化的模式和工具。了解这些实践能帮助你在现代项目中更加游刃有余。

### 类字段自动绑定方法

前面在 Class 一节中我们已经介绍了类字段箭头函数的写法，这里再结合一个更实际的场景——事件处理——来加深理解：

```js
class Counter {
  count = 0

  // 使用类字段 + 箭头函数，直接作为事件回调传递时 this 不会丢失
  handleClick = () => {
    this.count++
    console.log(`当前计数: ${this.count}`)
  }

  mount(button) {
    button.addEventListener('click', this.handleClick)
    // 无需 this.handleClick.bind(this)
  }

  unmount(button) {
    button.removeEventListener('click', this.handleClick)
    // 由于引用不变，可以正确移除事件监听
  }
}
```

这种 `handleClick = () => { ... }` 的写法，是目前处理 class 方法 this 绑定问题最简洁也是最推荐的方式。

### React 中的 this：从 class 组件到函数组件

React 的发展历程完美地体现了 JavaScript 社区对 this 问题的态度转变。

在**类组件**中，this 问题无处不在。你需要在构造函数中绑定每一个事件处理方法，或者使用类字段箭头函数：

```jsx
// 传统的类组件写法
class MyComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = { count: 0 }
    // 必须手动绑定，否则 handleClick 中的 this 为 undefined
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick() {
    this.setState({ count: this.state.count + 1 })
  }
  render() {
    return <button onClick={this.handleClick}>{this.state.count}</button>
  }
}

// 使用类字段箭头函数的改进写法
class MyComponent extends React.Component {
  state = { count: 0 }
  handleClick = () => {
    this.setState({ count: this.state.count + 1 })
  }
  render() {
    return <button onClick={this.handleClick}>{this.state.count}</button>
  }
}
```

而**函数组件 + Hooks** 的出现，从根本上绕开了 this 的问题。在函数组件中，你根本不需要和 this 打交道：

```jsx
function MyComponent() {
  const [count, setCount] = useState(0)
  const handleClick = () => {
    setCount(count + 1)
  }
  return <button onClick={handleClick}>{count}</button>
}
```

React 社区从类组件向函数组件的迁移，一定程度上也是对 this 机制复杂性的一种"投票"——当你可以不用 this 时，代码往往更简洁、更可预测。

### globalThis：统一的全局 this（ES2020）

在 ES2020 之前，获取全局对象在不同环境中需要不同的方式：

```js
// 浏览器中
console.log(window)
console.log(self)

// Node.js 中
console.log(global)

// Web Worker 中
console.log(self)
```

这给编写跨平台代码带来了很大的麻烦。ES2020 引入了 `globalThis`，提供了一种**标准化**的方式来获取全局对象，无论代码运行在什么环境中：

```js
// 在任何环境中都能正确工作
console.log(globalThis)

// 浏览器中：globalThis === window  // true
// Node.js 中：globalThis === global  // true
// Web Worker 中：globalThis === self  // true
```

`globalThis` 的意义不仅仅是一个方便的别名，更是 JavaScript 向统一跨平台体验迈出的重要一步。在编写需要兼容多环境的库或工具时，推荐使用 `globalThis` 替代 `window` 或 `global`。

## 总结

好了，今天就到这里了，下面我们来回顾下今天的内容。

首先，在使用 this 时，为了避坑，你要谨记以下三点：

- 当函数作为对象的方法调用时，函数中的 this 就是该对象。

- 当函数被正常调用时，在严格模式下，this 值是 undefined，非严格模式下 this 指向的是全局对象 window。

- 嵌套函数中的 this 不会继承外层函数的 this 值。

其次，我们梳理了 **this 绑定的优先级**——new 绑定 > 显式绑定（call/apply/bind） > 隐式绑定（方法调用） > 默认绑定（独立调用）。在判断 this 指向时，按照这个优先级从高到低依次匹配即可。

接着，我们详细讲解了 `call`、`apply`、`bind` 三者的区别：`call` 和 `apply` 都会立即调用函数，区别在于参数传递方式（逐个 vs 数组）；而 `bind` 返回一个新函数，不会立即调用，适用于需要延迟执行的场景。

然后，我们还深入讨论了 **ES6+ 中 this 的新规则**：箭头函数使用词法 this 绑定，在定义时从外层作用域捕获 this，且不能作为构造函数使用；class 方法默认不自动绑定 this，可以通过类字段箭头函数来解决；严格模式将默认绑定的 this 从 window 改为 undefined。

最后，我们介绍了几个现代 JavaScript 的实践模式：类字段自动绑定、React 从类组件到函数组件的 this 演变，以及 `globalThis`（ES2020）作为统一全局对象引用的标准方案。

这是我们"JavaScript 执行机制"模块的最后一节了，五节下来，你应该已经发现我们将近一半的时间都是在谈 JavaScript 的各种缺陷，比如变量提升带来的问题、this 带来的问题等。我认为了解一门语言的缺陷并不是为了否定它，相反是为了能更加深入地了解它。我们在谈论缺陷的过程中，还结合 JavaScript 的工作流程分析了出现这些缺陷的原因，以及避开这些缺陷的方法。掌握了这些，相信你今后在使用 JavaScript 的过程中会更加得心应手。