###### _[[ (Alpha) use at your own risk ]]_

<p align="center">
<img src="https://github.com/julienetie/img/blob/master/wavefront-med.pdf.png?raw=true"/>
</p>

# WAVEFRONT


[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg?style=for-the-badge)](https://github.com/julienetie/wavefront/blob/master/LICENSE)[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/react.svg?style=for-the-badge)](https://github.com/julienetie/wavefront/blob/master/setup/size/minified)[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/react.svg?style=for-the-badge)](https://github.com/julienetie/wavefront/blob/master/setup/size/minified.gz)

<a href="https://github.com/julienetie/wavefront/blob/master/documentation.md" target="_blank">Documentation</a>

### _An Advanced DOM View Layer_

### What can it do?
- **Create components using template literals**: Nest elements, markupStrings or arrays of elements and/or markupString.
- **Namespace using parenthesis and add components names**: `(sidebars)<div Latest-News><ul List><li></li></ul></div>`.
- **Access created components from returned object**: `const { latestNews, list } = returnedObject.sidebars;`.
- **Batch reads and writes to the DOM**: Using promise based `read()` and `write()` functions based on [**fastdom**](https://github.com/wilsonpage/fastdom).
- **Perform better (faster and more memory efficiently) than Virtual-DOM based libraries**
- **Provide DOM helpers for common usage**.

### Why would I use this when we already have Angular, React and Vue?
- The obscure strucuture of Virtual-DOM implementations encourages frame-by-frame interactions. Which means you are removing elements from the DOM as an alternative to animations which looks kind of crappy in the 21st century.
- Any element can be a component and you can access that component from anywhere once created.
- You can render mulitple parts of the DOM asynchronously whilst minimizing layout thrashing. 
- Lifecycles can easily be managed by state managemnt and/or [MutationObserver](https://hacks.mozilla.org/2012/05/dom-mutationobserver-reacting-to-dom-changes-without-killing-browser-performance/).
- Wavefront's UI pattern separates semantic presentation from logic.
- **No vendor plugins, no transpiling, no eco-system**. Wavefront specific plugins and middlewear are discouraged.
- Events are delegated (TBA) and do not clutter markupStrings.
- Wavefront is not dependent on the use of: [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this), [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind), [classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) or JSX. There are no dependencies.

### Browser Support
###### Supported browsers:
- Edge 14, Chrome 61, Safari 10, Firefox 53, Opera

Wavefront does not support Internet Explorer. Although it is possible to make Wavefront support IE11 by using a [DOMParser](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser) along with [babel](https://babeljs.io) Wavefront does not want to be complicit in keeping IE11 alive, it's dying so just let it die.

#### Credits 
- Wavefront Author: [Julien Etienne](https://github.com/julienetie)
- [fastdom](https://github.com/wilsonpage/fastdom) Author: [Wilson Page](https://github.com/wilsonpage)

MIT (C) Julien Etienne 2018
