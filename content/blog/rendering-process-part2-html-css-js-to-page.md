---
title: "渲染流程（下）：HTML、CSS和JavaScript是如何变成页面的"
description: "在上篇文章中，我们介绍了渲染流水线中的 DOM 生成、样式计算和布局三个阶段，那今天我们接着讲解渲染流水线后面的阶段。 这里还是先简单回顾下上节前三个阶段的主要内容： - 在 HTML 页面内容被提交给渲染引擎之后，渲染引擎首先将 HTML 解析为浏览器可以理解的 DOM。 - 然后根据 CS..."
date: "2024-01-16"
author: "Kerwin"
tag: "Browser"
---



> **2025更新说明**：本文最初编写时，合成动画和图层管理是渲染优化的主要手段。截至2025年，Chrome的渲染流水线引入了多项新能力：**滚动驱动动画（Scroll-Driven Animations）** 让动画可以与滚动位置关联而无需JavaScript；**View Transitions API** 为页面间和页面内的状态切换提供了原生的过渡动画支持；`contain: paint/strict` 等CSS包含属性为图层管理提供了更精确的控制；同时也需要注意 `will-change` 的过度使用会适得其反。以下内容已根据最新进展进行更新。

在上篇文章中，我们介绍了渲染流水线中的 DOM 生成、样式计算和布局三个阶段，那今天我们接着讲解渲染流水线后面的阶段。

这里还是先简单回顾下上节前三个阶段的主要内容：

- 在 HTML 页面内容被提交给渲染引擎之后，渲染引擎首先将 HTML 解析为浏览器可以理解的 DOM。

- 然后根据 CSS 样式表，计算出 DOM 树所有节点的样式。

- 接着又计算每个元素的几何坐标位置，并将这些信息保存在布局树中。

## 分层

现在我们有了布局树，而且每个元素的具体位置信息都计算出来了，那么接下来是不是就要开始着手绘制页面了？

答案依然是否定的。

因为页面中有很多复杂的效果，如一些复杂的3D变换、页面滚动，或者使用 z-index 做 z 轴排序等，为了更加方便地实现这些效果，渲染引擎还需要为特定的节点生成专用的图层，并生成一棵对应的图层树（LayerTree）。如果你熟悉 PS，相信你会很容易理解图层的概念，正是这些图层叠加在一起构成了最终的页面图像。

要想直观地理解什么是图层，你可以打开 Chrome 的"开发者工具"，选择"Layers"标签，就可以可视化页面的分层情况，如下图所示：

![chrome-layers](/images/browser/rendering-process-part2-html-css-js-to-page/chrome-layers.png)

从上图可以看出，渲染引擎给页面分了很多图层，这些图层按照一定顺序叠加在一起，就形成了最终的页面，你可以参考下图：

![最终的页面](/images/browser/rendering-process-part2-html-css-js-to-page/result-page.png)

现在你知道了浏览器的页面实际上被分成了很多图层，这些图层叠加后合成了最终的页面。下面我们再来看看这些图层和布局树节点之间的关系，如文中图所示：

![布局树与图层树](/images/browser/rendering-process-part2-html-css-js-to-page/layout-layer-tree.png)

通常情况下，并不是布局树的每个节点都包含一个图层，如果一个节点没有对应的图层，那么这个节点就从属于父节点的图层。如上图的 span 标签没有专属的图层，那么它们就从属于它们的父节点图层。但不管怎样，最终每一个节点都会直接或者间接地从属于一个层。

那么满足什么条件，渲染引擎才会为特定的节点创建新的层呢？通常满足下面两点中任意一点的元素就可以被提升为单独的一个图层。

### 第一点，拥有层叠上下文属性的元素会被提升为单独的一层

页面是个二维平面，但是层叠上下文能够让 HTML 元素具有三维概念，这些 HTML 元素按照自身属性的优先级分布在垂直于这个二维平面的 z 轴上。你可以结合下图来直观感受下：

![层叠上下文属性](/images/browser/rendering-process-part2-html-css-js-to-page/stacking-context.png)

从图中可以看出，明确定位属性的元素、定义透明属性的元素、使用 CSS 滤镜的元素等，都拥有层叠上下文属性。

> **2025补充：`contain: paint` 与图层创建**：CSS的 `contain` 属性也会影响图层的创建。当元素设置了 `contain: paint` 时，浏览器会确保该元素的内容不会绘制到其边界之外，这实际上创建了一个新的层叠上下文和包含块。`contain: strict`（等同于 `contain: size layout paint style`）则是最严格的包含模式，告诉浏览器这个元素是完全自包含的，其内部的任何变化都不会影响外部。这为浏览器提供了更强的优化机会：
>
> ```css
> .widget {
>   contain: strict;  /* 最严格的包含 */
>   /* 等同于 contain: size layout paint style; */
> }
>
> .sidebar {
>   contain: paint;  /* 绘制内容不会溢出边界 */
> }
> ```
>
> 合理使用 `contain` 属性可以帮助浏览器更高效地管理图层和优化渲染。

### 第二点，需要剪裁（clip）的地方也会被创建为图层

不过首先你需要了解什么是剪裁，结合下面的 HTML 代码：

```html
<style>
  div {
    width: 200;
    height: 200;
    overflow:auto;
    background: gray;
  } 
</style>
<body>
  <div >
    <p>所以元素有了层叠上下文的属性或者需要被剪裁，那么就会被提升成为单独一层，你可以参看下图：</p>
    <p>从上图我们可以看到，document层上有A和B层，而B层之上又有两个图层。这些图层组织在一起也是一颗树状结构。</p>
    <p>图层树是基于布局树来创建的，为了找出哪些元素需要在哪些层中，渲染引擎会遍历布局树来创建层树（Update LayerTree）。</p> 
  </div>
</body>
```

在这里我们把 div 的大小限定为 200 * 200 像素，而 div 里面的文字内容比较多，文字所显示的区域肯定会超过 200 *200 的面积，这时候就产生了剪裁，渲染引擎会把裁剪文字内容的一部分用于显示在 div 区域，下图是运行时的执行结果。

![裁剪页面显示](/images/browser/rendering-process-part2-html-css-js-to-page/tailor-page.png)

出现这种裁剪情况的时候，渲染引擎会为文字部分单独创建一个层，如果出现滚动条，滚动条也会被提升为单独的层。你可以参考下图：

![裁剪提升为一个层](/images/browser/rendering-process-part2-html-css-js-to-page/tailor-layer.png)

所以说，元素有了层叠上下文的属性或者需要被剪裁，满足这任意一点，就会被提升成为单独一层。

## 图层绘制

在完成图层树的构建之后，渲染引擎会对图层树中的每个图层进行绘制，那么接下来我们看看渲染引擎是怎么实现图层绘制的？

试想一下，如果给你一张纸，让你先把纸的背景涂成蓝色，然后在中间位置画一个红色的圆，最后再在圆上画个绿色三角形。你会怎么操作呢？

**通常，你会把你的绘制操作分解为三步：**

- 制蓝色背景。

- 在中间绘制一个红色的圆。

- 再在圆上绘制绿色三角形。

渲染引擎实现图层的绘制与之类似，会把一个图层的绘制拆分成很多小的绘制指令，然后再把这些指令按照顺序组成一个待绘制列表，如下图所示：

![待绘制列表](/images/browser/rendering-process-part2-html-css-js-to-page/draw-list-process.png)

从图中可以看出，绘制列表中的指令其实非常简单，就是让其执行一个简单的绘制操作，比如绘制粉色矩形或者黑色的线等。而绘制一个元素通常需要好几条绘制指令，因为每个元素的背景、前景、边框都需要单独的指令去绘制。所以在图层绘制阶段，输出的内容就是这些待绘制列表。

你也可以打开"开发者工具"的"Layers"标签，选择"document"层，来实际体验下绘制列表，如下图所示：

![绘制列表](/images/browser/rendering-process-part2-html-css-js-to-page/draw-list.png)

在该图中，区域1就是 document 的绘制列表，拖动区域2中的进度条可以重现列表的绘制过程。

## 栅格化（raster）操作

绘制列表只是用来记录绘制顺序和绘制指令的列表，而实际上绘制操作是由渲染引擎中的合成线程来完成的。你可以结合下图来看下渲染主线程和合成线程之间的关系：

![渲染进程](/images/browser/rendering-process-part2-html-css-js-to-page/render-process.png)

如上图所示，当图层的绘制列表准备好之后，主线程会把该绘制列表提交（commit）给合成线程，那么接下来合成线程是怎么工作的呢？

那我们得先来看看什么是视口，你可以参考下图：

![视口](/images/browser/rendering-process-part2-html-css-js-to-page/view-port.png)

通常一个页面可能很大，但是用户只能看到其中的一部分，我们把用户可以看到的这个部分叫做视口（viewport）。

在有些情况下，有些图层可以很大，比如有的页面你使用滚动条要滚动好久才能滚动到底部，但是通过视口，用户只能看到页面的很小一部分，所以在这种情况下，要绘制出所有图层内容的话，就会产生太大的开销，而且也没有必要。

基于这个原因，合成线程会将图层划分为图块（tile），这些图块的大小通常是 256 * 256 或者 512 *512，如下图所示：

![图块](/images/browser/rendering-process-part2-html-css-js-to-page/segment.png)

然后合成线程会按照视口附近的图块来优先生成位图，实际生成位图的操作是由栅格化来执行的。所谓栅格化，是指将图块转换为位图。而图块是栅格化执行的最小单位。渲染进程维护了一个栅格化的线程池，所有的图块栅格化都是在线程池内执行的，运行方式如下图所示：

![栅格化线程池](/images/browser/rendering-process-part2-html-css-js-to-page/raster-task.png)

通常，栅格化过程都会使用 GPU 来加速生成，使用 GPU 生成位图的过程叫快速栅格化，或者 GPU 栅格化，生成的位图被保存在 GPU 内存中。

相信你还记得，GPU 操作是运行在 GPU 进程中，如果栅格化操作使用了 GPU，那么最终生成位图的操作是在 GPU 中完成的，这就涉及到了跨进程操作。具体形式你可以参考下图：

![GPU生成位图](/images/browser/rendering-process-part2-html-css-js-to-page/gpu-create-bitmap.png)

从图中可以看出，渲染进程把生成图块的指令发送给 GPU，然后在 GPU 中执行生成图块的位图，并保存在 GPU 的内存中。

## 合成和显示

一旦所有图块都被光栅化，合成线程就会生成一个绘制图块的命令——"DrawQuad"，然后将该命令提交给浏览器进程。

浏览器进程里面有一个叫 `viz` 的组件，用来接收合成线程发过来的 DrawQuad 命令，然后根据 DrawQuad 命令，将其页面内容绘制到内存中，最后再将内存显示在屏幕上。

到这里，经过这一系列的阶段，编写好的 HTML、CSS、JavaScript 等文件，经过浏览器就会显示出漂亮的页面了。

## 渲染流水线大总结

好了，我们现在已经分析完了整个渲染流程，从 HTML 到 DOM、样式计算、布局、图层、绘制、光栅化、合成和显示。下面我用一张图来总结下这整个渲染流程：

![整个渲染流程](/images/browser/rendering-process-part2-html-css-js-to-page/full-render-process.png)

**结合上图，一个完整的渲染流程大致可总结为如下**

- 渲染进程将 HTML 内容转换为能够读懂的 DOM 树结构。

- 渲染引擎将 CSS 样式表转化为浏览器可以理解的 styleSheets，计算出 DOM 节点的样式。

- 创建布局树，并计算出 DOM 节点的样式。

- 对布局树进行分层，并生成分层树。

- 为每个图层生成绘制列表，并将其提交到合成线程。

- 合成线程将图层分成图块，并在光栅化线程池中将图块转换成位图。

- 合成线程发送绘制图块命令 DrawQuad 给浏览器进程。

- 浏览器进程根据 DrawQuad 消息生成页面，并显示到显示器上。

## 相关概念

有了上面介绍渲染流水线的基础，我们再来看看三个和渲染流水线相关的概念——"重排"、"重绘"和"合成"。理解了这三个概念对于你后续 Web 的性能优化会有很大帮助。

### 1.更新了元素的几何属性（重排）

![重排](/images/browser/rendering-process-part2-html-css-js-to-page/reflow.png)

从上图可以看出，如果你通过 JavaScript 或者 CSS 修改元素的几何位置属性，例如改变元素的宽度、高度等，那么浏览器会触发重新布局，解析之后的一系列子阶段，这个过程就叫重排。无疑，重排需要更新完整的渲染流水线，所以开销也是最大的。

### 2.更新元素的绘制属性（重绘）

接下来，我们再来看看重绘，比如通过 JavaScript 更改某些元素的背景颜色，渲染流水线会怎样调整呢？你可以参考下图：

![重绘](/images/browser/rendering-process-part2-html-css-js-to-page/repaint.png)

从图中可以看出，如果修改了元素的背景颜色，那么布局阶段将不会被执行，因为并没有引起几何位置的变换，所以就直接进入了绘制阶段，然后执行之后的一系列子阶段，这个过程就叫重绘。**相较于重排操作，重绘省去了布局和分层阶段，所以执行效率会比重排操作要高一些**。

### 3.直接合成阶段

那如果你更改一个既不要布局也不要绘制的属性，会发生什么变化呢？渲染引擎将跳过布局和绘制，只执行后续的合成操作，我们把这个过程叫做合成。具体流程参考下图：

![合成](/images/browser/rendering-process-part2-html-css-js-to-page/composition.png)

在上图中，我们使用了 CSS 的 transform 来实现动画效果，这可以避开重排和重绘阶段，直接在非主线程上执行合成动画操作。这样的效率是最高的，因为是在非主线程上合成，并没有占用主线程的资源，另外也避开了布局和绘制两个子阶段，所以相对于重绘和重排，合成能大大提升绘制效率。

> **2025补充：`will-change` 的正确使用与陷阱**：`will-change` 属性可以提前告诉浏览器某个元素将要发生哪种变化（如 `will-change: transform` 或 `will-change: opacity`），以便浏览器提前做好优化准备（通常是将元素提升为独立的合成图层）。然而，**过度使用 `will-change` 会适得其反**：
>
> - 每个设置了 `will-change` 的元素都可能被提升为独立的图层，这会**消耗大量的GPU内存**。
> - 图层过多会增加合成的开销，反而降低性能。
> - `will-change` 应该只在元素**即将**发生变化时设置（比如通过JavaScript在动画开始前添加），动画结束后应该移除。
> - 不要在CSS中对大量元素静态设置 `will-change`，这是一种常见的反模式。
>
> ```css
> /* 反模式：不要这样做！ */
> * { will-change: transform; }
>
> /* 正确做法：只在需要时使用 */
> .animating { will-change: transform; }
> ```

至于如何用这些概念去优化页面，我们会在后面相关章节做详细讲解的，这里你只需要先结合"渲染流水线"弄明白这三个概念及原理就行。

## 2025新增：现代渲染API

### 滚动驱动动画（Scroll-Driven Animations）

传统上，如果我们想让动画效果与页面滚动位置关联（比如滚动进度条、视差效果、元素随滚动渐入），就必须监听 `scroll` 事件并通过JavaScript来控制动画，这会导致性能问题（因为scroll事件在主线程上触发）。

CSS **滚动驱动动画**（Scroll-Driven Animations）让这一切变得简单而高效。通过 `animation-timeline` 属性，你可以将CSS动画的进度与滚动位置直接关联，整个过程可以完全在合成线程上执行，不阻塞主线程：

```css
/* 随页面滚动渐入的效果 */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}

.section {
  animation: fade-in linear both;
  animation-timeline: view();  /* 当元素进入视口时触发 */
  animation-range: entry 0% entry 100%;
}
```

滚动驱动动画有两种时间线：
- **`scroll()`**：与滚动容器的滚动进度关联（0%到100%对应从顶部到底部）。
- **`view()`**：与元素在视口中的可见性关联（元素从进入视口到离开视口）。

### View Transitions API

**View Transitions API** 为页面状态切换提供了原生的、流畅的过渡动画支持。无论是SPA（单页应用）中的页面切换，还是MPA（多页应用）中的跨页面导航，都可以实现优雅的过渡效果。

对于SPA中的DOM更新：

```js
// 使用View Transitions API实现平滑的状态切换
document.startViewTransition(() => {
  // 更新DOM
  updateTheDom();
});
```

浏览器会自动捕获过渡前后的页面快照，并在两者之间应用平滑的交叉淡入淡出动画。你还可以通过CSS自定义过渡效果：

```css
/* 自定义过渡动画 */
::view-transition-old(root) {
  animation: slide-out 0.3s ease-in;
}

::view-transition-new(root) {
  animation: slide-in 0.3s ease-out;
}
```

对于MPA（多页应用），Chrome也开始支持跨文档的View Transitions，只需在CSS中声明：

```css
@view-transition {
  navigation: auto;
}
```

View Transitions API 是Web平台在用户体验层面的重大进步，它让原本需要复杂JavaScript库才能实现的页面切换动画，变成了浏览器原生支持的能力。

## 总结

通过本文的分析，你应该可以看到，Chrome 的渲染流水线还是相当复杂晦涩，且难以理解，不过 Chrome 团队在不断添加新功能的同时，也在不断地重构一些子阶段，目的就是让整体渲染架构变得更加简单和高效，正所谓大道至简。

截至2025年，渲染优化的最佳实践可以总结为：

- 优先使用 `transform` 和 `opacity` 实现动画（仅触发合成，不阻塞主线程）。
- 使用滚动驱动动画替代JavaScript scroll事件监听。
- 使用View Transitions API实现页面切换动画。
- 合理使用 `contain` 属性限制渲染范围。
- 谨慎使用 `will-change`，避免创建过多图层。
- 使用 `content-visibility: auto` 延迟渲染屏幕外的内容。

## 思考时间

在优化 Web 性能的方法中，减少重绘、重排是一种很好的优化方式，那么结合文中的分析，你能总结出来为什么减少重绘、重排能优化 Web 性能吗？那又有那些具体的实践方法能减少重绘、重排呢？

- 触发 repaint reflow 的操作尽量放在一起，比如改变 dom 高度和设置 margin 分开写，可能会触发两次重排。

- 通过虚拟 dom 层计算出操作总的差异，一起提交给浏览器。之前还用过 createdocumentfragment 来汇总 append 的 dom，来减少触发重排重绘次数。

- 使用 `contain: layout` 或 `contain: strict` 限制重排的影响范围，让浏览器知道某个元素内部的变化不会影响外部。

- 使用 CSS 的 `transform` 和 `opacity` 做动画，直接走合成流程，完全避开重排和重绘。