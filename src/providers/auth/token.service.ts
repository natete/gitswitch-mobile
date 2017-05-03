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
    localStorage.setItem('token', JSON.stringify(token));
  }

  /**
   * Returns the token stored in the device.
   * @returns {Promise<any>} with the stored token.
   */
  getToken(): any {
    const token = localStorage.getItem('token');
    return JSON.parse(token);
  }

  /**
   * Removes the token from the device.
   * @returns {Promise<any>} with the result of the removal process.
   */
  revokeToken(): void {
    localStorage.removeItem('token');
  }
}
