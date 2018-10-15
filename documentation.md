
_______________

# Documentation
##### [API](#api)

- [childNodes](#childNodes)
- [children](#children)
- [descendent](#descendent)

##### [Architecture](#wave-architecture)

##### Resources
- [What forces layout / reflow](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)



# API
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

# Wave Architecture

This is a set of explicit disciplines with the intention of not overcomplicating simple things so more time can be dedicated to the more advanced concepts when building graceful interactions.

## Rendering rule 
###### Render Once / Update Many
Wavefront uses the native DOM to apply the inital-render and to further update the DOM. With the exception of using the [read](#) and (write)[#] wrappers for batching and [kill](#) for stopping a pending read or write. 

##### Inital-Render 
The Inital Render _(conceptual)_ is the first page render of the application or when a route or inner page section is changed.
#### Creating an inital-render
- Create components using [wave](#) > then use a DOM method i.e. [appendChild](#) to insert into the DOM
- _or_ create components within the HTML document,  add them as wave components using i.e. [querySelector](#) and [addComponent](#)

#### View Update  
A view update is performed when you want to: 
- Insert new elements into the DOM
- Remove elements from the DOM
- Add, remove or modify attributes

Updates should be batched using [write](#) to reduce layout thrashing. 
> Reads and writes should be batched separately using [write](#) and [read](#) and can be used either as standalone functions, as nested functions or promises.

It's important to conceptualise initally rendering a page compared to modifying attributes or components because it allows you to create components that:
- Can easily be updates asynchronously
- Reduces how often you destroy components that will likely reappear
- Allows you to modify individual properties and attributes without having to create different versions of a component
- Requires no caching of the original instance because the process that created it is available in code

The rules: 
- The inital-render is the foundation for updates and should be rendered before updating.
- Always wrap DOM updates using [read](#) and [write](#) especially if you are unaware if a change will trigger layout.
- A single page application only requires one inital-render but the loading of a page or change of route can be considered as a new inital-render.



```
@param {string} CMD - A command.
@param {...*} data - Any data type required for a component.
``` 
**The _Actor updates the cachedDOM then renders to the document_**. 
- Most applications only require a single actor.
- The actor can be called from anywhere explicitly except within the views.
- The actor is parsed with a _command_ and optionally a _data_ parameter.
- When the actor is called it compiles each UI component into a single _waveNode_ before rendering to the DOM.
- The actor manages the caching of actions. Performance can be improved where data is predictable.
- The actor module imports each component _(via its controller)_ to build the entire UI. 
- The actor module can be an index file or a directory named `actor` at the root of the `./ui` directory.
- If an actor's _renderTarget_ is expected to change it should be named _actorByTarget_
- _actorByTarget's_ first parameter is an _HTMLElement_ followed by _CMD_ and _data_. 

### controllers
```
@param {string} CMD - A command passed from the act.
@param {*} data - Any data type passed from the act.
@returns {Object} - waveNode 
```
A controller takes _CMD_ and _data_ to perform logic for params, returns a waveNode created by the view and params.
- A controller can either be a single file or a directory of files.
- A component can only have one but a controller can import many view.
- A controller imports "its" view, calls the view with props (Just object properties) and returns.
- Controllers can only be imported by the actor or by other controllers (Which should be avoided)
- tags should be imported from views and not directly used, not even for one off usage.

### views
```
@param {...*} props
@returns {Function} viewTemplate 
```
The view is a declarative template used by it's controller to create a waveNode.
- **There should be absolutely no explicit logic performed within the view.**
- A view can either be a single file or a directory of files.
- A view is typically imported by one controller but may be imported by several controllers.
- props (Preferably within an object) are passed to the view as tags, values and attribute values.
- Conditional, looping and toggling logic are performed by the or(), loop() and toggle() tags. They optionally 
can be performed directly by controller logic.
- Declarative templates _(view files)_ should only contain tags and argument values. 
- Once again: **There should be absolutely no explicit logic performed within the view.** no for loops, no if statements, no switch, no algorithms, only semantics and values.

#### Other formalities 
- Components are directories, each UI component only contain 1 controller and 1 view. Components are located in the `/ui` directory that sits at the root of the project source. A component is imported into the actor via its controller.
- Static templates are declarative templates that are wrapped in an IIFE
- Shared modules, models, events and other scripts are located in the root of the source dir.

That's the entire Wavefront Architecure.
