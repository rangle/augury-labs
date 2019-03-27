export class SimpleQueue<ItemType> {
  private items: ItemType[] = [];

  public hasItems(): boolean {
    return this.items.length > 0;
  }

  public enqueue(item: ItemType): void {
    this.items.unshift(item);
  }

  public dequeue(): ItemType {
    const item = this.items.pop();

    if (!item) {
      throw new Error('There are no items left to dequeue');
    }

    return item;
  }
}
