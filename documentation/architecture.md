# Architecture

##### [Wave_Architecture](#wave-architecture)
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
