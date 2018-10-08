const { components } = wavefront;
const empty = '';

export default (list) =>{
	const count = list.filter(value => value.isComplete === false).length;
	if(count === 0){
		delete components.footer.dataset.display;
	}else{
		components.footer.dataset.display = empty;
	}
	components.count.textContent = count;
}
