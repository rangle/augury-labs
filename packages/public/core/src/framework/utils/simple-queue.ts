export class SimpleQueue<ItemType> {
  private items: ItemType[] = []

  hasItems() {
    return Boolean(this.items.length)
  }

  enqueue(item: ItemType) {
    this.items.unshift(item)
  }

  dequeue() {
    if (!this.hasItems()) return
    return this.items.pop()
  }
}
