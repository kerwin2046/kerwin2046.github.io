---
title: "跨站脚本攻击XSS：为什么cookie中有httpOnly属性"
description: "通过上篇文章的介绍，我们知道了同源策略可以隔离各个站点之间的 DOM 交互、页面数据和网络通信，虽然严格的同源策略会带来更多的安全，但是也束缚了 Web。这就需要在安全和自由之间找到一个平衡点，所以我们默认页面中可以引用任意第三方资源，然后又引入 CSP 策略来加以限制；默认 XMLHttpRequ..."
date: "2024-04-13"
author: "Kerwin"
tag: "DevOps"
---



> **2025 更新说明**：本文最初编写于浏览器安全快速演进之前。近年来，浏览器在 XSS 防御方面取得了重大进展，包括 Trusted Types API、现代前端框架的自动转义机制、Sanitizer API，以及更成熟的 CSP 策略（如 `nonce-*`、`strict-dynamic`、`require-trusted-types-for`）。Chrome 78（2019 年）已移除内置的 XSS Auditor，CSP 和 Trusted Types 成为推荐的替代方案。此外，Cookie 的 SameSite 属性默认值已变为 Lax，第三方 Cookie 正逐步被淘汰。本文在保留原有核心内容的基础上，补充了这些现代防御机制的介绍。

通过上篇文章的介绍，我们知道了同源策略可以隔离各个站点之间的 DOM 交互、页面数据和网络通信，虽然严格的同源策略会带来更多的安全，但是也束缚了 Web。这就需要在安全和自由之间找到一个平衡点，所以我们默认页面中可以引用任意第三方资源，然后又引入 CSP 策略来加以限制；默认 XMLHttpRequest 和 Fetch 不能跨站请求资源，然后又通过 CORS 策略来支持其跨域。

不过支持页面中的第三方资源引用和 CORS 也带来了很多安全问题，其中最典型的就是 XSS 攻击。

## 什么是 XSS 攻击

XSS 全称 Cross Site Scripting，为了与"CSS"区分开来，故简称 XSS，翻译过来就是"跨站脚本"。XSS 攻击是指黑客往 HTML 文件中或者 DOM 中注入恶意脚本，从而在用户浏览页面时利用注入的恶意脚本对用户实施攻击的一种手段。

最开始的时候，这种攻击是通过跨域来实现的，所以叫"跨域脚本"。但是发展到现在，往 HTML 文件中注入恶意代码的方式越来越多了，所以是否跨域注入脚本已经不是唯一的注入手段了，但是 XSS 这个名字却一直保留至今。

当页面被注入恶意 JavaScript 脚本时，浏览器无法区分这些脚本是被恶意注入的还是正常的页面内容，所以恶意注入 JavaScript 脚本也拥有所有的脚本权限。下面我们就来看看，如果页面被注入了恶意 JavaScript 脚本，恶意脚本都能做哪些事情：

- 可以窃取 Cookie 信息。恶意 JavaScript 可以通过 `document.cookie` 获取 Cookie 信息，然后通过 XMLHttpRequest 或者 Fetch 加上 CORS 功能将数据发送给恶意服务器；恶意服务器拿到用户的 Cookie 信息之后，就可以在其他电脑上模拟用户的登录，然后进行转账等操作。

- 可以监听用户行为。恶意 JavaScript 可以使用 `addEventListener` 接口来监听键盘事件，比如可以获取用户输入的信用卡等信息，将其发送到恶意服务器。黑客掌握了这些信息之后，又可以做很多违法的事情。

- 可以通过修改 DOM 伪造假的登录窗口，用来欺骗用户输入用户名和密码等信息。

- 还可以在页面内生成浮窗广告，这些广告会严重地影响用户体验。

除了以上几种情况外，恶意脚本还能做很多其他的事情，这里就不一一介绍了。总之，如果让页面插入了恶意脚本，那么就相当于把我们页面的隐私数据和行为完全暴露给黑客了。

## 恶意脚本是怎么注入的

现在我们知道了页面中被注入恶意的 JavaScript 脚本是一件非常危险的事情，所以网站开发者会尽可能地避免页面中被注入恶意脚本。要想避免站点被注入恶意脚本，就要知道有哪些常见的注入方式。通常情况下，主要有存储型 XSS 攻击、反射型 XSS 攻击和基于 DOM 的 XSS 攻击三种方式来注入恶意脚本。

### 1.存储型 XSS 攻击

我们先来看看存储型 XSS 攻击是怎么向 HTML 文件中注入恶意脚本的，你可以参考下图：

![存储型XSS攻击](/images/browser/xss-attack-why-cookie-has-httponly/storage-type-xss.png)

通过上图，我们可以看出存储型 XSS 攻击大致需要经过如下步骤：

- 首先黑客利用站点漏洞将一段恶意 JavaScript 代码提交到网站的数据库中。

- 然后用户向网站请求包含了恶意 JavaScript 脚本的页面。

- 当用户浏览该页面的时候，恶意脚本就会将用户的 Cookie 信息等数据上传到服务器。

下面我们来看个例子，2015 年喜马拉雅就被曝出了存储型 XSS 漏洞。起因是在用户设置专辑名称时，服务器对关键字过滤不严格，比如可以将专辑名称设置为一段 JavaScript，如下图所示：

![专辑名称设置为一段JavaScript](/images/browser/xss-attack-why-cookie-has-httponly/storage-type-xss-demo-1.png)

当黑客将专辑名称设置为一段 JavaScript 代码并提交时，喜马拉雅的服务器会保存该段 JavaScript 代码到数据库中。然后当用户打开黑客设置的专辑时，这段代码就会在用户的页面里执行（如下图），这样就可以获取用户的 Cookie 等数据信息。

![页面执行恶意JavaScript代码](/images/browser/xss-attack-why-cookie-has-httponly/storage-type-xss-demo-2.png)

当用户打开黑客设置的专辑页面时，服务器也会将这段恶意 JavaScript 代码返回给用户，因此这段恶意脚本就在用户的页面中执行了。

恶意脚本可以通过 XMLHttpRequest 或者 Fetch 将用户的 Cookie 数据上传到黑客的服务器，如下图所示：

![将cookie数据上传到黑客服务器](/images/browser/xss-attack-why-cookie-has-httponly/storage-type-xss-demo-3.png)

黑客拿到了用户 Cookie 信息之后，就可以利用 Cookie 信息在其他机器上登录该用户的账号（如下图），并利用用户账号进行一些恶意操作。

![黑客利用Cookie信息登录用户账户](/images/browser/xss-attack-why-cookie-has-httponly/storage-type-xss-demo-4.png)

以上就是存储型 XSS 攻击的一个典型案例，这是乌云网在 2015 年曝出来的，虽然乌云网由于某些原因被关停了，但是你依然可以通过这个站点来查看乌云网的一些备份信息。

### 2.反射型 XSS 攻击

在一个反射型 XSS 攻击过程中，恶意 JavaScript 脚本属于用户发送给网站请求中的一部分，随后网站又把恶意 JavaScript 脚本返回给用户。当恶意 JavaScript 脚本在用户页面中被执行时，黑客就可以利用该脚本做一些恶意操作。

这样讲有点抽象，下面我们结合一个简单的 Node 服务程序来看看什么是反射型 XSS。首先我们使用 Node 来搭建一个简单的页面环境，搭建好的服务代码如下所示：

```js
var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', xss: req.query.xss })
})

module.exports = router
```

```html
<!DOCTYPE html>
<html>
  <head>
    <title><%= title %></title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
  </head>
  <body>
    <h1><%= title %></h1>
    <p>Welcome to <%= title %></p>
    <div>
      <%- xss %>
    </div>
  </body>
</html>
```

上面这两段代码，第一段是路由，第二段是视图，作用是将 URL 中 xss 参数的内容显示在页面。我们可以在本地演示下，比如打开 http://localhost:3000/?xss=123 这个链接，这样在页面中展示就是"123"了（如下图），是正常的，没有问题的。

![正常打开页面](/images/browser/xss-attack-why-cookie-has-httponly/reflect-type-xss-demo-1.png)

但当打开 `http://localhost:3000/?xss=<script>alert('你被xss攻击了')</script>` 这段 URL 时，其结果如下图所示：

![反射型XSS攻击](/images/browser/xss-attack-why-cookie-has-httponly/reflect-type-xss-demo-2.png)

通过这个操作，我们会发现用户将一段含有恶意代码的请求提交给 Web 服务器，Web 服务器接收到请求时，又将恶意代码反射给了浏览器端，这就是反射型 XSS 攻击。在现实生活中，黑客经常会通过 QQ 群或者邮件等渠道诱导用户去点击这些恶意链接，所以对于一些链接我们一定要慎之又慎。

另外需要注意的是，Web 服务器不会存储反射型 XSS 攻击的恶意脚本，这是和存储型 XSS 攻击不同的地方。

### 3.基于 DOM 的 XSS 攻击

基于 DOM 的 XSS 攻击是不牵涉到页面 Web 服务器的。具体来讲，黑客通过各种手段将恶意脚本注入用户的页面中，比如通过网络劫持在页面传输过程中修改 HTML 页面的内容，这种劫持类型很多，有通过 WiFi 路由器劫持的，有通过本地恶意软件来劫持的，它们的共同点是在 Web 资源传输过程或者在用户使用页面的过程中修改 Web 页面的数据。

## 如何阻止 XSS 攻击

我们知道存储型 XSS 攻击和反射型 XSS 攻击都是需要经过 Web 服务器来处理的，因此可以认为这两种类型的漏洞是服务端的安全漏洞。而基于 DOM 的 XSS 攻击全部都是在浏览器端完成的，因此基于 DOM 的 XSS 攻击是属于前端的安全漏洞。

但无论是何种类型的 XSS 攻击，它们都有一个共同点，那就是首先往浏览器中注入恶意脚本，然后再通过恶意脚本将用户信息发送至黑客部署的恶意服务器上。

所以要阻止 XSS 攻击，我们可以通过阻止恶意 JavaScript 脚本的注入和恶意消息的发送来实现。

接下来我们就来看看一些常用的阻止 XSS 攻击的策略。

### 1.服务器对输入脚本进行过滤或转码

不管是反射型还是存储型 XSS 攻击，我们都可以在服务器端将一些关键的字符进行转码，比如最典型的：

```
code: <script>alert('你被 xss 攻击了')</script>
```

这段代码过滤后，只留下：code。

这样，当用户再次请求该页面时，由于 `<script>` 标签的内容都被过滤了，所以这段脚本在客户端是不可能被执行的。

除了过滤之外，服务器还可以对这些内容进行转码，还是上面那段代码，经过转码之后，效果如下所示：

```
code: &lt;script&gt;alert(&#39; 你被 xss 攻击了 &#39;)&lt;/script&gt;
```

经过转码之后的内容，如 `<script>` 标签被转换为 `&lt;script&gt;`，因此即使这段脚本返回给页面，页面也不会执行这段脚本。

### 2.充分使用 CSP

虽然在服务器端执行过滤或者转码可以阻止 XSS 攻击的发生，但完全依靠服务器端依然是不够的，我们还需要把 CSP 等策略充分地利用起来，以降低 XSS 攻击带来的风险和后果。

实施严格的 CSP 可以有效地防范 XSS 攻击，具体来讲 CSP 有如下几个功能：

- 限制加载其他域下的资源文件，这样即使黑客插入了一个 JavaScript 文件，这个 JavaScript 文件也是无法被加载的。

- 禁止向第三方域提交数据，这样用户数据也不会外泄。

- 禁止执行内联脚本和未授权的脚本。

- 还提供了上报机制，这样可以帮助我们尽快发现有哪些 XSS 攻击，以便尽快修复问题。

因此，利用好 CSP 能够有效降低 XSS 攻击的概率。

#### 现代 CSP 策略的演进（2025 更新）

早期的 CSP 主要依赖白名单模式（如 `script-src 'self' cdn.example.com`），但白名单容易被绕过（例如利用白名单域上的 JSONP 端点）。现代 CSP 推荐使用以下更严格的指令：

- **`nonce-*` 模式**：服务器为每次页面请求生成一个唯一的随机 nonce 值，只有带有匹配 nonce 的 `<script>` 标签才被允许执行。例如：`Content-Security-Policy: script-src 'nonce-abc123'`，页面中对应 `<script nonce="abc123">...</script>`。这种方式比白名单更安全，因为攻击者无法猜到每次请求的 nonce。

- **`strict-dynamic`**：与 nonce 配合使用，允许被信任的脚本动态加载其他脚本，而无需为每个动态脚本都设置 nonce。这大大简化了复杂应用中 CSP 的部署。

- **`require-trusted-types-for 'script'`**：配合 Trusted Types API 使用，强制所有 DOM XSS 注入点（如 `innerHTML`、`eval` 等）只接受 Trusted Types 对象，而非普通字符串。

> 注意：Chrome 78（2019 年 10 月）已移除了内置的 XSS Auditor（`X-XSS-Protection` 头对应的功能），因为它存在误报和绕过问题。**CSP 和 Trusted Types 是目前推荐的 XSS 防御方案**，不应再依赖 `X-XSS-Protection` 响应头。

### 3.使用 HttpOnly 属性

由于很多 XSS 攻击都是来盗用 Cookie 的，因此还可以通过 HttpOnly 属性来保护我们 Cookie 的安全。

通常服务器可以将某些 Cookie 设置为 HttpOnly 标志，HttpOnly 是服务器通过 HTTP 响应头来设置的，下面是打开 Google 时，HTTP 响应头中的一段：

```js
set-cookie: NID=189=M8q2FtWbsR8RlcldPVt7qkrqR38LmFY9jUxkKo3-4Bi6Qu_ocNOat7nkYZUTzolHjFnwBw0izgsATSI7TZyiiiaV94qGh-BzEYsNVa7TZmjAYTxYTOM9L_-0CN9ipL6cXi8l6-z41asXtm2uEwcOC5oh9djkffOMhWqQrlnCtOI; expires=Sat, 18-Apr-2020 06:52:22 GMT; path=/; domain=.google.com; HttpOnly
```

我们可以看到，set-cookie 属性值最后使用了 HttpOnly 来标记该 Cookie。顾名思义，使用 HttpOnly 标记的 Cookie 只能使用在 HTTP 请求过程中，所以无法通过 JavaScript 来读取这段 Cookie。我们还可以通过 Chrome 开发者工具来查看哪些 Cookie 被标记了 HttpOnly，如下图：

![查看Cookie是否有HttpOnly标志](/images/browser/xss-attack-why-cookie-has-httponly/look-httponly.png)

从图中可以看出，NID 这个 Cookie 的 HttpOnly 属性是被勾选上的，所以 NID 的内容是无法通过 document.cookie 来读取的。

由于 JavaScript 无法读取设置了 HttpOnly 的 Cookie 数据，所以即使页面被注入了恶意 JavaScript 脚本，也是无法获取到设置了 HttpOnly 的数据。因此一些比较重要的数据我们建议设置 HttpOnly 标志。

#### Cookie 安全的现代演进（2025 更新）

除了 HttpOnly 之外，Cookie 的安全防护在近年来有了更多进展：

- **SameSite 属性默认值变更**：自 2020 年起，Chrome、Firefox、Edge 等主流浏览器已将 Cookie 的 SameSite 属性默认值从 `None` 改为 `Lax`。这意味着大多数 Cookie 在跨站请求时默认不会被发送（除非是顶级导航的 GET 请求），这从根本上减少了 CSRF 攻击的风险，也降低了 Cookie 被恶意脚本通过跨站请求窃取的可能性。

- **第三方 Cookie 逐步淘汰**：Chrome 正在推进第三方 Cookie 的淘汰计划（Privacy Sandbox 项目），Firefox 和 Safari 已经默认阻止第三方 Cookie。这进一步限制了跨站 Cookie 的使用场景，如果需要在跨站上下文中发送 Cookie，必须显式设置 `SameSite=None; Secure`。

- **`__Host-` 和 `__Secure-` Cookie 前缀**：通过使用这些前缀，可以进一步约束 Cookie 的安全属性。例如 `__Host-` 前缀要求 Cookie 必须设置 `Secure` 标志、不能设置 `Domain` 属性，且 `Path` 必须为 `/`，从而防止 Cookie 被子域名劫持。

### 4.现代 XSS 防御机制（2025 更新）

除了传统的输入过滤、CSP 和 HttpOnly 之外，现代浏览器和前端框架引入了更多强大的 XSS 防御手段：

#### Trusted Types API

Trusted Types 是 Chrome 83+ 支持的一项浏览器级 DOM XSS 防御机制。它通过在浏览器层面拦截危险的 DOM 操作（如 `innerHTML`、`eval`、`document.write` 等），强制开发者使用经过安全处理的"可信类型"对象来替代普通字符串。

```js
// 创建 Trusted Types 策略
const policy = trustedTypes.createPolicy('myPolicy', {
  createHTML: (input) => DOMPurify.sanitize(input),
});

// 使用可信类型
element.innerHTML = policy.createHTML(userInput);

// 直接赋值普通字符串会抛出 TypeError
// element.innerHTML = userInput; // 报错！
```

配合 CSP 头 `require-trusted-types-for 'script'`，可以全面禁止未经策略处理的 DOM 注入，从根本上消除 DOM XSS 漏洞。

#### 现代前端框架的自动转义

现代前端框架在设计时就内置了 XSS 防护机制：

- **React**：JSX 中的所有插值表达式 `{value}` 默认会进行 HTML 转义，防止 XSS 注入。只有显式使用 `dangerouslySetInnerHTML` 才能插入原始 HTML，这个命名本身就是一种安全提醒。

- **Vue**：模板中的双花括号 `{{ value }}` 插值默认进行 HTML 转义。只有 `v-html` 指令才会渲染原始 HTML，且 Vue 官方文档明确警告其安全风险。

- **Angular**：内置了自动清理（Sanitization）机制，会对绑定的 HTML、样式和 URL 进行自动清理，并在发现潜在危险内容时发出警告。

这些框架的自动转义机制大大降低了反射型和存储型 XSS 的风险，但开发者仍需注意避免绕过转义的操作（如 React 的 `dangerouslySetInnerHTML`、Vue 的 `v-html`、动态 `href` 中的 `javascript:` 协议等）。

#### Sanitizer API（实验性）

Sanitizer API 是一个正在标准化中的浏览器原生 HTML 清理接口，旨在提供安全、高效的 HTML 清理能力，替代像 DOMPurify 这样的第三方库。它可以安全地将不受信任的 HTML 字符串插入到 DOM 中，同时自动移除潜在的 XSS 攻击载荷。

```js
// Sanitizer API 使用示例（实验性 API，语法可能变化）
const sanitizer = new Sanitizer();
element.setHTML(userInput, { sanitizer });
```

Sanitizer API 的优势在于它是浏览器原生实现的，能够与浏览器的 HTML 解析器保持一致，避免了第三方库可能存在的解析差异漏洞。截至 2025 年，该 API 仍处于实验阶段，但在 Chrome 和 Firefox 中已可通过标志位启用。

## 总结

好了，今天我们就介绍到这里，下面我来总结下本文的主要内容。

XSS 攻击就是黑客往页面中注入恶意脚本，然后将页面的一些重要数据上传到恶意服务器。常见的三种 XSS 攻击模式是存储型 XSS 攻击、反射型 XSS 攻击和基于 DOM 的 XSS 攻击。

这三种攻击方式的共同点是都需要往用户的页面中注入恶意脚本，然后再通过恶意脚本将用户数据上传到黑客的恶意服务器上。而三者的不同点在于注入的方式不一样，有通过服务器漏洞来进行注入的，还有在客户端直接注入的。

针对这些 XSS 攻击，传统的防范策略包括：通过服务器对输入的内容进行过滤或者转码、充分利用好 CSP、使用 HttpOnly 来保护重要的 Cookie 信息。

在现代 Web 开发中（2025 年），我们还拥有更强大的防御工具：**Trusted Types API** 可以从浏览器层面阻止 DOM XSS 攻击；**现代前端框架**（React、Vue、Angular）内置了自动转义机制；**CSP 的 nonce 和 strict-dynamic 模式**比传统白名单更加安全可靠；**Sanitizer API** 正在标准化中，未来将提供浏览器原生的 HTML 清理能力。Cookie 的 **SameSite=Lax 默认策略**和**第三方 Cookie 淘汰**也从另一个维度减少了 Cookie 窃取的风险。

当然除了以上策略之外，我们还可以通过添加验证码防止脚本冒充用户提交危险操作。而对于一些不受信任的输入，还可以限制其输入长度，这样就可以增大 XSS 攻击的难度。