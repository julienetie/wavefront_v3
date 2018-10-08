export const removeItem = (list,target) => {
	list.find((value,i,data) => value.todo === target ? data.splice(i,1) : false);
}


export const list = JSON.parse(localStorage.getItem('list')) || [];


export const view = {
	filter: 'all'
};


export const setFilter = (filter) => {
	if(filter !== undefined){
		view.filter = filter; 
	}
    list.forEach(({ isComplete, todo }) => {
        switch (view.filter) {
            case 'completed':
                if (isComplete) {
                    todo.dataset.display = '';
                } else {
                    delete todo.dataset.display;
                }
                break;
            case 'active':
                if (isComplete) {
                    delete todo.dataset.display;

                } else {
                    todo.dataset.display = '';
                }
                break;
            default:
                todo.dataset.display = '';
        }
    });
    localStorage.setItem('list', JSON.stringify(list));
}