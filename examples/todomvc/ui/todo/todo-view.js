export default value =>
	`<li data-todo class="todo">
         	<input data-toggle class="toggle" type="checkbox">
         	<label>${value}</label>
         	<button data-remove class="destroy"></button>
     	</div>
 	</li>`