import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor() { }
  
/**
 * It returns true if the key exists in sessionStorage, and false if it doesn't
 * @param {string} key - The key of the item you want to check for.
 * @returns A boolean value.
 */
  has(key: string) {
    const data = sessionStorage.getItem(key);
    return (data ? true : false);
  }


/**
 * If the value is an object, then stringify it and store it in sessionStorage. Otherwise, just store
 * it
 * @param {string} key - The key of the item you want to store in the session storage.
 * @param {any} value - The value to be stored in the session storage.
 */
  set(key: string, value: any) {
    if (typeof value === 'object') {
      sessionStorage.setItem(key, JSON.stringify(value));
    }else{
      sessionStorage.setItem(key, value);
    }
  }

/**
 * It gets the data from the session storage and returns it if it exists, otherwise it returns false
 * @param {string} key - The key of the item you want to retrieve from the session storage.
 * @returns The value of the key in sessionStorage.
 */
  get(key: string) {
    const data = sessionStorage.getItem(key);
    if (data) {
      if (this.isJsonString(data)) {
        return JSON.parse(data);
      }
      return data;
    }
    return false;
  }

  remove(key: string) {
    sessionStorage.removeItem(key);
  }

  clearSessionStorage() {
    sessionStorage.clear()
  }

  isJsonString(str: string) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

}
