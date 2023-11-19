export const LOCATIONS_STORAGE: string = "locations";

export interface StorageArrayActionItem<T> {
  key: string;
  value: T;
  action: Action;
}

export interface Action {
  type: 'added' | 'removed';
  index?: number; // for removed
}
