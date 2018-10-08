import { yogafire } from '/examples/todomvc/node_modules/yogafire/dist/yogafire.js';
import { addTodo, removeTodo, updateCompleted } from '/examples/todomvc/ui/todo/todo-controller.js';
import toggleAll from '/examples/todomvc/ui/toggle-all/toggle-all-controller.js';
import { list, setFilter } from '/examples/todomvc/helpers.js';

const { wave, components, append } = wavefront;

const removeChildren = parent => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


yogafire({
    keydown: {
        suspect: document,
        handler: ({ e }) => {
            if (e.key === "Enter") {
                const value = components.input.value.trim();
                if (value === '') { return; }
                components.input.value = '';
                addTodo(value);
            }

        }
    },
    mousedown: {
        suspect: document,
        handler: ({ e, target }) => {
            if (target.dataset.hasOwnProperty('toggle')) {
                const todo = target.closest('[data-todo]');
                updateCompleted(target, todo);
                return;
            }

            if (target.dataset.hasOwnProperty('remove')) {
                const todo = target.closest('[data-todo]');
                removeTodo(todo);
                return;
            }

            if (target.dataset.hasOwnProperty('toggleAll')) {
                toggleAll();
                return;
            }
        }
    }
});



const createTodoApp = () =>
    wave `<section class="todoapp">
        <header class="header">
            <h1>todos</h1>
            <input Input class="new-todo" placeholder="What needs to be done?" autofocus>
        </header>
        <section  class="main">
            <input id="toggle-all" class="toggle-all" type="checkbox">
            <label data-toggle-all for="toggle-all">Mark all as complete</label>
            <ul Todo-List class="todo-list"></ul>
            <footer Footer class="footer">
                <span Todo-Count class="todo-count"><strong Count ></strong> items left</span>
                <ul class="filters">
                    <li>
                        <a href="#/" class="selected">All</a>
                    </li>
                    <li>
                        <a href="#/active">Active</a>
                    </li>
                    <li>
                        <a href="#/completed">Completed</a>
                    </li>
                </ul>
                <button class="clear-completed">Clear completed</button>
            </footer>
        </section>
    </section>`;

const createFooter = () => (
    wave `<footer class="info">
        <p>Double-click to edit a todo</p>
    </footer>`);

const $todoApp = createTodoApp();
const $footer = createFooter();
const firstBodyScript = document.scripts.item(0);
document.body.insertBefore($todoApp, firstBodyScript);
document.body.insertBefore($footer, firstBodyScript);


// Set values from localStorage
if (list.length > 0) {
    const newList = Array.from(list);
    list.length = 0;
    newList.forEach(({ value, id, isComplete }, i) => {
        addTodo(value, id, isComplete, i);
    });
}


window.addEventListener('popstate', function(e) {
    const href = location.href;
    const components = href.split('/')
    const component = components[components.length - 1];
    switch (component) {
        case 'active':
            setFilter('active');
            break;
        case 'completed':
            setFilter('completed');
            break;
        default:
            setFilter('all');
    }
});