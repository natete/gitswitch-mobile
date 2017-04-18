import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { NativeStorage } from '@ionic-native/native-storage';

@Injectable()
export class TokenService {

  constructor(private nativeStorage: NativeStorage) { }

  /**
   * Saves the token in the native storage.
   * @param token the token to be stored.
   * @returns {Promise<any>} with the result of the storage process.
   */
  setToken(token: any): void {
    //return Promise.resolve();
    //return this.nativeStorage.setItem('token', token);
    localStorage.setItem('token', token);
  }

  /**
   * Returns the token stored in the device.
   * @returns {Promise<any>} with the stored token.
   */
  getToken(): Promise<any> {
    //return Promise.resolve(null);
    //return this.nativeStorage.getItem('token');
    const accessData = localStorage.getItem('token');
    return Promise.resolve(accessData ? JSON.parse(accessData) : null);
  }

  /**
   * Removes the token from the device.
   * @returns {Promise<any>} with the result of the removal process.
   */
  revokeToken(): void {
    //return Promise.resolve();
    //return this.nativeStorage.remove('token');
    localStorage.removeItem('token');
  }
}
