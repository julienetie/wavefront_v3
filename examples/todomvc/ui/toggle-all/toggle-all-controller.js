import { list } from '../../helpers.js';
let checked = true;
export default () =>{
    list.forEach((value, i, data) => {
        data[i].isComplete = checked;
        data[i].todo.checked = checked;
        console.log(data[i])
    });
    checked = !checked;  
}