import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the ConfigProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ConfigProvider {

  // Credenciais e Info do Facebook
  
  fbUserPicture: string;
  fbUserName: string;
  fbUserEmail: string;
  fbID: string;
  fbToken: string;

  // Credenciais e Info do Gesol

  gesolClientId: number = 2;
  gesolClientSecret: string = "ihYKaJHmiP06vYlxVl9qDCeZoI0p6RrRdczwHpqu";
  gesolUserName: string = 'filipemolina@live.com';
  gesolPassword: string = '123456'
  gesolToken: string;

  constructor() {
    this.fbUserName = "Marty MacFly";
    this.fbUserEmail = "martymacfly@twopeaks.com!";
    this.fbUserPicture = "assets/img/marty.png";
  }

  //////////////////////////////////////////////// Setters do Facebook

  setFbUserName(nome: string){
    this.fbUserName = nome;
  }

  setFbEmail(email: string){
    this.fbUserEmail = email;
  }

  setFbUserPicture(picture: string){
    this.fbUserPicture = picture;
  }

  setFbID(id: string)
  {
    this.fbID = id;
  }

  setFbToken(token: string){
    this.fbToken = token;
  }

  ////////////////////////////////////////////////////// Setters do Gesol

  setGesolToken(token: string){
    this.gesolToken = token;
  }

  setGesolUsername(name: string){
    this.gesolUserName = name;
  }

  setGesolPassword(pass: string){
    this.gesolPassword = pass;
  }

}
