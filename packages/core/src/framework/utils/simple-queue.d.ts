export declare class SimpleQueue<ItemType> {
  private items
  hasItems(): boolean
  enqueue(item: ItemType): void
  dequeue(): ItemType | undefined
}
