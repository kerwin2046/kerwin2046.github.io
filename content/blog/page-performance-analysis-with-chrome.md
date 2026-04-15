---
title: "页面性能分析：利用chrome做web性能分析"
description: "\"浏览器中的页面循环系统\"模块我们已经介绍完了，循环系统是页面的基础，理解了循环系统能让我们从本质上更好地理解页面的工作方式，加深我们对一些前端概念的理解。 接下来我们就要进入新的模块了，也就是\"浏览器中的页面\"模块，正如专栏简介中所言，页面是浏览器的核心，浏览器中的所有功能点都是服务于页面的，而..."
date: "2024-03-05"
author: "Kerwin"
tag: "Frontend"
---



> **2025 更新说明**：本文在原有内容基础上，补充了 Chrome DevTools Performance 面板的最新变化、Lighthouse 性能审计工具、Core Web Vitals 指标与 DevTools 集成、Performance Insights 面板、web-vitals 库的真实用户监控、User Timing API 自定义指标，以及 Long Animation Frames（LoAF）API 用于 INP 调试。

"浏览器中的页面循环系统"模块我们已经介绍完了，循环系统是页面的基础，理解了循环系统能让我们从本质上更好地理解页面的工作方式，加深我们对一些前端概念的理解。

接下来我们就要进入新的模块了，也就是"浏览器中的页面"模块，正如专栏简介中所言，页面是浏览器的核心，浏览器中的所有功能点都是服务于页面的，而 Chrome 开发者工具又是工程师调试页面的核心工具，所以在这个模块的开篇，我想先带你来深入了解下 Chrome 开发者工具。

Chrome 开发者工具（简称 DevTools）是一组网页制作和调试的工具，内嵌于 Google Chrome 浏览器中。Chrome 开发者工具非常重要，所蕴含的内容也是非常多的，熟练使用它能让你更加深入地了解浏览器内部工作原理。（Chrome 开发者工具也在不停地迭代改进，如果你想使用最新版本，可以使用 Chrome Canary）。

作为这一模块的第一篇文章，我们主要聚焦页面的源头和网络数据的接收，这些发送和接收的数据都能体现在开发者工具的网络面板上。不过为了你能更好地理解和掌握，我们会先对 Chrome 开发者工具做一个大致的介绍，然后再深入剖析网络面板。

## Chrome 开发者工具

Chrome 开发者工具有很多重要的面板，比如与性能相关的有网络面板、Performance 面板、内存面板等，与调试页面相关的有 Elements 面板、Sources 面板、Console 面板等。

你可以在浏览器窗口的右上方选择 Chrome 菜单，然后选择"更多工具 --> 开发者工具"来打开 Chrome 开发者工具。打开的页面如下图所示：

![Chrome开发者工具](/images/browser/page-performance-analysis-with-chrome/chrome-dev-tool.png)

从图中可以看出，它一共包含了 10 个功能面板，包括了 Elements、Console、Sources、NetWork、Performance、Memory、Application、Security、Audits 和 Layers。

关于这 10 个面板的大致功能，我做了一个表格，感兴趣的话，你可以详细看下：

![功能表格](/images/browser/page-performance-analysis-with-chrome/function-table.png)

简单来说，Chrome 开发者工具为我们提供了通过界面访问或者编辑 DOM 和 CSSOM 的能力，还提供了强大的调试功能和查看指标的能力。

### Lighthouse：一站式性能审计

**Lighthouse** 是 Chrome 内置的自动化性能审计工具（早期版本中在 Audits 面板，现已独立为 Lighthouse 面板）。它可以对页面进行全方位的审计，生成包含以下类别的评分报告：

- **Performance（性能）**：评估 First Contentful Paint（FCP）、Largest Contentful Paint（LCP）、Total Blocking Time（TBT）、Cumulative Layout Shift（CLS）、Speed Index 等指标。
- **Accessibility（无障碍）**：检查页面是否符合 WCAG 标准。
- **Best Practices（最佳实践）**：检查 HTTPS、图片比例、控制台错误等。
- **SEO**：检查元数据、可爬取性等。

Lighthouse 会在审计完成后给出每项的评分（0-100），并针对每个不合格项给出具体的优化建议和预期收益。在开发阶段，你可以通过 DevTools 中的 Lighthouse 面板运行审计；在 CI/CD 流程中，可以使用 `lighthouse-ci` 进行自动化性能回归检测。

### Core Web Vitals：核心 Web 指标

**Core Web Vitals** 是 Google 定义的三个衡量用户体验的核心指标，它们直接影响搜索排名：

- **LCP（Largest Contentful Paint，最大内容绘制）**：衡量页面主要内容的加载速度，目标是 2.5 秒以内。
- **INP（Interaction to Next Paint，交互到下一次绘制）**：衡量页面对用户交互的响应速度（已取代 FID），目标是 200 毫秒以内。INP 统计的是用户在页面整个生命周期中所有交互的延迟，取最差（或接近最差）的值。
- **CLS（Cumulative Layout Shift，累计布局偏移）**：衡量页面的视觉稳定性，目标是 0.1 以内。

在 Chrome DevTools 中，你可以通过以下方式查看 Core Web Vitals：

1. **Performance 面板**：录制后可以在面板中直接看到 LCP、CLS 等指标的时间点和对应元素。
2. **Core Web Vitals 实时叠加层**：在 DevTools 的 Rendering 面板（通过 Ctrl+Shift+P 搜索 "Core Web Vitals"）中启用叠加层，可以在页面上实时显示 LCP、INP、CLS 的数值。
3. **Performance Insights 面板**（见下文）：以更简洁的方式呈现核心指标。

### Performance 面板的最新变化

Chrome DevTools 的 Performance 面板近年来经历了多次重大更新：

- **时间线轨道重新组织**：新版 Performance 面板将主线程活动、网络请求、帧率、GPU 活动等信息按轨道（Track）清晰分层展示，并支持自定义轨道的显示/隐藏。
- **Interactions 轨道**：专门展示用户交互事件（点击、按键、滚动等），每个交互显示其 INP 贡献值，方便定位响应慢的交互。
- **长任务标记（Long Tasks）**：超过 50ms 的任务会在主线程轨道中用红色三角标记，帮助快速识别阻塞主线程的代码。
- **第三方脚本标识**：面板中可以直接看到哪些脚本来自第三方域名，方便排查第三方脚本对性能的影响。
- **CPU 限速与网络限速**：可以在面板顶部直接设置 CPU 4x/6x 减速和网络限速，模拟低端设备和弱网环境。

### Performance Insights 面板

**Performance Insights** 是 Chrome 团队推出的一个更简洁的性能分析面板（作为 Performance 面板的简化替代）。它的目标是降低性能分析的门槛：

- 自动识别并高亮页面中的性能问题（如渲染阻塞请求、布局偏移、长任务等）。
- 以"洞察"（Insights）的形式展示问题，每个洞察都关联到时间线上的具体位置。
- 不需要像 Performance 面板那样手动分析火焰图，适合快速诊断。

要使用它，在 DevTools 中通过 "More tools" 菜单或 Ctrl+Shift+P 搜索 "Performance insights" 即可打开。

OK，接下来我们就要重点看下其中重要的 Network 面板，即网络面板。

## 网络面板

网络面板由控制器、过滤器、抓图信息、时间线、详细列表和下载信息概要这 6 个区域构成，如下图所示：

![network](/images/browser/page-performance-analysis-with-chrome/network.png)

### 1.控制器

其中，控制器有 4 个比较重要的功能，我们按照下文中的这张图来简单介绍下。

![控制器概要图](/images/browser/page-performance-analysis-with-chrome/controller-summary.png)

- 红色圆点的按钮，表示"开始 / 暂停抓包"，这个功能很常见，很容易理解。

- "全局搜索"按钮，这个功能就非常重要了，可以在所有下载资源中搜索相关内容，还可以快速定位到某几个你想要的文件上。

- Disable cache，即"禁止从 Cache 中加载资源"的功能，它在调试 Web 应用的时候非常有用，因为开启了 Cache 会影响到网络性能测试的结果。

- Online 按钮，是"模拟 2G / 3G"功能，它可以限制带宽，模拟弱网情况下页面的展现情况，然后你就可以根据实际展示情况来动态调整策略，以便让 Web 应用更加适用于这些弱网。

### 2.过滤器

网络面板中的过滤器，主要就是起过滤功能。因为有时候一个页面有太多内容在详细列表区域中展示了，而你可能只想查看 JavaScript 文件或者 CSS 文件，这时候就可以通过过滤器模块来筛选你想要的文件类型。

### 3.抓图信息

抓图信息区域，可以用来分析用户等待页面加载时间内所看到的内容，分析用户实际的体验情况。比如，如果页面加载 1 秒多之后屏幕截图还是白屏状态，这时候就需要分析是网络还是代码的问题了（勾选面板上的"Capture screenshots"即可启用屏幕截图）。

### 4.时间线

时间线，主要用来展示 HTTP、HTTPS、WebSocket 加载的状态和时间的一个关系，用于直观感受页面的加载过程。如果是多条竖线堆叠在一起，那说明这些资源同时被加载。至于具体到每个文件的加载信息，还需要用到下面要讲的详细列表。

### 5.详细列表

这个区域是最重要的，它详细记录了每个资源从发起请求到完成请求这中间所有过程的状态，以及最终请求完成的数据信息。通过该列表，你就能很容易地去诊断一些网络问题。

详细列表是我们本篇文章介绍的重点，不过内容比较多，所以放到最后去专门介绍了。

### 6.下载信息概要

下载信息概要中，你要重点关注下 DOMContentLoaded 和 Load 两个事件，以及这两个事件的完成时间。

- DOMContentLoaded，这个事件发生后，说明页面已经构建好 DOM 了，这意味着构建 DOM 所需要的 HTML 文件、JavaScript 文件、CSS 文件都已经下载完成了。

- Load，说明浏览器已经加载了所以的资源（图像、样式表等）。

通过下载信息概要面板，你可以查看触发这两个事件所花费的时间。

## 网络面板中的详细列表

下面我们就来重点介绍网络面板中的详细列表，这里面包含了大量有用的信息。

### 1.列表的属性

列表的属性比较多，比如 Name、Status、Type、Initiator 等等，这个不难理解。当然，你还可以通过点击右键的下拉菜单来添加其他属性，这里我就不再赘述了，你可以自己上手实操一下。

另外，你也可以按照列表的属性来给列表排序，默认情况下，列表是按请求发起的时间来排序的，最早发起请求的资源在顶部。当然也可以按照返回状态码、请求类型、请求时长、内容大小等基础属性排序，只需点击相应属性即可。

![根据属性排序](/images/browser/page-performance-analysis-with-chrome/property-sort.png)

### 2.详细信息

如果你选中详细列表中的一项，右边就会出现该项的详细信息，如下所示：

![详细请求信息](/images/browser/page-performance-analysis-with-chrome/detail-request-info.png)

你可以在此查看请求列表中任意一项的请求行和请求头信息，还可以查看响应行、响应头和响应体。然后你可以根据这些查看的信息来判断你的业务逻辑是否正确，或者有时候也可以用来逆向推导别人网站的业务逻辑。

### 3.单个资源的时间线

了解了每个资源的详细请求信息之后，我们再来分析单个资源请求时间线，这就涉及具体地 HTTP 请求流程了。

![浏览器中HTTP请求流程](/images/browser/page-performance-analysis-with-chrome/http-request-process.png)

我们再回顾下在《03 | HTTP 请求流程：为什么很多站点第二次打开速度会很快？》这篇文章，我们介绍过发起一个 HTTP 请求之后，浏览器首先查找缓存，如果缓存没有命中，那么继续发起 DNS 请求获取 IP 地址，然后利用 IP 地址和服务器建立 TCP 连接，再发送 HTTP 请求，等待服务器响应；不过，如果服务器响应头中包含了重定向的信息，那么整个流程就需要重新再走一遍。这就是在浏览器中一个 HTTP 请求的基础流程。

那详细列表中是如何表示出这个流程的呢？这就要重点看下时间线面板了。

![单个文件的时间线](/images/browser/page-performance-analysis-with-chrome/single-file-timeline.png)

那面板中这各项到底是什么含义呢？

> 第一个是 Queuing，也就是排队的意思，当浏览器发起一个请求的时候，会有很多原因导致该请求不能被立即执行，而是需要排队等待。导致请求处于排队状态的原因有很多。

- 首先，页面中的资源是有优先级的，比如 CSS、HTML、JavaScript 等都是页面中的核心文件，所以优先级最高；而图片、视频、音频这类资源就不是核心资源，优先级就比较低。通常当后者遇到前者时，就需要"让路"，进入待排队状态。

- 其次，我们前面也提到过，浏览器会为每个域名最多维护 6 个 TCP 连接，如果发起一个 HTTP 请求时，这 6 个 TCP 连接都处于忙碌状态，那么这个请求就会处于排队状态。

- 最后，网络进程在为数据分配磁盘空间时，新的 HTTP 请求也需要短暂地等待磁盘分配结束。

等待排队完成之后，就要进入发起连接的状态了。不过在发起连接之前，还有一些原因可能导致连接过程被推迟，这个推迟就表现在面板中的 Stalled 上，它表示停滞的意思。

这里需要额外说明的是，如果你使用了代理服务器，还会增加一个 Proxy Negotiation 阶段。也就是代理协商阶段，它表示代理服务器连接协商所用的时间，不过在上图中没有体现出来，因为这里我们没有使用代理服务器。

接下来，就到了 Initial connection / SSL 阶段了，也就是和服务器建立连接的阶段，这包括了建立 TCP 连接所花费的时间；不过如果你使用了 HTTPS 协议，那么还需要一个额外地 SSL 握手时间，这个过程主要是用来协商一些加密信息的（关于 SSL 协商的详细过程，我们会在 Web 安全模块中介绍）。

和服务器建立好连接之后，网络进程会准备请求数据，并将其发送给网络，这就是 Request sent 阶段。通常这个阶段非常快，因为只需要把浏览器缓冲区的数据发送出去就结束了，并不需要判断服务器是否接收到了，所以这个时间通常不到 1 毫秒。

数据发送出去了，接下来就是等待接收服务器第一个字节的数据，这个阶段称为 Waiting（TTFB），通常也称为"第一字节时间"。TTFB 是反映服务端响应速度的重要指标，对服务器来说，TTFB 时间越短，就说明服务器响应越快。

接收到第一个字节之后，进入陆续接收完整数据的阶段，也就是 Content Download 阶段，这意味着从第一字节时间到接收到全部响应数据所用的时间。

## 优化时间线上耗时项

了解了时间线面板上的各项含义之后，我们就可以根据这个请求的时间线来实现相关的优化操作了。

### 1.排队（Queuing）时间过久

排队时间过久，大概率是由浏览器为每个域名最多维护 6 个连接导致的。那么基于这个原因，你就可以让 1 个站点下面的资源放到多个域名下面，比如放到 3 个域名下面，这样就可以同时支持 18 个连接了，这种方案称为域名分片技术。除了域名分片技术外，我个人建议你把站点升级到 HTTP2，因为 HTTP2 已经没有每个域名最多维护 6 个 TCP 连接的限制了。

### 2.第一字节时间（TTFB）时间过久

这可能的原因有如下：

- 服务器生成页面数据的时间过久。对于动态网页来说，服务器收到用户打开一个页面的请求时，首先要从数据库中读取该页面需要的数据，然后把这些数据传入到模板中，模板渲染后，再返回给用户。服务器在处理这个数据的过程中，可能某个环节会出问题。

- 网络的原因。比如使用了低带宽的服务器，或者本来用的是电信的服务器，可联通的网络用户要来访问你的服务器，这样也会拖慢网速。

- 发送请求头时带上了多余的用户信息。比如一些不必要的 Cookie 信息，服务器接收到这些 Cookie 信息之后可能需要对每一项都做处理，这样就加大了服务器的处理时长。

对于这三种问题，你要有针对性地出一些解决方案。面对第一种服务器的问题，你可以想办法去提高服务器的处理速度，比如通过增加各种缓存的技术；针对第二种网络问题，你可以使用 CDN 来缓存一些静态文件；至于第三种，你在发送请求时就去尽可能地减少一些不必要的 Cookie 数据信息。

### 3.Content Download 时间过久

如果单个请求的 Content Download 花费了大量时间，有可能是字节数太多的原因导致的。这时候你就需要减少文件大小，比如压缩、去掉源码中不必要的注释等方法。

## 现代性能度量与监控

除了使用 DevTools 进行开发阶段的性能分析，现代前端工程还需要关注真实用户的性能数据（Real User Monitoring, RUM）以及更精细的性能度量 API。

### web-vitals 库：真实用户监控

**web-vitals** 是 Google 提供的一个轻量级 JavaScript 库（~1.5KB gzip），用于在真实用户环境中测量 Core Web Vitals 指标：

```javascript
import { onLCP, onINP, onCLS } from 'web-vitals';

onLCP(console.log);  // 最大内容绘制
onINP(console.log);  // 交互到下一次绘制
onCLS(console.log);  // 累计布局偏移
```

每个回调函数会在指标值确定后被调用，返回一个包含 `name`、`value`、`rating`（"good"/"needs-improvement"/"poor"）、`entries`（相关的 PerformanceEntry）等信息的对象。你可以将这些数据上报到自己的分析后台（如 Google Analytics、自建监控系统），从而了解真实用户的体验状况。

与 Lighthouse 的实验室数据（Lab Data）不同，web-vitals 收集的是**真实用户数据（Field Data）**，两者互补：Lighthouse 用于开发阶段发现问题，web-vitals 用于生产环境持续监控。

### User Timing API：自定义性能指标

Web 标准提供了 **User Timing API**，允许开发者在代码中插入自定义的性能标记和度量：

```javascript
// 标记开始点
performance.mark('data-fetch-start');

// ... 执行数据获取 ...

// 标记结束点
performance.mark('data-fetch-end');

// 创建度量
performance.measure('data-fetch-duration', 'data-fetch-start', 'data-fetch-end');

// 获取度量结果
const measures = performance.getEntriesByName('data-fetch-duration');
console.log(`数据获取耗时: ${measures[0].duration}ms`);
```

这些自定义标记和度量会出现在 DevTools Performance 面板的 Timings 轨道中，方便你在火焰图中精确定位业务代码的性能瓶颈。此外，通过 `PerformanceObserver` 可以异步监听这些条目，避免阻塞主线程。

### Long Animation Frames（LoAF）API：INP 调试利器

**Long Animation Frames（LoAF）API** 是一个相对较新的 API，是对传统 Long Tasks API 的增强，专门为调试 INP（Interaction to Next Paint）问题设计。

传统的 Long Tasks API 只能告诉你"有一个超过 50ms 的长任务"，但无法提供具体信息。而 LoAF 提供了更丰富的信息：

```javascript
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('LoAF 持续时间:', entry.duration);
    console.log('阻塞时间:', entry.blockingDuration);
    console.log('首次 UI 事件时间戳:', entry.firstUIEventTimestamp);
    // 查看具体的脚本信息
    for (const script of entry.scripts) {
      console.log('脚本来源:', script.sourceURL);
      console.log('脚本函数:', script.sourceFunctionName);
      console.log('脚本执行时间:', script.executionStart, '-', script.executionStart + script.duration);
    }
  }
});

observer.observe({ type: 'long-animation-frame', buffered: true });
```

LoAF 的关键优势在于：

- **归因信息**：可以精确知道是哪个脚本、哪个函数导致了长动画帧，而不只是知道"有长任务"。
- **blockingDuration**：区分了帧的总持续时间和实际阻塞用户交互的时间。
- **与 INP 的关联**：通过 `firstUIEventTimestamp` 可以将长动画帧与具体的用户交互关联起来，定位导致 INP 指标差的根本原因。

结合 DevTools Performance 面板中的 Interactions 轨道和 LoAF API 的数据，你可以系统性地优化页面的交互响应性能。

## 总结

好了，今天就介绍到这里了，下面我来总结下今天的内容。

首先我们简单介绍了 Chrome 开发者工具的基础面板信息。在现代 DevTools 中，除了传统的 10 个面板外，**Lighthouse** 面板提供了一站式的性能审计能力，**Performance Insights** 面板提供了更简洁的性能问题诊断方式，而 **Core Web Vitals 叠加层**可以实时展示关键体验指标。

然后我们重点剖析了网络面板，再结合之前介绍的网络请求流程来重点分析了网络面板中时间线的各个指标的含义；最后我们还简要分析了时间线中各项指标出现异常的可能原因，并给出了一些优化方案。

在现代前端工程中，性能分析已经不再局限于 DevTools 的开发阶段调试。通过 **web-vitals** 库可以实现真实用户监控，**User Timing API** 允许你插入自定义性能标记，而 **Long Animation Frames（LoAF）API** 则为 INP 调试提供了前所未有的归因能力。这些工具和 API 的组合，构成了一套从开发到生产的完整性能分析体系。

其实通过今天的分析，我们可以得出这样一个结论：如果你要去做一些实践性的项目优化，理解其背后的理论至关重要。因为理论就是一条"线"，它会把各种实践的内容"串"在一起，然后你可以围绕着这条"线"来排查问题。