---
title: "使用Promise告别回调函数"
description: "在上一篇文章中我们聊到微任务是如何工作的，并介绍了 MutationObserver 是如何利用微任务来权衡性能和效率的。今天我们就接着来聊聊任务的另外一个应用 Promise，DOM / BOM API 中新加入的 API 大多数都是建立在 Promise 上的，而且新的前端框架也使用了大量的 P..."
date: "2024-02-27"
author: "Kerwin"
tag: "Frontend"
---



> **2025 更新说明**：本文在原有内容基础上，修正了所有 "Promsie" 拼写错误为 "Promise"，新增了现代 Promise API（`Promise.allSettled()`、`Promise.any()`、`Promise.withResolvers()`）的介绍，补充了 Promise 常见反模式、未处理拒绝事件的说明，并更新了总结部分以反映 `async/await` 作为当前最佳实践的地位。

在上一篇文章中我们聊到微任务是如何工作的，并介绍了 MutationObserver 是如何利用微任务来权衡性能和效率的。今天我们就接着来聊聊任务的另外一个应用 Promise，DOM / BOM API 中新加入的 API 大多数都是建立在 Promise 上的，而且新的前端框架也使用了大量的 Promise。可以这么说，Promise 已经成为现代前端的"水"和"电"，很是关键，所以深入学习 Promise 势在必行。

不过，Promise 的知识点有那么多，而且我们只有一篇文章来介绍，那应该怎么讲解呢？具体讲解思路是怎样的呢？

如果你想要学习一门新技术，最好的方式是先了解这门技术是如何诞生的，以及它所解决的问题是什么。了解了这些后，你才能抓住这门技术的本质。所以本文我们就来重点聊聊 JavaScript 引入 Promise 的动机，以及解决问题的几个核心关键点。

要谈动机，我们一般都是先从问题切入，那么 Promise 到底解决了什么问题呢？在正式开始介绍之前，我想有必要明确下，Promise 解决的是异步编码风格的问题，而不是一些其他的问题，所以接下来我们聊的话题都是围绕着编码风格展开的。

## 异步编程的问题：代码逻辑不连续

首先我们来回顾下 JavaScript 的异步编程模型，你应该已经非常熟悉页面的事件循环系统了，也知道页面中任务都是执行在主线程之上的，相对于页面来说，主线程就是它整个的世界，所以在执行一项耗时的任务时，比如下载网络文件任务、获取摄像头等设备信息任务，这些任务都会放到页面主线程之外的进程或者线程中去执行，这样就避免了耗时任务"霸占"页面主线程的情况。你可以结合下图来看看这个处理过程：

![Web应用的异步编程模型](/images/browser/use-promise-say-goodbye-to-callbacks/async-process-model.png)

上图展示的是一个标准的异步编程模型，页面主线程发起了一个耗时的任务，并将任务交给另外一个进程去处理，这时页面主线程会继续执行消息队列中的任务。等该进程处理完这个任务后，会将该任务添加到渲染进程的消息队列中，并排队等待循环系统的处理。排队结束之后，循环系统会取出消息队列中的任务进行处理，并触发相关的回调操作。

这就是页面编程的一大特点：异步回调。

Web 页面的单线程架构决定了异步回调，而异步回调影响到了我们的编码方式，到底是如何影响的呢？

假设有一个下载的需求，使用 XMLHttpRequest 来实现，具体的实现方式你可以参考下面这段代码：

```js
// 执行状态
function onResolve(response) { console.log(response) }
function onReject(error) { console.log(error) }
 
let xhr = new XMLHttpRequest()
xhr.ontimeout = function(e) { onReject(e) }
xhr.onerror = function(e) { onReject(e) }
xhr.onreadystatechange = function() { onResolve(xhr.response) }
 
// 设置请求类型，请求 URL，是否同步信息
let URL = 'https://time.geekbang.com'
xhr.open('Get', URL, true)
 
// 设置参数
xhr.timeout = 3000 // 设置 xhr 请求的超时时间
xhr.responseType = 'text' // 设置响应返回的数据格式
xhr.setRequestHeader('X_TEST', 'time.geekbang')
 
// 发出请求
xhr.send()
```

我们执行上面这段代码，可以正常输出结果的。但是，这短短的一段代码里面竟然出现了五次回调，这么多的回调会导致代码的逻辑不连贯、不线性，非常不符合人的直觉，这就是异步回调影响到我们的编码方式。

那有什么方法可以解决这个问题呢？当然有，我们可以封装这堆凌乱的代码，降低处理异步回调的次数。

## 封装异步代码，让处理流程变得线性

由于我们重点关注的是输入内容（请求信息）和输出内容（回复信息），至于中间的异步请求过程，我们不想在代码里面体现太多，因为这会干扰核心的代码逻辑。整体思路如下图所示：

![封装请求过程](/images/browser/use-promise-say-goodbye-to-callbacks/pack-request-process.png)

从图中你可以看到，我们将 XMLHttpRequest 请求过程的代码封装起来了，重点关注输入数据和输出结果。

那我们就按照这个思路来改造代码。首先，我们把输入的 HTTP 请求信息全部保存到一个 request 的结构中，包括请求地址、请求头、请求方式、引用地址、同步请求还是异步请求、安全设置等信息。request 结构如下所示：

```js
// makeRequest 用来构造 request 对象
function makeRequest(request_url) {
  let request = {
    method: 'Get',
    url: request_url,
    headers: '',
    body: '',
    credentials: false,
    sync: true,
    responseType: 'text',
    referrer: ''
  }
  return request
}
```

然后就可以封装请求过程了，这么我们将所有的请求细节封装进 XFetch 函数，XFetch 代码如下所示：

```js
// [in] request，请求信息，请求头，延时值，返回类型等
// [out] resolve, 执行成功，回调该函数
// [out] reject  执行失败，回调该函数
function XFetch(request, resolve, reject) {
  let xhr = new XMLHttpRequest()
  xhr.ontimeout = function(e) { reject(e) }
  xhr.onerror = function(e) { reject(e) }
  xhr.onreadystatechange = function() {
    if(xhr.status = 200) resolve(xhr.response)
  }
  xhr.open(request.method, URL, request.sync)
  xhr.timeout = request.timeout
  xhr.responseType = request.responseType
  // 补充其他请求信息
  // ...
  xhr.send()
}
```

这个 XFetch 函数需要一个 request 作为输入，然后还需要两个回调函数 resolve 和 reject，当请求成功时回调 resolve 函数，当请求出现问题时回调 reject 函数。

有了这些后，我们就可以来实现业务代码了，具体地实现方式如下所示：

```js
XFetch(makeRequest('https://time.geekbang.org'),
  function resolve(data) {
    console.log(data)
  }, function reject(e) {
    console.log(e)
  })
```

## 新的问题：回调地狱

上面的示例代码已经比较符合人的线性思维了，在一些简单的场景下运行效果也是非常好的，不过一旦接触到稍微复杂点的项目时，你就会发现，如果嵌套了太多的回调函数就很容易使得自己陷入了回调地狱，不能自拔。你可以参考下面这段让人凌乱的代码：

```js
XFetch(makeRequest('https://time.geekbang.org/?category'),
  function resolve(response) {
    console.log(response)
    XFetch(makeRequest('https://time.geekbang.org/column'),
      function resolve(response) {
        console.log(response)
        XFetch(makeRequest('https://time.geekbang.org'),
          function resolve(response) {
            console.log(response)
          }, function reject(e) {
            console.log(e)
          })
      }, function reject(e) {
        console.log(e)
      })
  }, function reject(e) {
    console.log(e)
  })
```

这段代码是先请求 time.geekbang.org/?category，如果请求成功的话，那么再请求 https://time.geekbang.org/column，如果再次请求成功的话，就继续请求 time.geekbang.org。也就是说这段代码用了三层嵌套请求，就已经让代码变得混乱不堪，所以，我们还需要解决这种嵌套调用后混乱的代码结构。

这段代码之所以看上去很乱，归结其原因有两点：

- 第一是嵌套调用，下面的任务依赖上个任务的请求结果，并在上个任务的回调函数内部执行新的业务逻辑，这样当嵌套层次多了之后，代码的可读性就变得非常差了。

- 第二是任务的不确定性，执行每个任务都有两种可能的结果（成功或者失败），所以体现在代码中就需要对每个任务的执行结果做两次判断，这种对每个任务都要进行一次额外的错误处理的方式，明显增加了代码的混乱程度。

原因分析出来后，那么问题的解决思路就很清晰了：

- 第一是消灭嵌套调用。

- 第二是合并多个任务的错误处理。

这么讲可能有点抽象，不过 Promise 已经帮助我们解决了这两个问题。那么接下来我们就来看看 Promise 是怎么消灭嵌套调用和合并多个任务的错误处理的。

## Promise：消灭嵌套调用和多次错误处理

首先，我们使用 Promise 来重构 XFetch 的代码，示例代码如下所示：

```js
function XFetch(request) {
  function executor(resolve, reject) {
    let xhr = new XMLHttpRequest()
    xhr.open('GET', request.url, true)
    xhr.ontimeout = function(e) { reject(e) }
    xhr.onerror = function(e) { reject(e) }
    xhr.onreadystatechange = function() {
      if(this.readyState === 4) {
        if(this.status === 200) {
          resolve(this.responseText, this)
        } else {
          let error = {
            code: this.status,
            response: this.response
          }
          reject(error, this)
        }
      }
    }
    xhr.send()
  }
  return new Promise(executor)
}
```

接下来，我们再利用 XFetch 来构造请求流程，代码如下：

```js
var x1 = XFetch(makeRequest('https://time.geekbang.org/?category'))
var x2 = x1.then(value => {
  console.log(value)
  return XFetch(makeRequest('https://www.geekbang.org/column'))
})
var x3 = x2.then(value => {
  console.log(value)
  return XFetch(makeRequest('https://time.geekbang.org'))
})
x3.catch(error => {
  console.log(error)
})
```

你可以观察上面这两段代码，重点关注下 Promise 的使用方式。

- 首先我们引入了 Promise，在调用 XFetch 时，会返回一个 Promise 对象。

- 构建 Promise 对象时，需要传入一个 executor 函数，XFetch 的主要业务流程都在 executor 函数中执行。

- 如果运行在 executor 函数中的业务执行成功了，会调用 resolve 函数；如果执行失败了，则调用 reject 函数。

- 在 executor 函数中调用 resolve 函数时，会触发 promise.then 设置的回调函数；而调用 reject 函数时，会触发 promise.catch 设置的回调函数。

以上简单介绍了 Promise 一些主要的使用方法，通过引入 Promise，上面这段代码看起来就非常线性了，也非常符合人的直觉，是不是很酷？基于这段代码，我们就可以来分析 Promise 是如何消灭嵌套回调和合并多个错误处理了。

我们先来看看 Promise 是怎么消灭嵌套回调的。产生嵌套函数的一个主要原因是在发起请求时会带上回调函数，这样当任务处理结束之后，下个任务就只能在回调函数中来处理了。

Promise 主要通过下面两步解决嵌套回调问题的。

**首先，Promise 实现了回调函数的延时绑定**。回调函数的延时绑定在代码上体现就是先创建 Promise 对象 x1，通过 Promise 的构造函数 executor 来执行业务逻辑；创建好 Promise 对象 x1 之后，再使用 x1.then 来设置回调函数。示范代码如下：

```js
// 创建 Promise 对象 x1，并在 executor 函数中执行业务逻辑
function executor(resolve, reject) {
  resolve(100)
}
let x1 = new Promise(executor)
 
// x1 延迟绑定回调函数 onResolve
function onResolve(value) {
  console.log(value)
}
x1.then(onResolve)
```

**其次，需要将回调函数 onResolve 的返回值穿透到最外层**。因为我们会根据 onResolve 函数的传入值来决定创建什么类型的 Promise 任务，创建好的 Promise 对象需要返回到最外层，这样就可以摆脱嵌套循环了。你可以先看下面的代码：

![回调函数返回值穿透到最外层](/images/browser/use-promise-say-goodbye-to-callbacks/return-back-outer.png)

现在我们知道了 Promise 通过回调函数延迟绑定和回调函数返回值穿透的技术，解决了循环嵌套。

那接下来我们再来看看 Promise 是怎么处理异常的，你可以回顾上篇文章思考题留的那段代码，我把这段代码也贴在文中了，如下所示：

```js
function executor(resolve, reject) {
  let rand = Math.random()
  console.log(1)
  console.log(rand)
  if(rand > 0.5)
    resolve()
  else
    reject()
}
var p0 = new Promise(executor)

var p1 = p0.then((value) => {
  console.log('succeed-1')
  return new Promise(executor)
})

var p3 = p1.then((value) => {
  console.log('succeed-2')
  return new Promise(executor)
})
 
var p4 = p3.then((value) => {
  console.log('succeed-3')
  return new Promise(executor)
})
 
p4.catch((error) => {
  console.log('error')
})
console.log(2)
```

这段代码有四个 Promise 对象：p0 ~ p4。无论哪个对象里面抛出异常，都可以通过最后一个对象 p4.catch 来捕获异常，通过这种方式可以将所有 Promise 对象的错误合并到一个函数来处理，这样就解决了每个任务都需要单独处理异常的问题。

之所以可以使用最后一个对象来捕获所有异常，是因为 Promise 对象的错误具有"冒泡"性质，会一直向后传递，直到被 onReject 函数处理或 catch 语句捕获为止。具备了这样"冒泡"的特性后，就不需要在每个 Promise 对象中单独捕获异常了。至于 Promise 错误的"冒泡"性质是怎么实现的，就留给你课后思考了。

通过这种方式，我们就消灭了嵌套调用和频繁的错误处理，这样使得我们写出来的代码更加优雅，更加符合人的线性思维。

## Promise 与微任务

讲了这么多，我们似乎还没有将微任务和 Promise 关联起来，那么 Promise 和微任务的关系到底体现哪里呢？

我们结合下面这个简单的 Promise 代码来回答这个问题：

```js
function executor(resolve, reject) {
  resolve(100)
}
let demo = new Promise(executor)

function onResolve(value) {
  console.log(value)
}
demo.then(onResolve)
```

对于上面这段代码，我们需要重点关注下它的执行顺序。

首先执行 new Promise 时，Promise 的构造函数会被执行，不过由于 Promise 是 V8 引擎提供的，所以暂时看不到 Promise 构造函数的细节。

接下来，Promise 的构造函数会调用 Promise 的参数 executor 函数。然后在 executor 中执行了 resolve，resolve 函数也是在 V8 内部实现的，那么 resolve 函数到底做了什么呢？我们知道，执行 resolve 函数，会触发 demo.then 设置的回调函数 onResolve，所以可以推测，resolve 函数内部调用了通过 demo.then 设置的 onResolve 函数。

不过这里需要注意一下，由于 Promise 采用了回调函数延迟绑定技术，所以在执行 resolve 函数的时候，回调函数还没有绑定，那么只能推迟回调函数的执行。

这样按顺序陈述可能把你绕晕，下面来模拟实现一个 Promise，我们会实现它的构造函数、resolve 方法以及 then 方法，以方便你能清楚 Promise 的背后都发生了什么。这里我们就把这个对象称为 Bromise，下面就是 Bromise 的实现代码：

```js
function Bromise(executor) {
  var onResolve_ = null
  var onReject_ = null
  // 模拟实现 resolve 和 then，暂不支持 rejcet
  this.then = function(onResolve, onReject) {
    onResolve_ = onResolve
  }
  function resolve(value) {
    //setTimeout(()=>{
      onResolve_(value)
    // },0)
  }
  executor(resolve, null)
}
```

观察上面这段代码，我们实现了自己的构造函数、resolve、then 方法。接下来我们使用 Bromise 来实现我们的业务代码，实现后的代码如下所示：

```js
function executor(resolve, reject) {
  resolve(100)
}
// 将 Promise 改成我们自己的 Bromsie
let demo = new Bromise(executor)

function onResolve(value) {
  console.log(value)
}
demo.then(onResolve)
```

执行这段代码，我们发现执行出错，输出的内容是：

```js
Uncaught TypeError: onResolve_ is not a function
  at resolve (<anonymous>:10:13)
  at executor (<anonymous>:17:5)
  at new Bromise (<anonymous>:13:5)
  at <anonymous>:19:12
```

之所以出现这个错误，是由于 Bromise 的延迟绑定导致的，在调用到 onResolve_ 函数的时候，Bromise.then 还没有执行，所以执行上诉代码的时候，当然会报"onResolve_ is not a function"的错误了。

也正是因为如此，我们要改造 Bromise 中的 resolve 方法，让 resolve 延迟调用 onResolve_。

要让 resolve 中的 onResolve_ 函数延后执行，可以在 resolve 函数里面加上一个定时器，让其延时执行 onResolve_ 函数，你可以参考下面改造后的代码：

```js
function resolve(value) {
  setTimeout(() => {
    onResolve_(value)
  }, 0)
}
```

上面采用了定时器来推迟 onResolve_ 的执行，不过使用定时器的效率并不是太高，好在我们有微任务，所以 Promise 又把这个定时器改造成了微任务了，这样既可以让 onResolve_ 延时被调用，又提升了代码的执行效率。这就是 Promise 中使用微任务的原由了。

## 现代 Promise API（2025 补充）

随着 ECMAScript 标准的持续演进，Promise 家族新增了几个非常实用的静态方法，它们极大地丰富了并发控制和错误处理的能力。

### Promise.allSettled()（ES2020）

`Promise.all()` 在任意一个 Promise 被 reject 时就会立即短路并返回错误，但在很多场景下我们希望**等待所有 Promise 完成**，无论它们是成功还是失败。`Promise.allSettled()` 正是为此而生：

```js
const promises = [
  fetch('/api/user'),
  fetch('/api/posts'),
  fetch('/api/comments')
]

const results = await Promise.allSettled(promises)

results.forEach((result, index) => {
  if (result.status === 'fulfilled') {
    console.log(`请求 ${index} 成功:`, result.value)
  } else {
    console.log(`请求 ${index} 失败:`, result.reason)
  }
})
```

每个结果对象都有一个 `status` 属性（值为 `'fulfilled'` 或 `'rejected'`），以及对应的 `value`（成功时）或 `reason`（失败时）。这对于批量请求且需要单独处理每个结果的场景非常有用。

### Promise.any()（ES2021）

`Promise.any()` 接收一组 Promise，返回**第一个成功（fulfilled）的结果**。只有当所有 Promise 都失败时，才会 reject 并返回一个 `AggregateError`：

```js
// 从多个 CDN 中获取资源，哪个最快用哪个
const resource = await Promise.any([
  fetch('https://cdn1.example.com/data.json'),
  fetch('https://cdn2.example.com/data.json'),
  fetch('https://cdn3.example.com/data.json')
])

console.log('最快返回的结果:', resource)
```

```js
// 所有都失败时的处理
try {
  await Promise.any([
    Promise.reject('错误1'),
    Promise.reject('错误2')
  ])
} catch (err) {
  console.log(err instanceof AggregateError) // true
  console.log(err.errors) // ['错误1', '错误2']
}
```

`Promise.any()` 与 `Promise.race()` 的区别在于：`race()` 返回第一个 settled（无论成功或失败）的结果，而 `any()` 只关心第一个成功的结果。

### Promise.withResolvers()（ES2025）

`Promise.withResolvers()` 是 ES2025 新增的一个便捷方法，它创建一个 Promise 并同时返回其 `resolve` 和 `reject` 函数，省去了在 executor 中进行引用传递的样板代码：

```js
// 传统写法
let resolve, reject
const promise = new Promise((res, rej) => {
  resolve = res
  reject = rej
})

// 使用 Promise.withResolvers()（ES2025）
const { promise, resolve, reject } = Promise.withResolvers()

// resolve 和 reject 可以在任何地方调用
setTimeout(() => resolve('延迟完成'), 1000)

promise.then(value => console.log(value)) // '延迟完成'
```

这个方法在需要将 Promise 的控制权暴露到外部的场景下特别有用，比如自定义事件系统、延迟加载控制等。

### Promise 静态方法一览

| 方法 | 行为 | 适用场景 |
| --- | --- | --- |
| `Promise.all()` | 全部成功才成功，一个失败就失败 | 所有请求都必须成功 |
| `Promise.allSettled()` | 等待全部完成，收集所有结果 | 批量请求，独立处理每个结果 |
| `Promise.race()` | 返回第一个完成的（无论成败） | 超时控制、竞争请求 |
| `Promise.any()` | 返回第一个成功的 | 冗余请求、最快可用源 |
| `Promise.withResolvers()` | 创建可外部控制的 Promise | 延迟初始化、事件桥接 |

## Promise 反模式与最佳实践（2025 补充）

在日常开发中，有一些常见的 Promise 使用误区值得特别注意。了解这些反模式可以帮助你写出更健壮的异步代码。

### 反模式一：Promise 构造函数反模式

**将已有的 Promise 包装在新的 Promise 构造函数中**是最常见的反模式之一：

```js
// ❌ 反模式：不必要地包装 Promise
function fetchData(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(err => reject(err))
  })
}

// ✅ 正确做法：直接返回 Promise 链
function fetchData(url) {
  return fetch(url).then(response => response.json())
}
```

`fetch()` 本身就返回一个 Promise，没有必要再用 `new Promise()` 包装一层。多余的包装不仅增加了代码复杂度，还可能导致错误处理遗漏。

### 反模式二：忘记处理 Promise 拒绝

未处理的 Promise 拒绝（Unhandled Rejection）是一个常被忽视但非常严重的问题：

```js
// ❌ 危险：没有 catch，拒绝会被吞掉
async function loadData() {
  const data = await fetch('/api/data')
  return data.json()
}
loadData() // 如果请求失败，错误不会被捕获

// ✅ 正确做法：始终处理错误
loadData().catch(err => console.error('加载失败:', err))

// ✅ 或者使用 try/catch
async function loadData() {
  try {
    const response = await fetch('/api/data')
    return await response.json()
  } catch (err) {
    console.error('加载失败:', err)
    // 根据业务需求决定是否重新抛出
    throw err
  }
}
```

### 反模式三：循环中的 await（串行 vs 并行）

在循环中使用 `await` 会导致请求串行执行，大大降低性能：

```js
// ❌ 串行执行：每个请求都等上一个完成才发起
async function fetchAllUsers(ids) {
  const users = []
  for (const id of ids) {
    const user = await fetch(`/api/user/${id}`)  // 串行！
    users.push(await user.json())
  }
  return users
}

// ✅ 并行执行：所有请求同时发起
async function fetchAllUsers(ids) {
  const promises = ids.map(id =>
    fetch(`/api/user/${id}`).then(res => res.json())
  )
  return Promise.all(promises)  // 并行！
}
```

如果有 10 个请求，每个需要 100ms，串行执行需要约 1000ms，而并行执行只需要约 100ms。差距在请求数量越多时越明显。

当然，如果请求之间有依赖关系（后一个请求需要前一个的结果），那么串行是必要的。关键在于有意识地选择而非无意中写成串行。

## 未处理拒绝的全局捕获（2025 补充）

浏览器提供了两个全局事件来帮助你捕获那些"漏网之鱼"——未被处理的 Promise 拒绝：

### `unhandledrejection` 事件

当一个 Promise 被拒绝且没有 reject 处理器时触发：

```js
window.addEventListener('unhandledrejection', (event) => {
  console.warn('未处理的 Promise 拒绝:', event.reason)
  // 上报错误到监控系统
  reportError({
    type: 'unhandledRejection',
    message: event.reason?.message || String(event.reason),
    stack: event.reason?.stack
  })
  // 可选：阻止默认行为（阻止控制台报错）
  // event.preventDefault()
})
```

### `rejectionhandled` 事件

当一个之前未处理的 Promise 拒绝后来又被处理了时触发：

```js
window.addEventListener('rejectionhandled', (event) => {
  console.log('之前未处理的拒绝现在已被处理:', event.reason)
})
```

这两个事件组合使用，可以构建一个完整的 Promise 错误追踪系统：

```js
// 追踪未处理的拒绝
const unhandledRejections = new Map()

window.addEventListener('unhandledrejection', (event) => {
  unhandledRejections.set(event.promise, event.reason)
})

window.addEventListener('rejectionhandled', (event) => {
  unhandledRejections.delete(event.promise)
})

// 定期检查是否有长期未处理的拒绝
setInterval(() => {
  if (unhandledRejections.size > 0) {
    console.warn(`当前有 ${unhandledRejections.size} 个未处理的 Promise 拒绝`)
  }
}, 5000)
```

> **注意**：在 Node.js 环境中，对应的事件名分别是 `process.on('unhandledRejection')` 和 `process.on('rejectionHandled')`。

## 总结

好了，今天我们就聊到这里，下面我来总结下今天所讲的内容。

首先，我们回顾了 Web 页面是单线程架构模型，这种模型决定了我们编写代码的形式——异步编程。基于异步编程模型写出来的代码会把一些关键的逻辑点打乱，所以这种风格的代码不符合人的线性思维方式。接下来我们试着把一些不必要的回调接口封装起来，简单封装取得了一定的效果，不过，在稍微复杂点的场景下依然存在着回调地狱的问题。然后我们分析了产生回调地狱的原因：

- 多层嵌套的问题。

- 每种任务的处理结果存在两种可能性（成功或失败），那么需要在每种任务执行结束后分别处理这两种可能性。

Promise 通过回调函数延迟绑定、回调函数返回值穿透和错误"冒泡"技术解决了上面的两个问题。

最后，我们还分析了 Promise 之所以要使用微任务是由 Promise 回调函数延迟绑定技术导致的。

> **2025 最佳实践总结**：
>
> 1. **优先使用 `async/await`**：虽然 `.then()` 链式调用是 Promise 的基础用法，但在实际开发中，`async/await` 语法让异步代码读起来更像同步代码，可读性和可维护性更高。两者本质上是等价的，`async/await` 只是 Promise 的语法糖。
>
> 2. **善用新的静态方法**：`Promise.allSettled()` 和 `Promise.any()` 为并发控制提供了更精细的选择，`Promise.withResolvers()` 简化了需要外部控制 Promise 的场景。
>
> 3. **始终处理错误**：每个 Promise 链都应该有 `.catch()` 或被 `try/catch` 包裹。配合 `unhandledrejection` 事件做全局兜底，确保没有错误被静默吞掉。
>
> 4. **避免反模式**：不要包装已有的 Promise，注意区分串行和并行执行的场景，选择合适的并发策略。
>
> 5. **理解微任务机制**：Promise 回调通过微任务执行，这意味着它们的优先级高于宏任务（如 setTimeout）。理解这一点对于写出正确的异步代码至关重要。