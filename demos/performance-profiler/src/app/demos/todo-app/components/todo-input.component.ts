import { Component } from '@angular/core';

import { TodoModel } from '../models/todo.model';
import { FormatService } from '../services/format.service';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'todo-input',
  template: `
    <div>
      <form (ngSubmit)="onSubmit()" class="form-inline">
        <input
          type="text"
          [(ngModel)]="todoModel.title"
          required
          class="form-control"
          name="title"
        />
        <button class="btn btn-success">Add Todo</button>
      </form>
    </div>
  `,
})
export class TodoInputComponent {
  public todoModel: TodoModel = new TodoModel();

  constructor(public todoService: TodoService, public formatService: FormatService) {}

  public onSubmit() {
    this.todoService.addTodo(this.todoModel);
    this.todoModel = new TodoModel();
  }

  public onClick(logMessage) {
    const tm = new TodoModel();
    tm.title = logMessage.value;
    this.todoService.addTodo(tm);
    logMessage.value = '';
  }
}
