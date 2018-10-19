
_______________

# Documentation
##### [API](#api)

###### Array Collections
- [childNodes](#childNodes)
- [children](#children)
- [descendent](#descendent)
- [eachClosest](#eachClosest)
- [eachContains](#eachContains)
- [siblings](#siblings)
- [siblingsEntries](#siblingsEntries)
- [queryEach](#queryEach)
- [queryEachAll]
- [queryAll]

###### Element Creation and Management
- [wave](#wave)

###### Batched Asynchronous Reads and Writes
- [kill]
- [read]
- [write]

###### Styling Helpers
- [style]
- [swap] 
- [toggle]
- [cycle]
- [elevate]

###### Shorthand 
- computedStyle `= (element, propery) => window.getComputedStyle(element, null).getPropertyValue(property)`
- measure `= (element, propery) => element.getBoundingClientRect()[property]`

##### [Architecture](#wave-architecture)
- [Rendering](#rendering)
- [Controller](#controller)
- [View](#view)
- [Life Cycle](#life-cycle)
- [Reading | Writing](#reading-and-writing)
- [File Structure](#file-structure)
- [Interactive UI Design Guidelines](#interactive-ui-design-guidelines)

###### Terminology 
> - _**markupString:** A string representation of HTML, SVG or XML_
> - _**Inital Render:** The first rendered template of an app, page or route_
> - _**View Update:** An insertion, removal or attribute modification after the inital render_
> - _**Component:** A complete UI entity  e.g. weather calendar_
> - _**namedElement:** An element defined using a first-uppercased yponated name immediately following a tag name e.g. `<h1 Large-Heading>...</h1>`. This will register on the named element object `$`_
> - _**Read:** Refers to reading from the DOM, which can often cause layout/reflow. Also known as **measure**_
> - _**write:** Refers to modifying the DOM, which can often cause layout/reflow. Also known as **mutate**_
> - _**Controller:** The logical part of a component_
> - _**View:** The semantic/ presentational part of a component. Also known as a **declarative template**_
> - _**props:** A single or multidimensonal object used as arguments for view/s of the component_
> - _**beforeRender:** A conceptual subscription to the change of state before a particular or genreal DOM Update_
> - _**afterRender:** A conceptual subscription to the change of state after a particular or general DOM Update_
> - _**Mutation Observer:** A native way to observe changes to the DOM (Not part of the Wavefront API)_
> - _**Event Delegation:** Share multiple handlers between a single event. Commonly on the document object_

###### Resources
- [What forces layout / reflow](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)



# API
<img src="https://github.com/julienetie/img/blob/master/wavefront-small.pdf.png?raw=true"/> 

>## Array Collections

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
import { eachClosest, wave, $ } from 'wavefront';

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

const { one, two, three, four } = $;
const someList = [one, two, three, four];
const items = eachClosest(someList, '[data-item]'); // [< .a >,< .b >,< .b >,< .c >,]
```
## eachContains
##### _Get the matching contained element for each element in an array_
> * @param {Array} parents - An array of parent selectors to query.
> * @param {string} selector - A string selector to query
> * @param {Boolean} shouldFlatten - The last parameter of selectors that determines the format of the results. 
> * @return {Array} new element array flat or 3d 
###### Example:

```javascript
import { eachContains, wave } from 'wavefront';

const parts = wave `
  <div One>
    <div>
      <span class="test1 A">A1</span>
      <span class="test2 A">A2</span>
      <span class="test3 A">A3</span>
    </div>
  </div>

<div Two>
  <div>
    <span class="test1 B">B1</span>
    <span class="test2 B">B2</span>
    <span class="test2 B">B2</span>
    <span class="test3 B">B3</span>
  </div>
</div>

<div Three>
  <div>
    <span class="test1 C">C1</span>
    <span class="test2 C">C2</span>
    <span class="test3 C">C3</span>
  </div>
</div>
`;


const parents = Object.values(parts);
const itemsFlat = eachContains(parents,'.test1', '.test2', true); // [<A1>,<A2>,<B1>,<B2>,<C1>,<C2>]
const items = eachContains(parents,'.test1', '.test2', true); // [[[<A1>],[<A2>]],[[<B1>],[<B2>,<B2>]],[[<C1>],[<C2>]]]

```
## siblings
##### _Returns an array of siblings_
> * @param {Element} element
> * @return {Array} sibling

###### Example:

```javascript
import { siblings, wave } from 'wavefront';

const { c } = wave `
  <ul>
    <li A>A</li>
    <li B>B</li>
    <li C>C</li>
    <li D>D</li>
  </ul>
`;

const allSiblings = siblings(c); // [<A>,<B>,<D>]
```
## siblingsEntries
##### _Returns an array indexe and element pairs per sibling 
> * @param {Element} element
> * @return {Array} sibling

###### Example:

```javascript
import { siblingsEntries, wave } from 'wavefront';

const { c } = wave `
  <ul>
    <li A>A</li>
    <li B>B</li>
    <li C>C</li>
    <li D>D</li>
  </ul>
`;

const allSiblings = siblingsEntries(c); // [[0,<A>],[1,<B>],[2,<D>]]
```

## wave 
- **_Creates an element from a declarative template_**
- **_Registers named-elements to the element registry object $_**
- **_Or registers named-elements to a given namespace_**

> * @param {Array} strings - A template literal strings argument
> * @param {Array} tags - An array of tags
> * @return {Object} An Element or node  
###### Examples:
1.1 The wave function invokes an adjacent tagged template. Below is a complete hello world example:
```javascript
import {wave } from 'wavefront';

const greeting = wave `<h1>Hello World!</h1>`;
document.body.appendChild(greeting);
```
1.2 Let's say hello world is a nested element. Rather than using something like querySelector We can instead reference it simply by naming the element. 
> A **namedElement** must: 
> - Be placed immediately after an opening tag and before any attribute
> - start each word with an uppercase letter
> - Have each word start with an uppercased letter
> - Have each word separated by a hyphen if using more than one 

```javascript
import { $, wave } from 'wavefront';

const { greeting } = wave `
  <header Main-Header>
    <h1 Greeting>Hello World!</h1>
    <h2>How are you?</h2> 
  </header>`;

document.body.appendChild(greeting);
```
2. Once an element has been named it can be accessed via the element registry object `$` or `elementRegistry`.
The example below is the same as above:
```javascript
import { $, wave } from 'wavefront';

wave `
  <header Main-Header>
    <h1 Greeting>Hello World!</h1>
    <h2>How are you?</h2> 
  </header>`;
const { greeting } = $; 
document.body.appendChild(greeting);
```
3.1 Consider a **_namedElement_**s as constituents-of-components_. A project may have dozens or even
thousands of _namedElements_ which can become hard to manage using the above. _wave_ allows you to define one **namespace** for each declarative template. Once defined each namedElement in the template will be namespaced.
> A **namespace** must
> - Be placed immediately before the first tag within a declarative template
> - Be prefixed with a hash
> - Have each word start with an uppercased letter
> - Have each word separated by a hyphen if using more than one 

```javascript
import { $, wave, write} from 'wavefront';

const { greeting } = wave `#ThisIsAHeading
  <header Main>
    <h1 Greeting>Hello World!</h1>
    <h2>How are you?</h2> 
  </header>`;

const {main, greeting} = $.thisIsAHeading;

write(()=> greeting.style.color = 'red')
.then(()=>{
  document.body.appendChild(main);
});
```

3.2 Therefore for every occasion you use `wave` you are allowed to impact nested elements to be assinged to one namespace.
If you want nest an already namespece child you simply need to ensure you are using `wave` on that child as well as the parent/s.

```javascript
import { $, wave} from 'wavefront';

const childThing = wave `#Child-Thing
<div Item-A>
  <div Item-B></div>
  <div Item-C></div>
  ${someChild}
  <div>This is not referenced</div>
</div>`;

const parentThing = someChild => wave `#Parent-Thing
<div Item-A>
  <div Item-B></div>
  <div Item-C></div>
  ${someChild}
  <div>This is not referenced</div>
</div>`;

${itemA} = parentThing(childThing);
console.log(itemA) // Item-A of Parent-Thing
console.log($) /*
$
  .parentThing
    .itemA -> Element
    .itemB -> Element
    .itemC -> Element
  .childThing
    .itemA -> Element
    .itemB -> Element
    .itemC -> Element
*/
```
3.3 `wave` will allow you to nest markupStrings, Elements and arrays containing markupStrings or Elements. Names and namespaces are not rendered to the DOM by default but can be made to using config.  

> ###### Note:
> * To obtain an ancestor by selector consider: [closest](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest)
> * To know if an element is a descendent of an element consider: [contains](https://developer.mozilla.org/en-US/docs/Web/API/Node/contains), [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) and [querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll)

# Wave Architecture

This is a set of explicit disciplines with the intention of not overcomplicating simple things so more time can be dedicated to the more advanced concepts when building graceful interactions.

### Rendering
###### Render Once / Update Many
Wavefront uses the native DOM to apply the inital-render and to further update the DOM. With the exception of using the [read](#) and (write)[#] wrappers for batching and [kill](#) for stopping a pending read or write. 

##### Inital-Render 
The Inital Render _(conceptual)_ is the first page render of the application or when a route or inner page section is changed.
#### Creating an inital-render
- Create components using [wave](#) > then use a DOM method i.e. [appendChild](#) to insert into the DOM
- _or_ create components within the HTML document,  add them as wave components using i.e. [querySelector](#) and [addComponent](#)

#### View Update  
A view update _(conceptual)_ is performed when you want to: 
- Insert new elements into the DOM
- Remove elements from the DOM
- Add, remove or modify attributes

Updates should be batched using [write](#) to reduce layout thrashing. 
> Reads and writes should be batched separately using [write](#) and [read](#) and can be used either as standalone functions, nested functions or promises.

Inital-render and view updates are definitions to prevent developers from treating their applications _React-like_. 
Although you could use Wavefront in a _React-like_ way it's discouraged because:

Because the Wave Architecure allows developers to create components that:
- Can easily be updates asynchronously
- Reduces how often you destroy components that will likely reappear
- Allows you to modify individual properties and attributes without having to create different versions of a component
- Requires no caching of the original instance because the process that created it is available in code

###### Recap 
- The inital-render is the foundation for updates and should be rendered before any update is processed.
- Always wrap DOM updates using [read](#) and/or [write](#) especially if you are unaware if a change will trigger layout.
- A single page application only requires one inital-render but the loading of a page or change of route can be considered as an inital-render.

*****
### UI
The `./ui` directory is where all the user interface specific code resides. The majority of an application will likely be contained within `./ui`. 

### Component
A component is a directory located within `./ui`. A component can be placed in the root of `./ui` e.g.`./ui/left-side-bar` or nested in child directories e.g. `./ui/side-bars/left`. A component contains two constituents:
- One [controller](#controller) file or directory
- One [View](#view) file or director
*****

### Controller
The controller is the logical part of a component. 
- The controller can either be a single file or a directory of files. `side-bar-controller.js` | `side-bar-controller/`
- The controller must import it's own view.
- The controller can also import external views.
- `props` is an object or array that is passed as a view's argument.
```javascript 
const props = {
   greeting: 'Hello World!',
   count: 123
}
```
- `props` can be a multidimensional object or array for multiple views in a controller that can reference it's self.
```javascript 
const props = {
   sideBarFoot: <markupString>,
   leftSideBar:{
      greeting: 'Hello World!',
      count: 123,
      foot: props.sidebarFoot
   },
   rightSideBar:{
      greeting: 'Hello World!',
      count: 123,
      foot: props.sidebarFoot
   }
}
```
*****

### View
```
@param {...*} props
@returns {Function} viewTemplate - a function that returns a string
```
The view is a declarative template used by it's controller to create markupStrings or Elements.
- **There should be absolutely no explicit logic performed within the view.**
- A view can either be a single file or a directory of files.
- A view is typically imported by it's controller but may be imported by external controllers.
- props (Preferably within an object) are passed to the view as values.
- Declarative templates _(view files)_ should only contain string values.
- Once again: **There should be absolutely no explicit logic performed within the view.** no for loops, no if statements, no switch, no algorithms, only semantics and values.

###### Formalities 
- Components are directories, each UI component only contain 1 controller and 1 view. Components are located in the `/ui` directory that sits at the root of the project source. A component is imported into the actor via its controller.
- Static templates are declarative templates that are wrapped in an IIFE
- Shared modules, models, events and other scripts are located in the root of the source dir.

*****
### Life Cycle

Wavefront and the Wave Architecture elimintes the need for complex abstractions and pre-made hooks as there is no middle step protecting you from the "scary" DOM. Life-cycle hooks are useful in Virtual-DOM based libraries because of their limited frame-to-frame based component rendering.

Since the native DOM is asyncronous you can choose to: 
- Treat typical Virtual-DOM hooks as any ordinary state change
- Create your own hooks specific to your application's general requirements 
- Disregard hooks as there is no reverse nested component execution when nesting a markupString
- Use the native MutationObserver which is far more powerful than post-render hooks found in common view-layer libraries

#### Conceptual Hooks
- beforeRender: refers to statechange subscriptions before a component is rendered to the DOM
- afterRender: refers to statechange subscriptions after a component is rendered to the DOM
- [MutationObserver](#) (native): A native way obtain detailed reporting of mutations made to the DOM afterRender
