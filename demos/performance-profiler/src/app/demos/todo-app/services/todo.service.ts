import { TodoModel } from '../models/todo.model';

export class TodoService {
  todos: TodoModel[] = [
    new TodoModel('one'),
    new TodoModel('two'),
    new TodoModel('three')
  ];

  addTodo(value: any): void {
    this.todos.push(value);
  }
}
