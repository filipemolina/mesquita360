import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the ConfigProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ConfigProvider {
  
  userPicture: string;
  userName: string;
  userEmail: string;
  accessToken: string;

  constructor() {
    this.userName = "Marty MacFly";
    this.userEmail = "martymacfly@twopeaks.com!";
    this.userPicture = "assets/img/marty.png";
  }

  setUserName(nome: string){
    this.userName = nome;
  }

  setUserEmail(email: string){
    this.userEmail = email;
  }

  setUserPicture(picture: string){
    this.userPicture = picture;
  }

  setAccessToken(token: string){
    this.accessToken = token;
  }

}
