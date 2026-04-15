---
title: "webComponent：像搭积木一样构建web应用"
description: "什么是组件化呢？ 其实组件化并没有一个明确的定义，不过这里我们可以使用 10 个字来形容什么是组件化，那就是：对内高内聚，对外低耦合。对内各个元素彼此紧密结合、相互依赖，对外和其他组件的联系最少且接口简单。 可以说，程序员对组件化开发有着天生的需求，因为一个稍微复杂点的项目，就涉及到多人协作开发..."
date: "2024-03-26"
author: "Kerwin"
tag: "Frontend"
---



> **2025 更新说明**：本文在原有内容基础上，补充了 HTML Imports 被废弃的说明、Declarative Shadow DOM、`ElementInternals` 表单关联与无障碍支持、Customized Built-in Elements、CSS Shadow Parts (`::part`) 与 Constructable Stylesheets，以及 Lit、Stencil 等现代框架对 Web Components 的采用情况。

什么是组件化呢？

其实组件化并没有一个明确的定义，不过这里我们可以使用 10 个字来形容什么是组件化，那就是：对内高内聚，对外低耦合。对内各个元素彼此紧密结合、相互依赖，对外和其他组件的联系最少且接口简单。

可以说，程序员对组件化开发有着天生的需求，因为一个稍微复杂点的项目，就涉及到多人协作开发的问题，每个人负责的组件需要尽可能独立完成自己的功能，其组件的内部状态不能影响到别人的组件，在需要和其他组件交互的地方得提前协商好接口。通过组件化可以降低整个系统的耦合度，同时也降低程序员之间的沟通复杂度，让系统变得更加易于维护。

使用组件化能带来很多优势，所以很多语言天生就对组件化提供了很好的支持，比如 C / C++ 就可以很好地将功能封装成模块，无论是业务逻辑，还是基础功能，抑或是 UI，都能很好地将其组合在一起，实现组件内部的高度内聚、组件之间的低耦合。

大部分语言都能实现组件化，归根结底在于编程语言特性，大多数语言都有自己的函数级作用域、块级作用域和类，可以将内部的状态数据隐藏在作用域之下或者对象的内部，这样外部就无法访问了，然后通过约定好的接口和外部进行通信。

JavaScript 虽然有不少缺点，但是作为一门编程语言，它也能很好地实现组件化，毕竟有自己的函数级作用域和块级作用域，所以封装内部状态数据并提供接口给外部都是没有问题的。

既然 JavaScript 可以很好地实现组件化，那么我们所谈论的 WebComponent 到底又是什么呢？

## 阻碍前端组件化的因素

在前端虽然 HTML、CSS 和 JavaScript 是强大的开发语言，但是在大型项目中维护起来会比较困难，如果在页面中嵌入第三方内容时，还需要确保第三方的内容样式不会影响到当前内容，同样也要确保当前的 DOM 不会影响到第三方的内容。

所以要聊 WebComponent，得先看看 HTML 和 CSS 是如何阻碍前端组件化的，这里我们就通过下面这样一个简单的例子来分析下：

```html
<style>
p {
  background-color: brown;
  color: cornsilk;
}
</style>
<p>time.geekbang.org</p>
```

```html
<style>
p {
  background-color: red;
  color: blue;
}
</style>
<p>time.geekbang</p>
```

上面这两段代码分别实现了自己 p 标签的属性，如果两个人分别负责开发这两段代码的话，那么在测试阶段可能没有什么问题，不过当最终项目整合的时候，其中内部的 CSS 属性会影响到其他外部的 p 标签的，之所以会这样，是因为 CSS 是影响全局的。

我们在《23 | 渲染流水线：CSS 如何影响首次加载时的白屏时间？》这篇文章中分析过，渲染引擎会将所有的 CSS 内容解析为 CSSOM，在生成布局树的时候，会在 CSSOM 中为布局树中的元素查找样式，所以有两个相同标签最终所显示出来的效果是一样的，渲染引擎是不能为它们分别单独设置样式的。

除了 CSS 的全局属性会阻碍组件化，DOM 也是阻碍组件化的一个因素，因为在页面中只有一个 DOM，任何地方都可以直接读取和修改 DOM。所以使用 JavaScript 来实现组件化是没有问题的，但是 JavaScript 一旦遇上 CSS 和 DOM，那么就相当难办了。

## WebComponent 组件化开发

现在我们了解了 CSS 和 DOM 是阻碍组件化的两个因素，那要怎么解决呢？

WebComponent 给出了解决思路，它提供了对局部视图封装能力，可以让 DOM、CSSOM 和 JavaScript 运行在局部环境中，这样就使得局部的 CSS 和 DOM 不会影响到全局。

了解了这些，下面我们就结合具体代码来看看 WebComponent 是怎么实现组件化的。

前面我们说了，WebComponent 是一套技术的组合，具体涉及到了 **Custom Elements（自定义元素）**、**Shadow DOM（影子 DOM）**和 **HTML Templates（HTML 模板）**，详细内容你可以参考 MDN 上的 [相关链接](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components)。

> **关于 HTML Imports**：早期 WebComponent 规范中还包含 HTML Imports（用于引入外部 HTML 文件），但该标准已经被正式废弃。现代 Web 开发中，组件的模块化导入通过 **ES Modules**（`import`/`export`）来实现，HTML 模板则继续使用 `<template>` 元素。这也是为什么如今谈到 WebComponent 的三大核心技术时，只提 Custom Elements、Shadow DOM 和 HTML Templates。

下面我们就来演示下这 3 个技术是怎么实现数据封装的，如下面代码所示：

```html
<!DOCTYPE html>
<html>
  <body>
    <!--
      一：定义模板
      二：定义内部 CSS 样式
      三：定义 JavaScript 行为
    -->
    <template id="geekbang-t">
      <style>
        p {
          background-color: brown;
          color: cornsilk;
        }
        div {
          width: 200px;
          background-color: bisque;
          border: 3px solid chocolate;
          border-radius: 10px;
        }
      </style>
      <div>
        <p>time.geekbang.org</p>
        <p>time1.geekbang.org</p>
      </div>
      <script>
        function foo() {
          console.log('inner log')
        }
      </script>
    </template>
    <script>
      class GeekBang extends HTMLElement {
        constructor() {
          super()
          // 获取组件模板
          const content = document.querySelector('#geekbang-t').content
          // 创建影子 DOM 节点
          const shadowDOM = this.attachShadow({ mode: 'open' })
          // 将模板添加到影子 DOM 上
          shadowDOM.appendChild(content.cloneNode(true))
        }
      }
      customElements.define('geek-bang', GeekBang)
    </script>
    <geek-bang></geek-bang>
    <div>
      <p>time.geekbang.org</p>
      <p>time1.geekbang.org</p>
    </div>
    <geek-bang></geek-bang>
  </body>
</html>
```

详细观察上面这段代码，我们可以得出：要使用 WebComponent，通常要实现下面三个步骤。

**首先，使用 template 属性来创建模板**。利用 DOM 可以查找到模板的内容，但是模板元素是不会被渲染到页面上的，也就是说 DOM 树中的 template 节点不会出现在布局树中，所以可以使用 template 来自定义一些基础的元素结构，这些基础的元素结构是可以被重复使用的。一般模板定义好之后，我们还需要在模板的内部定义样式信息。

**其次，我们需要创建一个 GeekBang 的类**。在该类的构造函数中要完成三件事：

- 查找模板内容。

- 创建影子 DOM。

- 再将模板添加到影子 DOM 上。

上面最难理解的是影子 DOM，其实影子 DOM 的作用是将模板中的内容与全局 DOM 和 CSS 进行隔离，这样我们就可以实现元素和样式的私有化了。你可以把影子 DOM 看成是一个作用域，其内部的样式和元素是不会影响到全局的样式和元素的，而在全局环境下，要访问影子 DOM 内部的样式或者元素也是需要通过约定好的接口的。

总之，通过影子 DOM，我们就实现了 CSS 和元素的封装，在创建好封装影子 DOM 的类之后，我们就可以使用 `customElements.define` 来自定义元素了（可以参考上述代码定义元素的方式）。

> 最后，就很简单了，可以像正常使用 HTML 元素一样使用该元素，如上述代码中的 `<geek-bang></geek-bang>`。

上述代码最终渲染出来的页面，如下图所示：

![使用影子DOM的输出效果](/images/browser/web-component-build-apps-like-blocks/shadow-dom-result.png)

从图中我们可以看出，影子 DOM 内部的样式是不会影响到全局 CSSOM 的。另外，使用 DOM 接口也是无法直接查询到影子 DOM 内部元素的，比如你可以使用 document.getElementsByTagName('div') 来查找所有 div 元素，这时候你会发现影子 DOM 内部的元素都是无法查找的，因为要想查找影子 DOM 内部的元素需要专门的接口，所以通过这种方式又将影子内部的 DOM 和外部的 DOM 进行了隔离。

通过影子 DOM 可以隔离 CSS 和 DOM，不过需要注意一点，影子 DOM 的 JavaScript 脚本是不会被隔离的，比如在影子 DOM 定义的 JavaScript 函数依然可以被外部访问，这是因为 JavaScript 语言本身已经可以很好地实现组件化了。

## Declarative Shadow DOM：声明式影子 DOM

上面的例子中，影子 DOM 都是通过 JavaScript（`this.attachShadow()`）来创建的，这意味着在 JavaScript 加载和执行之前，组件的内容无法渲染。这在服务端渲染（SSR）场景中是一个明显的痛点。

**Declarative Shadow DOM** 通过 `<template>` 元素的 `shadowrootmode` 属性解决了这个问题，允许在 HTML 中直接声明影子 DOM，无需 JavaScript 即可完成初始渲染：

```html
<geek-bang>
  <template shadowrootmode="open">
    <style>
      p { background-color: brown; color: cornsilk; }
    </style>
    <div>
      <p>time.geekbang.org</p>
    </div>
  </template>
</geek-bang>
```

当浏览器解析到带有 `shadowrootmode` 属性的 `<template>` 时，会立即将其内容附加为宿主元素的影子 DOM，整个过程不需要任何 JavaScript。这对于 SSR 和首屏渲染性能有重大意义——服务端可以直接输出包含影子 DOM 的 HTML，客户端无需等待 JS 执行就能看到完整的组件渲染效果。

## ElementInternals：表单关联与无障碍

原生的 `<input>`、`<select>` 等表单元素可以直接参与表单提交和验证，但自定义元素默认是不具备这些能力的。**`ElementInternals`** API 解决了这个问题，它让自定义元素能够：

- **参与表单提交**：通过 `internals.setFormValue(value)` 设置表单值，使得自定义元素可以像原生表单元素一样被 `<form>` 收集数据。
- **参与表单验证**：通过 `internals.setValidity()` 设置验证状态，支持 `:valid`、`:invalid` 等 CSS 伪类。
- **提供无障碍信息**：通过 `internals.role`、`internals.ariaLabel` 等属性为辅助技术提供语义信息。

```javascript
class MyInput extends HTMLElement {
  static formAssociated = true; // 声明为表单关联元素

  constructor() {
    super();
    this.internals = this.attachInternals();
    const shadow = this.attachShadow({ mode: 'open' });
    const input = document.createElement('input');
    input.addEventListener('input', (e) => {
      this.internals.setFormValue(e.target.value);
    });
    shadow.appendChild(input);
  }
}
customElements.define('my-input', MyInput);
```

这样，`<my-input name="username"></my-input>` 就可以在 `<form>` 中正常使用了。

## Customized Built-in Elements：扩展原生元素

除了从零创建全新的自定义元素（Autonomous Custom Elements），WebComponent 规范还支持**扩展已有的原生 HTML 元素**（Customized Built-in Elements）。通过 `extends` 关键字，可以让自定义元素继承原生元素的所有行为：

```javascript
class FancyButton extends HTMLButtonElement {
  constructor() {
    super();
    this.addEventListener('click', () => {
      this.style.transform = 'scale(0.95)';
      setTimeout(() => this.style.transform = '', 150);
    });
  }
}
customElements.define('fancy-button', FancyButton, { extends: 'button' });
```

使用方式是通过 `is` 属性：

```html
<button is="fancy-button">点击我</button>
```

这种方式的好处是可以完整继承原生元素的语义、无障碍属性和内置行为。不过需要注意的是，**Safari/WebKit 明确表示不会支持 Customized Built-in Elements**，因此在需要兼容 Safari 的项目中，建议使用 Autonomous Custom Elements 配合 `ElementInternals` 来替代。

## CSS Shadow Parts：从外部样式化影子 DOM

影子 DOM 的样式隔离是其核心优势，但有时候组件使用者确实需要自定义内部元素的样式。**CSS Shadow Parts** 提供了一种优雅的解决方案：

在组件内部，通过 `part` 属性暴露可样式化的元素：

```javascript
class UserCard extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <div part="card">
        <h2 part="name">默认名称</h2>
        <p part="bio">默认简介</p>
      </div>
    `;
  }
}
customElements.define('user-card', UserCard);
```

在外部，使用 `::part()` 伪元素选择器来样式化这些暴露的部分：

```css
user-card::part(card) {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
}

user-card::part(name) {
  color: #333;
  font-size: 1.2em;
}
```

这样既保持了影子 DOM 的封装性（只有明确用 `part` 标记的元素才能被外部样式化），又提供了必要的可定制性。

## Constructable Stylesheets：共享样式表

当页面上有大量同类型的 Web Components 实例时，每个影子 DOM 都包含一份相同的 `<style>` 会造成内存浪费。**Constructable Stylesheets** 允许通过 JavaScript 创建样式表对象，并在多个影子 DOM 之间共享：

```javascript
const sharedStyles = new CSSStyleSheet();
sharedStyles.replaceSync(`
  p { background-color: brown; color: cornsilk; }
  div { width: 200px; border-radius: 10px; }
`);

class MyComponent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.adoptedStyleSheets = [sharedStyles]; // 共享样式表
    shadow.innerHTML = `<div><p>Hello</p></div>`;
  }
}
```

`adoptedStyleSheets` 接受一个 `CSSStyleSheet` 数组，多个影子 DOM 可以引用同一个样式表对象，浏览器只需要在内存中保留一份，大幅提高了性能。

## 浏览器如何实现影子 DOM

关于 WebComponent 的使用方式我们就介绍到这里。WebComponent 整体知识点不多，内容也不复杂，我认为核心就是影子 DOM。上面我们介绍影子 DOM 的作用主要有以下两点：

- 影子 DOM 中的元素对于整个网页是不可见的。

- 影子 DOM 的 CSS 不会影响到整个网页的 CSSOM，影子 DOM 内部的 CSS 只对内部的元素起作用。

那么浏览器是如何实现影子 DOM 的呢？下面我们就来分析下，如下图：

![影子DOM示意图](/images/browser/web-component-build-apps-like-blocks/shadow-dom-sketch.png)

该图是上面那段示例代码对应的 DOM 结构图，从图中可以看出，我们使用了两次 geek-bang 属性，那么就会生成两个影子 DOM，并且每个影子 DOM 都有一个 shadow root 的根节点，我们可以将要展示的样式或者元素添加到影子 DOM 的根节点上，每个影子 DOM 你都可以看成是一个独立的 DOM，它有自己的样式、自己的属性，内部样式不会影响到外部样式，外部样式也不会影响到内部样式。

浏览器为了实现影子 DOM 的特性，在代码内部做了大量的条件判断，比如当通过 DOM 接口去查找元素时，渲染引擎会去判断 geek-bang 属性下面的 shadow-root 元素是否是影子 DOM，如果是影子 DOM，那么就直接跳过 shadow-root 元素的查询操作。所以这样通过 DOM API 就无法直接查询到影子 DOM 的内部元素了。

另外，当生成布局树的时候，渲染引擎也会判断 geek-bang 属性下面的 shadow-root 元素是否是影子 DOM，如果是，那么在影子 DOM 内部元素的节点选择 CSS 样式的时候，会直接使用影子 DOM 内部的 CSS 属性。所以这样最终渲染出来的效果就是影子 DOM 内部定义的样式。

## 现代框架中的 Web Components

WebComponent 作为浏览器原生的组件化方案，已经被多个现代框架和工具库广泛采用：

- **Lit**（由 Google 维护）：是目前最流行的 Web Components 开发库。它提供了响应式属性、声明式模板（基于 tagged template literals）和高效的更新机制，语法简洁，体积极小（~5KB），是构建 Web Components 的首选方案。
- **Stencil**（由 Ionic 团队维护）：一个 Web Components 编译器，使用 TypeScript 和 JSX 开发组件，编译后输出标准的 Web Components，同时还支持生成 React、Vue、Angular 的包装组件。
- **Shoelace / Web Awesome**：基于 Web Components 构建的 UI 组件库，提供了按钮、对话框、下拉菜单等常用组件，可以在任何框架中使用。

这些工具的出现标志着 Web Components 已经从实验性技术走向了生产级应用。越来越多的设计系统和组件库选择基于 Web Components 构建，因为它们不依赖特定框架，可以在 React、Vue、Angular 甚至纯 HTML 页面中无缝使用。

## 总结

好了，今天就讲到这里，下面我来总结下本文的主要内容。

首先，我们介绍了组件化开发是程序员的刚需，所谓组件化就是功能模块要实现高内聚、低耦合的特性。不过由于 DOM 和 CSSOM 都是全局的，所以它们是影响了前端组件化的主要元素。基于这个原因，就出现 WebComponent，它包含自定义元素、影子 DOM 和 HTML 模板三种技术（注意：早期的 HTML Imports 已被废弃，取而代之的是 ES Modules），使得开发者可以隔离 CSS 和 DOM。在此基础上，我们还重点介绍了影子 DOM 到底是怎么实现的。

在现代 Web 开发中，WebComponent 的能力已经大幅增强：Declarative Shadow DOM 让服务端渲染成为可能；`ElementInternals` 让自定义元素可以参与表单和无障碍；CSS Shadow Parts 和 Constructable Stylesheets 分别解决了样式定制和样式共享的问题。Lit、Stencil 等框架更是让 Web Components 的开发体验更加顺畅。

关于 WebComponent 的未来，可以说它正在走一条稳健的标准化道路。随着浏览器支持的不断完善和社区生态的丰富，Web Components 作为框架无关的组件化基石，其重要性只会越来越高。