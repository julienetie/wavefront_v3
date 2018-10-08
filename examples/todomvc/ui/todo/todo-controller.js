import view from './todo-view.js';
import updateCount from '../count/count-controller.js';
import { removeItem, list, setFilter } from '../../helpers.js';
import o from '../../state-tree.js';
const { stringToWave, components } = wavefront;
const createTodo = value => stringToWave(view(value));
const empty = '';
let id = 0;
let checkedList = [];



console.log('o', o)

/* State */
 o.todoList.storage(state => state)


export const addTodo = (value) => {
    id++;
    const _todoList = components.todoList;
    const todo = createTodo(value);
	 o.todoList.storage(state => {
	 	list.push({
	        todo,
	        id,
	        isComplete: false,
	        value
	    });

	 });

    list.push({
        todo,
        id,
        isComplete: false,
        value
    });
    setFilter();
    _todoList.append(todo);
    updateCount(list);
    // console.log('list', list);
}

export const removeTodo = target => {
    const _todoList = components.todoList;
    removeItem(list, target);
    setFilter();
    _todoList.removeChild(target);
    updateCount(list);
}


export const updateCompleted = (target, todo) => {
    list.find((value, i, data) => {
        if (value.todo === todo) {
            data[i].isComplete = !target.checked;
            return true;
        }
    });

    setFilter();
    // console.log('list', list)
    updateCount(list);
}