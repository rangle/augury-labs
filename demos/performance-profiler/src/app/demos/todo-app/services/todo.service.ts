import { TodoModel } from '../models/todo.model';

export class TodoService {
  public todos: TodoModel[] = [new TodoModel('one'), new TodoModel('two'), new TodoModel('three')];

  public addTodo(value: any): void {
    this.todos.push(value);
  }
}
