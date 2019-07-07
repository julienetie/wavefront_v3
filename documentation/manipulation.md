# Manipulation API
> Methods for manipulating the DOM

#### [Animations](#animations)
> Animation helpers
  - [transitionEnd](#transitionend)
  - [observeMutation](#observemutation)
___

#### [Nodes and Elements](#nodes-and-elements)
> Animation helpers
  - [transitionEnd](#transitionend)
  - [observeMutation](#observemutation)
___

#### [Array Collections](#array-collections)
> Animation helpers
  - [childNodes](#childNodes)
  - [children](#children)
  - [descendent](#descendent)
  - [eachClosest](#eachClosest)
  - [eachContains](#eachContains)
  - [siblings](#siblings)
  - [siblingsEntries](#siblingsEntries)
  - [queryEach](#queryEach)
  - [queryEachAll](#a)
  - [queryAll](#a)
___

#### [Sanitization](#Sanitization)
> Clean values for safe outputs
  - [sanitizeText](#sanitizetext)
  - [sanitizeMarkup](#sanitizemarkup)
___ 

#### [Batched Asynchronous Reads and Writes](#batched)
> Batch DOM reads and writes
  - [kill](#)
  - [measure](#)
  - [mutate](#)
___

#### [Styling and Content](#styling-and-content)
> Shorthand styling methods
  - [style](#style)
  - [swap](#a)
  - [toggle](#toggle)
  - [cycle](#cycle)
  - [elevate](#a)
  - [format](#format)
  - [textContent](#textcontent)   Safe writes
___

#### [Dimensional](#shorthand)
> Shorthand dimensional methods
  - [computedStyle](#) `= (element, propery) => window.getComputedStyle(element, null).getPropertyValue(property)`
  - [dimensions](#) `= (element, propery) => element.getBoundingClientRect()[property]`
___

# Wavefront API
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
