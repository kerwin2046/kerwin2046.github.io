---
title: "页面性能：如何系统优化页面"
description: "在前面几篇文章中，我们分析了页面加载和 DOM 生成，讨论了 JavaScript 和 CSS 是如何影响到 DOM 生成的，还结合渲染流水线来讲解了分层和合成机制，同时在这些文章里面，我们还穿插说明了很多优化页面性能的最佳实践策略。通过这些知识点的学习，相信你已经知道渲染引擎是怎么绘制出帧的，不过..."
date: "2024-03-17"
author: "Kerwin"
tag: "Frontend"
---



> **2025 更新说明**：本文在原有内容基础上，新增了 Core Web Vitals（核心 Web 指标）框架——包括 LCP、INP（2024 年正式替代 FID）和 CLS 三大指标的说明；修正了布局抖动示例中的代码错误；补充了 HTTP/2 和 HTTP/3 对网络优化的影响；介绍了 `content-visibility`、CSS `contain`、Intersection Observer、`scheduler.yield()` 等现代 API；并说明了 TCP 初始拥塞窗口（14KB）对关键资源内联策略的意义。

在前面几篇文章中，我们分析了页面加载和 DOM 生成，讨论了 JavaScript 和 CSS 是如何影响到 DOM 生成的，还结合渲染流水线来讲解了分层和合成机制，同时在这些文章里面，我们还穿插说明了很多优化页面性能的最佳实践策略。通过这些知识点的学习，相信你已经知道渲染引擎是怎么绘制出帧的，不过之前我们介绍的内容比较零碎、比较散，那么今天我们就来将这些内容系统性地串起来。

那么怎么才能把这些知识点串起来呢？我的思路是从如何系统优化页面速度的角度来切入。

这里我们所谈论的页面优化，其实就是要让页面更快地显示和响应。由于一个页面在它不同的阶段，所侧重的关注点是不一样的，所以如果我们要讨论页面优化，就要分析一个页面生存周期的不同阶段。

**通常一个页面有三个阶段：加载阶段、交互阶段和关闭阶段**

- 加载阶段，是指从发出请求到渲染出完整页面的过程，影响到这个阶段的主要因素有网络和 JavaScript 脚本。

- 交互阶段，主要是从页面加载完成到用户交互的整个过程，影响到这个阶段的主要因素是 JavaScript 脚本。

- 关闭阶段，主要是用户发出关闭指令后页面所做的一些清理操作。

这里我们需要重点关注加载阶段和交互阶段，因为影响到我们体验的因素主要都在这两个阶段，下面我们就来逐个详细分析下。

## Core Web Vitals：现代性能度量框架

在深入具体优化策略之前，我们需要了解 Google 提出的 **Core Web Vitals（核心 Web 指标）** 框架。这套指标不仅是 Google 搜索排名的参考因素，更是系统化衡量页面性能的标准：

### LCP（Largest Contentful Paint，最大内容绘制）

- **衡量对象**：加载阶段——用户看到页面主要内容的速度
- **良好标准**：≤ 2.5 秒
- **影响因素**：服务器响应时间、CSS 和字体加载、关键资源的大小和数量、客户端渲染阻塞

### INP（Interaction to Next Paint，交互到下一次绘制）

- **衡量对象**：交互阶段——用户操作后页面响应的速度
- **良好标准**：≤ 200 毫秒
- **影响因素**：JavaScript 执行时间、事件处理器复杂度、主线程阻塞时间
- **重要说明**：INP 在 **2024 年 3 月正式替代了 FID（First Input Delay）** 成为 Core Web Vitals 的交互性指标。与 FID 只衡量首次交互的输入延迟不同，INP 衡量整个页面生命周期中所有交互的响应性，取其中最差的那次（P98）。这意味着即使首次交互很快，后续交互的卡顿也会导致 INP 评分不佳。

### CLS（Cumulative Layout Shift，累积布局偏移）

- **衡量对象**：视觉稳定性——页面内容是否会意外跳动
- **良好标准**：≤ 0.1
- **影响因素**：未指定尺寸的图片/广告/嵌入内容、动态注入的 DOM 内容、Web 字体加载导致的 FOIT/FOUT

Core Web Vitals 提供了一个系统化的性能评估框架，我们后面的优化策略都可以与这三个指标对应起来。

## 加载阶段

我们先来分析如何系统优化加载阶段中的页面，还是先看一个典型的渲染流水线，如下图所示：

![加载阶段渲染流水线](/images/browser/page-performance-how-to-optimize-systematically/load-stage-render-process.png)

观察上面这个渲染流水线，你能分析出来有哪些因素影响了页面加载速度吗？下面我们就来分析下这个问题。

通过前面文章的讲解，你应该已经知道了并非所有的资源都会阻塞页面的首次绘制，比如图片、音频、视频等文件就不会阻塞页面的首次渲染；而 JavaScript、首次请求的 HTML 资源文件、CSS 文件是会阻塞首次渲染的，因为在构建 DOM 的过程中需要 HTML 和 JavaScript 文件，在构造渲染树的过程中需要用到 CSS 文件。

我们把这些能阻塞网页首次渲染的资源称为关键资源。基于关键资源，我们可以继续细化出来三个影响页面首次渲染的核心因素。

**第一个是关键资源个数。关键资源个数越多，首次页面的加载时间就会越长**。比如上图中的关键资源个数就是 3 个，1 个 HTML 文件、1 个 JavaScript 和 1 个 CSS 文件。

**第二个是关键资源大小**。通常情况下，所有关键资源的内容越小，其整个资源的下载时间也就越短，那么阻塞渲染的时间也就越短。上图中关键资源的大小分别是 6KB、8KB 和 9KB，那么整个关键资源大小就是 23KB。

**第三个是请求关键资源需要多少个 RTT（Round Trip Time）**。那什么是 RTT 呢？在《02 | TCP 协议：如何保证页面文件能被完整送达浏览器？》这篇文章中我们分析过，当使用 TCP 协议传输一个文件时，比如这个文件大小是 0.1M，由于 TCP 的特性，这个数据并不是一次传输到服务端的，而是需要拆分成一个个数据包来回多次进行传输的。RTT 就是这里的往返时延。它是网络中一个重要的性能指标，表示从发送端发送数据开始，到发送端收到来自接收端的确认，总共经历的时延。通常 1 个 HTTP 的数据包在 14KB 左右，所以 1 个 0.1M 的页面就需要拆分为 8 个包来传输了，也就是说需要 8 个 RTT。

> **为什么是 14KB？** 这里需要特别说明，14KB 并不是一个任意选择的数字。它源自 TCP 的**初始拥塞窗口（Initial Congestion Window, initcwnd）**——这是 TCP 连接建立后（三次握手完成），服务器在第一个 RTT 内能发送的最大数据量。Linux 内核从 2.6.39 版本开始，默认的初始拥塞窗口大约是 10 个 TCP 段（约 14KB）。
>
> 这意味着**一个新的 TCP 连接在第一个 RTT 内最多只能传输约 14KB 的数据**。超过 14KB 的部分需要额外的 RTT 才能送达。这对前端性能优化有直接的指导意义：
>
> - **关键 CSS 内联**：如果将首屏渲染所需的关键 CSS 内联到 HTML 中，且总的 HTML 大小控制在 14KB 以内（压缩后），那么浏览器仅需 1 个 RTT 就能获得开始渲染所需的全部信息。
> - **关键 JavaScript 内联**：同理，将关键的内联脚本控制在 14KB 窗口之内，可以避免额外的 RTT。
> - **HTTP/2 和 HTTP/3 的多路复用**不会改变这一限制——初始拥塞窗口仍然是单个 TCP/QUIC 连接的物理约束。

我们可以结合上图来看看它的关键资源请求需要多少个 RTT。首先是请求 HTML 资源，大小是 6KB，小于 14KB，所以 1 个 RTT 就可以解决了。至于 JavaScript 和 CSS 文件，这里需要注意一点，由于渲染引擎有一个预解析的线程，在接收到 HTML 数据之后，预解析线程会快速扫描 HTML 数据中的关键资源，一旦扫描到了，会立马发起请求，你可以认为 JavaScript 和 CSS 是同时发起请求的，所以它们的请求是重叠的，那么计算它们的 RTT 时，只需要计算体积最大的那个数据就可以了。这里最大的是 CSS 文件（9KB），所以我们就按照 9KB 来计算，同样由于 9KB 小于 14KB，所以 JavaScript 和 CSS 资源也就可以算成 1 个 RTT。也就是说，上图中关键资源请求共花费了 2 个 RTT。

了解了影响加载过程中的几个核心因素之后，接下来我们就可以系统性地考虑优化方案了。**总的优化原则就是减少关键资源个数，降低关键资源大小，降低关键资源的 RTT 次数**

- 如何减少关键资源的个数？一种方式是可以将 JavaScript 和 CSS 改成内联的形式，比如上图的 JavaScript 和 CSS，若都改成内联模式，那么关键资源的个数就由 3 个减少到了 1 个。另一种方式，如果 JavaScript 代码没有 DOM 或者 CSSOM 的操作，则可以改成 async 或者 defer 属性；同样对于 CSS，如果不是在构建页面之前加载的，则可以添加媒体取消阻止显现的标志。当 JavaScript 标签加上了 async 或者 defer、CSSlink 属性之前加上了取消阻止显现的标志后，它们就变成了非关键资源了。

- 如何减少关键资源的大小？可以压缩 CSS 和 JavaScript 资源，移除 HTML、CSS、JavaScript 文件中一些注释内容，也可以通过前面讲的取消 CSS 或者 JavaScript 中关键资源的方式。

- 如何减少关键资源 RTT 的次数？可以通过减少关键资源的个数和减少关键资源的大小搭配来实现。除此之外，还可以使用 CDN 来减少每次 RTT 时长。

### 网络协议优化：HTTP/2 和 HTTP/3

在优化实际的页面加载速度时，除了关注资源本身，还需要关注**网络传输协议**。现代 Web 已经从 HTTP/1.1 全面过渡到 HTTP/2 和 HTTP/3，这对性能优化策略有重要影响：

**HTTP/2 的关键改进：**
- **多路复用（Multiplexing）**：在同一个 TCP 连接上可以同时传输多个请求和响应，不再有 HTTP/1.1 时代的"队头阻塞"问题。这意味着**域名分片（Domain Sharding）不再必要**，反而可能有害——它会阻止连接复用，增加 DNS 查询和 TCP/TLS 握手开销。
- **头部压缩（HPACK）**：压缩 HTTP 头部，减少重复传输的元数据开销。
- **服务端推送（Server Push）**：服务器可以主动推送客户端可能需要的资源（不过在实践中效果有限，已在 Chrome 106 中被移除，推荐使用 103 Early Hints 替代）。

**HTTP/3（基于 QUIC）的进一步改进：**
- **消除 TCP 队头阻塞**：QUIC 基于 UDP，每个流独立传输，一个流的丢包不会影响其他流。
- **更快的连接建立**：QUIC 将 TLS 握手集成到连接建立过程中，首次连接只需 1-RTT，重连可以做到 0-RTT。
- **连接迁移**：当用户从 Wi-Fi 切换到移动网络时，QUIC 连接可以无缝迁移，不需要重新建立。

**对优化策略的影响：**
- 在 HTTP/2+ 环境下，**不再需要合并小文件**（如 CSS Sprites、JS 打包成单一大文件），因为多路复用可以高效处理多个小请求。
- **不再需要域名分片**，反而应该减少域名数量以复用连接。
- **资源内联策略需要重新评估**——HTTP/2 下外部资源可以被缓存复用，而内联资源每次都要重新传输。但如前所述，14KB 初始窗口的限制依然存在，所以对于首屏关键 CSS 的内联仍然有意义。

在优化实际的页面加载速度时，你可以先画出优化之前关键资源的图表，然后按照上面优化关键资源的原则去优化，优化完成之后再画出优化之后的关键资源图表。

## 交互阶段

接下来我们再来聊聊页面加载完成之后的交互阶段以及应该如何去优化。谈交互阶段的优化，其实就是在谈渲染进程渲染帧的速度，因为在交互阶段，帧的渲染速度决定了交互的流畅度。因此讨论页面优化实际上就是讨论渲染引擎是如何渲染帧的，否则就无法优化帧率。

> **在 Core Web Vitals 框架中，交互阶段的核心指标是 INP（Interaction to Next Paint）**。INP 衡量的是从用户交互（点击、键入、触摸）到浏览器呈现下一帧视觉反馈之间的延迟。一次交互的延迟包括三部分：输入延迟（主线程被其他任务占用的等待时间）、处理时间（事件处理器的执行时间）和呈现延迟（渲染流水线完成的时间）。

我们先来看看交互阶段的渲染流水线（如下图）。和加载阶段的渲染流水线有一些不同的地方是，在交互阶段没有了加载关键资源和构建 DOM、CSSOM 流程，通常是由 JavaScript 触发交互动画的。

![交互阶段渲染流水线](/images/browser/page-performance-how-to-optimize-systematically/interaction-stage-render-process.png)

结合上图，我们来一起回顾下交互阶段是如何生成一个帧的。大部分情况下，生成一个新的帧都是由 JavaScript 通过修改 DOM 或者 CSSOM 来触发的。还有另外一部分帧是由 CSS 来触发的。

如果在计算样式阶段发现有布局信息的修改，那么就会触发重排操作，然后触发后续渲染流水线的一系列操作，这个代价是非常大的。

同样如果在计算样式阶段没有发现有布局信息的修改，只是修改了颜色一类的信息，那么就不会涉及到布局相关的调整，所以可以跳过布局阶段，直接进入绘制阶段，这个过程叫重绘。不过重绘阶段的代价也是不小的。

还有另外一种情况，通过 CSS 实现一些变形、渐变、动画等特效，这是由 CSS 触发的，并且是在合成线程上执行的，这个过程称为合成。因为它不会触发重排或者重绘，而且合成操作本身的速度就非常快，所以执行合成是效率最高的方式。

回顾了在交互过程中的帧是如何生成的，那接下来我们就可以讨论优化方案了。一个大的原则就是让单个帧的生成速度变快。所以，下面我们就来分析下在交互阶段渲染流水线中有哪些因素影响了帧的生成速度以及如何去优化。

### 1.减少 JavaScript 脚本执行时间

有时 JavaScript 函数的一次执行时间可能有几百毫秒，这就严重霸占了主线程执行其他渲染任务的时间。针对这种情况我们可以采用以下两种策略。

- 一种是将一次执行的函数分解为多个任务，使得每次的执行时间不要过久。

- 另一种是采用 Web Workers。你可以把 Web Workers 当作主线程之外的一个线程，在 Web Workers 中是可以执行 JavaScript 脚本的，不过 Web Workers 中没有 DOM、CSSOM 环境，这意味着在 Web Workers 中是无法通过 JavaScript 来访问 DOM 的，所以我们可以把一些和 DOM 操作无关且耗时的任务放到 Web Workers 中去执行。

#### `scheduler.yield()`：现代任务拆分方案

在传统方案中，将长任务拆分为多个小任务通常需要借助 `setTimeout(fn, 0)` 或 `requestIdleCallback` 来实现"让出主线程"。但这些方案有一个问题：被拆分的后续任务会被放入宏任务队列的末尾，可能被其他低优先级任务插队，导致不必要的延迟。

**`scheduler.yield()`** 是一种专门为此设计的新 API（Chrome 129 开始支持）：

```js
async function processLargeList(items) {
  for (let i = 0; i < items.length; i++) {
    processItem(items[i]);
    
    // 每处理 50 个项目后让出主线程
    if (i % 50 === 0) {
      await scheduler.yield();
    }
  }
}
```

与 `setTimeout` 不同，`scheduler.yield()` 会将后续任务放在队列的**前面**（而非末尾），确保在让出主线程处理紧急任务（如用户输入）后能尽快恢复执行。这对优化 INP 指标尤其有效——它既能保证长任务不会阻塞用户交互，又不会因为任务调度延迟而拖慢整体执行速度。

总之，在交互阶段，对 JavaScript 脚本总的原则就是不要一次霸占太久主线程。

### 2.避免强制同步布局

在介绍强制同步布局之前，我们先来聊聊正常情况下的布局操作。通过 DOM 接口执行添加元素或者删除元素等操作后，是需要重新计算样式和布局的，不过正常情况下这些操作都是在另外的任务中异步完成的，这样做是为了避免当前的任务占用太长的主线程时间。为了直观理解，你可以参考下面的代码：

```html
<html>
  <body>
    <div id="mian_div">
      <li id="time_li">time</li>
      <li>geekbang</li>
    </div>

    <p id="demo">强制布局 demo</p>
    <button onclick="foo()">添加新元素</button>

    <script>
      function foo() {
        let main_div = document.getElementById('mian_div')      
        let new_node = document.createElement('li')
        let textnode = document.createTextNode('time.geekbang')
        new_node.appendChild(textnode)
        document.getElementById('mian_div').appendChild(new_node)
      }
    </script>
  </body>
</html>
```

对于上面这段代码，我们可以使用 Performance 工具来记录添加元素的过程，如下图所示：

![performance记录添加元素的执行过程](/images/browser/page-performance-how-to-optimize-systematically/performance-log-process.png)

从图中可以看出来，执行 JavaScript 添加元素是在一个任务中执行的，重新计算样式布局是在另外一个任务中执行，这就是正常情况下的布局操作。

理解了正常情况下的布局操作，接下来我们就可以聊什么是强制同步布局了。

所谓强制同步布局，是指 JavaScript 强制将计算样式和布局操作提前到当前的任务中。为了直观理解，这里我们对上面的代码做了一点修改，让它变成强制同步布局，修改后的代码如下所示：

```js
function foo() {
  let main_div = document.getElementById('mian_div')
  let new_node = document.createElement('li')
  let textnode = document.createTextNode('time.geekbang')
  new_node.appendChild(textnode)
  document.getElementById('mian_div').appendChild(new_node)
  // 由于要获取到 offsetHeight，
  // 但是此时的 offsetHeight 还是老的数据，
  // 所以需要立即执行布局操作
  console.log(main_div.offsetHeight)
}
```

将新的元素添加到 DOM 之后，我们又调用了 main_div.offsetHeight 来获取新 main_div 的高度信息。如果要获取到 main_div 的高度，就需要重新布局，所以这里在获取到 main_div 的高度之前，JavaScript 还需要强制让渲染引擎默认执行一次布局操作。我们把这个操作称为强制同步布局。

同样，你可以看下面通过 Performance 记录的任务状态：

![触发强制同步布局performance图](/images/browser/page-performance-how-to-optimize-systematically/recalculate-style-performance.png)

从上图可以看出来，计算样式和布局都是在当前脚本执行过程中触发的，这就是强制同步布局。

为了避免强制同步布局，我们可以调整策略，在修改 DOM 之前查询相关值。代码如下所示：

```js
function foo() {
  let main_div = document.getElementById('mian_div')
  // 为了避免强制同步布局，在修改 DOM 之前查询相关值
  console.log(main_div.offsetHeight)
  let new_node = document.createElement('li')
  let textnode = document.createTextNode('time.geekbang')
  new_node.appendChild(textnode)
  document.getElementById('mian_div').appendChild(new_node)
}
```

### 3.避免布局抖动

还有一种比强制同步布局更坏的情况，那就是布局抖动。所谓布局抖动，是指在一次 JavaScript 执行过程中，多次执行强制布局和抖动操作。为了直观理解，你可以看下面的代码：

```js
function foo() {
  let time_li = document.getElementById('time_li')
  for (let i = 0; i < 100; i++) {
    let main_div = document.getElementById('mian_div')
    let new_node = document.createElement('li')
    let textnode = document.createTextNode('time.geekbang')
    new_node.appendChild(textnode)
    document.getElementById('mian_div').appendChild(new_node)
    // 注意：这里是读取 offsetHeight（只读属性），不是赋值
    // 每次读取都会触发强制同步布局，因为前面刚修改了 DOM
    console.log(time_li.offsetHeight)
  }
}
```

> **勘误说明**：原文中这段代码写的是 `new_node.offsetHeight = time_li.offsetHeight`，这里需要澄清：`offsetHeight` 是一个**只读属性**，不能通过赋值来修改。原文想表达的布局抖动问题的本质是：在循环中交替进行"写 DOM"（appendChild）和"读布局属性"（offsetHeight）操作。每次读取布局属性时，由于前面刚修改了 DOM，浏览器必须立即执行同步布局来返回最新的值，这就是布局抖动（Layout Thrashing）。修正后的代码更准确地体现了这一问题。

我们在一个 for 循环语句里面不断修改 DOM 后又读取布局属性值，每次读取属性值之前都要进行计算样式和布局。执行代码之后，使用 Performance 记录的状态如下所示：

![performance中关于布局抖动的表现](/images/browser/page-performance-how-to-optimize-systematically/layout-shake-performance.png)

从上图可以看出，在 foo 函数内部重复执行计算样式和布局，这会大大影响当前函数的执行效率。这种情况的避免方式和强制同步布局一样，都是尽量不要在修改 DOM 结构时再去查询一些相关值。

**优化策略**：将读取操作集中在修改操作之前，或者使用变量缓存读取的值：

```js
function foo() {
  let time_li = document.getElementById('time_li')
  let main_div = document.getElementById('mian_div')
  // 先读取需要的布局值
  const cachedHeight = time_li.offsetHeight
  
  for (let i = 0; i < 100; i++) {
    let new_node = document.createElement('li')
    let textnode = document.createTextNode('time.geekbang')
    new_node.appendChild(textnode)
    // 使用缓存的值，避免在循环中触发强制同步布局
    new_node.style.height = cachedHeight + 'px'
    main_div.appendChild(new_node)
  }
}
```

### 4.合理利用 CSS 合成动画

合成动画是直接在合成线程上执行的，这和在主线程上执行的布局、绘制等操作不同，如果主线程被 JavaScript 或者一些布局任务占用，CSS 动画依然能继续执行。所以要尽量利用好 CSS 合成动画，如果能让 CSS 处理动画，就尽量交给 CSS 来操作。

另外，如果能提前知道对某个元素执行动画操作，那就最好将其标记为 will-change，这是告诉渲染引擎需要将该元素单独生成一个图层。

### 5.避免频繁的垃圾回收

我们知道 JavaScript 使用了自动垃圾回收机制，如果在一些函数中频繁创建临时对象，那么垃圾回收器也会频繁地去执行垃圾回收策略。这样当垃圾回收操作发生时，就会占用主线程，从而影响到其他任务的执行，严重的话还会让用户产生掉帧、不流畅的感觉。

所以要尽量避免产生那些临时垃圾数据。那该怎么做呢？可以尽可能优化储存结构，尽可能避免小颗粒对象的产生。

### 6.现代渲染优化 API（2025 补充）

除了上述经典策略之外，现代浏览器还提供了一系列强大的优化 API：

#### `content-visibility` 和 CSS `contain`

`content-visibility: auto` 可以让浏览器跳过屏幕外元素的渲染工作，显著减少每帧的渲染开销：

```css
/* 对于长列表中的每个项目 */
.list-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px;
}

/* 对于独立的卡片组件 */
.card {
  contain: layout style paint;
}
```

- `content-visibility: auto`：元素不在视口内时，跳过其布局和绘制
- `contain: layout`：声明元素的内部布局不影响外部
- `contain: style`：声明元素的样式计数器等不影响外部
- `contain: paint`：声明元素的内容不会绘制到边界外

这些属性能有效减少重排和重绘的范围，从"牵一发动全身"变为"局部更新"。

#### Intersection Observer：高效的懒加载

`Intersection Observer` 可以高效地监听元素是否进入视口，替代传统的 `scroll` 事件监听 + `getBoundingClientRect()` 方案（后者会触发强制同步布局）：

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // 元素进入视口，开始加载图片
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
}, {
  rootMargin: '200px' // 提前 200px 开始加载
});

// 观察所有需要懒加载的图片
document.querySelectorAll('img[data-src]').forEach(img => {
  observer.observe(img);
});
```

Intersection Observer 的关键优势是它**不在主线程上执行**（回调除外），不会在滚动时造成性能问题。浏览器还为原生的 `<img loading="lazy">` 内部使用了类似机制。

#### 优化 CLS：避免布局偏移

为了优化 CLS 指标，以下是一些实用策略：

```html
<!-- 始终为图片和视频指定尺寸 -->
<img src="hero.jpg" width="800" height="400" alt="...">

<!-- 使用 aspect-ratio 为响应式元素保留空间 -->
<style>
.video-container {
  aspect-ratio: 16 / 9;
  width: 100%;
}
</style>

<!-- 字体加载策略：避免 FOIT/FOUT -->
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
<style>
@font-face {
  font-family: 'MyFont';
  src: url('font.woff2') format('woff2');
  font-display: optional; /* 如果字体未及时加载，使用后备字体，不切换 */
}
</style>
```

## 总结

好了，今天就介绍到这里，下面我来总结下本文的主要内容。

我们主要讲解了如何系统优化加载阶段和交互阶段的页面。

在加载阶段，核心的优化原则是：优化关键资源的加载速度，减少关键资源的个数，降低关键资源的 RTT 次数。14KB 的 TCP 初始拥塞窗口是内联关键资源的重要参考阈值。在 HTTP/2 和 HTTP/3 时代，域名分片和资源合并不再必要，多路复用和更快的连接建立带来了新的优化思路。

在交互阶段，核心的优化原则是：尽量减少一帧的生成时间。可以通过减少单次 JavaScript 的执行时间、使用 `scheduler.yield()` 拆分长任务、避免强制同步布局、避免布局抖动、尽量采用 CSS 的合成动画、使用 `content-visibility` 和 `contain` 限制渲染范围、使用 Intersection Observer 实现高效懒加载、避免频繁的垃圾回收等方式来减少一帧生成的时长，优化 INP 指标。

在 Core Web Vitals 框架下，LCP 对应加载阶段优化，INP 对应交互阶段优化，CLS 贯穿整个页面生命周期。掌握这三个指标的优化方法，就能系统性地提升页面性能和用户体验。