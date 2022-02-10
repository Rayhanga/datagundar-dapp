import type { Writable } from "svelte/store"
import type { Notification } from "./genericTypes"

export interface WritableGunCollection extends Writable<object> {
  getItemKey(targetValue: any): string | null
  getItemByKey(key: string): any
  addItem(value: any, key?: string): void
  updateItem(key: string, value: any): void
  removeItem(key: string): void
  clearCollection(): void
  setCollection(newValue: any, callback): void
}

export interface WritableGunItem<T> extends Writable<T> {
  setValue(newValue: T): void
  deleteValue(): void
}

export interface NotificationStore extends Writable<object> {
  notify(notification: Notification): void
  removeNotification(key: string): void
}