###### _[[ (Alpha) use at your own risk ]]_

<p align="center">
<img src="https://github.com/julienetie/img/blob/master/wavefront-med.pdf.png?raw=true"/>
</p>

# WAVEFRONT
[documentation](#documentation)

### A View Layer Engine For Creating Advanced Web User Interfaces

### What can it do?
- **Create components using template literals**: Nest elements, strings or arrays of elements and/or strings.
- **Namespace using parenthesis and add components names**: `(sidebars)<div Latest-News><ul List><li></li></ul></div>`  
- **Access created components from returned object**: `const { latestNews, list } = returnedObject.sidebars;`   
- **Batch reads and writes to the DOM**: Using promise based `read()` and `write()` functions based on [**fastdom**](https://github.com/wilsonpage/fastdom).
- **Perform faster than Virtual-DOM based libraries**: You are directly manipulating the DOM so of course it's faster.
- **Provide DOM helpers for common usage**

### Why would I use this when we already have Angular, React and Vue?
- ###### The obscure strucuture of Virtual-DOM implementations encourages frame-by-frame interactions where you are adding and removing components rather than hiding and revealing.
- Any element can be a component and you can access any created component as a DOM Node at any time.
- You can render mulitple parts of the DOM asynchronously whilst minimizing layout thrashing. 
- Lifecycles can easily be managed by state managemnt or via MutationObserver.
- Wavefront's UI pattern separates semantic presentation from logic. 
- No vendor plugins, no special syntax, no eco-system, 
- It's faster than Virtual-DOM based libraries and more memeory efficient for mobile devices.
- Execute application state without [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) or [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind).

### Handling Events
At the moment Wavefront does not feature an events library. You can use [yogafire](https://github.com/julienetie/yogafire) for event delegation. Event management will likely be integrated in version 0.3.x using a modular version of yogafire.

### Browser Support
###### Supported browsers:
- Edge 14, Chrome 61, Safari 10, Firefox 53, Opera

Wavefront does not support Internet Explorer. Although it is possible to make Wavefront support IE11 by using a [DOMParser](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser) along with [babel](https://babeljs.io) Wavefront does not want to be complicit in keeping IE11 alive, it's dying so just let it die.

#### Credits 
- Wavefront Author: [Julien Etienne](https://github.com/julienetie)
- [fastdom](https://github.com/wilsonpage/fastdom) Author: [Wilson Page](https://github.com/wilsonpage)

MIT (C) Julien Etienne 2018

_______________

# Documentation
##### API
- [childNodes](#childNodes)
- [children](#children)
- [descendent](#descendent)
##### Resources
- [What forces layout / reflow](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)


<img src="https://github.com/julienetie/img/blob/master/wavefront-small.pdf.png?raw=true"/> 

## childNodes
##### _Get childNodes as an array_
> * @param {elementNodeReference} element.
> * @return {Array} new element array. 
> ###### Example:
```javascript
import { childNodes, wave } from 'wavefront';

const greeting = wave `<div class="greeting">Hello World!</div>`;
const question = wave `<div class="question">How are you?</div>`;

document.body.appendChild(greeting);
document.body.insertBefore(question,greeting);
const items = childNodes(document.body); // greeting & question
```
> ###### JavaScript In Example:
> * [appendChild](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild)
> * [insertBefore](https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore)

> ###### Note:
> * This is just shorthand for [...elementNodeReference.childNodes]. See [childNodes](https://developer.mozilla.org/en-US/docs/Web/API/Node/childNodes)

## children
##### _Get children as an array_
> * @param {ParentNode} element.
> * @return {Array} new element array. 
> ###### Example:
```javascript
import { children, wave } from 'wavefront';

const greeting = wave `<div class="greeting">Hello World!</div>`;
const question = wave `<div class="question">How are you?</div>`;

document.body.append(greeting, question);
const items = children(document.body); // greeting & question
```
> ###### JavaScript In Example:
> * [append](https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/append)
> ###### Note:
> * This is just shorthand for [...ParentNode.children]. See [children](https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/children)

## descendent 
##### _Get a specific descendent by generation_
> * @param {Object} element - the child element to traverse from.
> * @param {number} generation - the generation by depth.
> * @return {Object} descendent of element. 
> ###### Example:
```javascript
import { $, descendent, read, wave } from 'wavefront';

wave `
<div Sarah>Grandmother
  <div Maria>Mother
     <div Darren>Son</div>
  </div>
</div>`;

read(() => {
  const descendent2 = descendent($.darren,2);
  const descendentName = descendent2.firstChild.wholeText.trimEnd(); 
  console.log(descendentName) // Grandmother
  console.log(descendent2 === $.Sarah) // true
});
```
> ###### JavaScript In Example:
> * [firstChild](https://developer.mozilla.org/en-US/docs/Web/API/Node/firstChild)
> * [wholeText](https://developer.mozilla.org/en-US/docs/Web/API/Text/wholeText)
> * [trimEnd](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimEnd)
> ###### Note:
> * To obtain an ancestor by selector consider: [closest](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest)
> * To know if an element is a descendent of an element consider: [contains](https://developer.mozilla.org/en-US/docs/Web/API/Node/contains), [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) and [querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll)

## eachClosest 
##### _Get the matching ancestor for each element in an array_
> * @param {Array} elementArray.
> * @param {string} selector.
> * @return {Array} new element array. 
> ###### Example:

```javascript
import { eachClosest, wave, components } from 'wavefront';

wave `
  <ul>
    <li class="a" data-item>
        <span One>One</span>
        <span Two>Two</span>
    </li>
    <li class="b" data-item>
        <span Three>Three</span>
    </li>
    <li class="c" data-item>
        <span Four>Four</span>
    </li>
  </ul>`;

const { one, two, three, four } = components;
const someList = [one, two, three, four];
const items = eachClosest(someList, '[data-item]'); // [< .a >,< .b >,< .b >,< .c >,]
```
## eachContains TBA
##### _Get the matching contained element for each element in an array_
> * @param {Array} elementArray.
> * @param {string} selector.
> * @return {Array} new element array. 
> ###### Example:

```javascript
import { eachClosest, wave, components } from 'wavefront';

wave `
  <ul>
    <li Item-A>
        <span clas="one">One</span>
        <span clas="two">Two</span>
    </li>
    <li Item-B>
        <span clas="three">Three</span>
    </li>
    <li Item-C>
        <span clas="four">Four</span>
    </li>
  </ul>`;

const { itemA, itemB, itemC } = components;
const someList = [itemA, itemB, itemC];
const items = eachContains(someList, 'span'); // [< .one >,< .two >,< .three >,< .four >,]
```
