import { TodoAppComponent } from './components/todo-app.component';
import { TodoInputComponent } from './components/todo-input.component';
import { TodoListComponent } from './components/todo-list.component';

import { FormatService } from './services/format.service';
import { TodoService } from './services/todo.service';

export const TODO_APP_COMPONENTS = [TodoAppComponent, TodoInputComponent, TodoListComponent];

export const TODO_APP_SERVICES = [TodoService, FormatService];

export { TodoAppComponent };
