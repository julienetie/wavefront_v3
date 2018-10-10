#### _[[ Alpha use at your own risk ]]_

<p align="center">
<img src="https://github.com/julienetie/img/blob/master/wavefront-med.pdf.png?raw=true"/>
</p>

# WAVEFRONT

### A View Layer Engine For Creating Advanced Web User Interfaces

### What can it do?
- **Create components using template literals**: you can use Elements, strings or arrays as nested tags. 
- **Add namd-component attributes to create references**: `'<div Nav-Bar></div>'` (Names are not rendered by default)   
- **Access component references using the $ object**. `$.navBar // Nav-Bar element` (No need for .querySelector)
- **Batch reads and writes to the DOM**: Using promise based `read()` and `write()` functions based on [**fastdom**](https://github.com/wilsonpage/fastdom).
- **Faster than Virtual-DOM based libraries like React** You are directly manipulating the DOM, of course it's faster. 

### Why would I use this when we already have Angular, React and vue?
###### Because the obscure nature of Virtual-DOM based view-layer libraries by default encourages frame-by-frame interactions which is below par for 21st centruy graphics 

To create "advanced" interactions within HTML you must have the ability to directly read or write to the DOM **without interference**. This is not subjective.

Wavefront provides a handful of tools to create, reference, read and write to the DOM and encourages a **simple methodology to separate concerns between the logic and semantic presentation** of components.

**Components can be rendered asycronously or syncronously without round trips to hell and back**. The `read` and `write` APIs are promise based and allow for batched operations. By using just `import {wave, read, write, $} from "wavefront";` you can achive dynamic asyncronous rendering beyond the capabilities of Angular, React or Vue with or without vendor plugins.

### Why would I not want to use this
The API is small, powerful and easy to use. But to fully appreciate this library you need to understand various parts of the native DOM.Libraries like Angular, React and Vue exist to protect you from these so called "scary" things. Welcome to the dark side 😈.

### Features 
- Create HTML/ SVG as template literal strings.
- Include other strings, elements or arrays (of either) as template tags.
- Separate presentation and logic (view / controller paired architecture). 
- Define components with a component-name attribute (which can optionally render as a data attribute). 
- Reference any named component anywhere in the application.
- Use DOM helpers that allow you to create applications beyond the limitations of Virtual-DOM implementations.
- Render directly to the DOM without caching or extra overhead.
- Manage your application state without the dependency of "this" or ".bind()"

### Handeling Events
At the moment Wavefront does not feature an events library. You can use [yogafire](https://github.com/julienetie/yogafire) for event delegation. Event management will likely be integrated in version 0.3.x using a modular version of yogafire.

### Browser Support
###### Supported browsers:
- Edge 14, Chrome 61, Safari 10, Firefox 53, Opera

Wavefront does not support Internet Explorer. It is possible to make Wavefront support IE11 by using a DOMParser and babel but Wavefront does not want to be complicit in keeping IE11 alive, it's dying so just let it die.

#### Credits 
- Wavefront Author: [Julien Etienne](https://github.com/julienetie)
- FastDOM Author: [Wilson Page](https://github.com/wilsonpage)

MIT (C) Julien Etienne 2018

_______________

# Documentation

<img src="https://github.com/julienetie/img/blob/master/wavefront-small.pdf.png?raw=true"/> 

## descendent 
##### _Get a specific descendent by generation_
* @param {Object} element - the generation by depth.
* @param {number} generation - the generation by depth.
* @return {Object} descendent of element. 
###### Example:
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
###### JavaScript In Example:
* [firstChild](https://developer.mozilla.org/en-US/docs/Web/API/Node/firstChild)
* [wholeText](https://developer.mozilla.org/en-US/docs/Web/API/Text/wholeText)
* [trimEnd](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimEnd)
