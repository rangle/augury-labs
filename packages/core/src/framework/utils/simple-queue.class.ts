export class SimpleQueue<ItemType> {
  private items: ItemType[] = [];

  public hasItems() {
    return Boolean(this.items.length);
  }

  public enqueue(item: ItemType) {
    this.items.unshift(item);
  }

  public dequeue() {
    if (!this.hasItems()) {
      return;
    }

    return this.items.pop();
  }
}
