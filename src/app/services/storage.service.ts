import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {isSupportedJsonParse} from '../utils';
import {StorageArrayActionItem} from './storage.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService<T> {
  private changeSubject: Subject<StorageArrayActionItem<T>> = new Subject<StorageArrayActionItem<T>>();
  public change$: Observable<StorageArrayActionItem<T>> = this.changeSubject.asObservable();
  // use for updating directly from browser storage

  setLocalStorage(key: string, value: T | Array<T>): void {
    const strValue = typeof(value) !== "string" ? JSON.stringify(value) : value;
    window.localStorage.setItem(key, strValue);
  }

  getLocalStorage<T>(key: string, defaultValue: T): T {
    const strValue = window.localStorage.getItem(key);
    if (strValue) {
      return isSupportedJsonParse(strValue) ? JSON.parse(strValue) : strValue;
    } else {
      return defaultValue;
    }
  }

  addValueIntoArrayLocalStorage(key: string, arr: Array<T>, value: T): void {
    arr.push(value);
    this.setLocalStorage(key, arr);
    this.changeSubject.next({
      key,
      value: value,
      action: { type: 'added' }
    });
  }

  removeValueIntoArrayLocalStorage(key: string, arr: Array<T>, value: T): void {
    let index = arr.findIndex(
      (item) => JSON.stringify(item) === JSON.stringify(value)
    );
    if (index !== -1) {
      arr.splice(index, 1);
      this.setLocalStorage(key, arr);
      this.changeSubject.next({
        key,
        value: value,
        action: {
          type: 'removed',
          index
        }
      });
    }
  }
}
