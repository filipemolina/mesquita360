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

  gesolClientId: number = 1;
  gesolClientSecret: string = "fKbmJiFYFyGWYBc0q5eQLl6x75G2yZKr3saFtENo";
  gesolUserName: string = 'app@mesquita.rj.gov.br';
  gesolPassword: string = '123456';
  gesolToken: string;

  constructor() {
    this.fbUserName = "Marty MacFly";
    this.fbUserEmail = "martymacfly@twopeaks.com!";
    this.fbUserPicture = "assets/img/marty.png";
  }

  //////////////////////////////////////////////// Facebook

  /////////////// Getters

  getFbUserName()   { return this.fbUserName; }
  getFbUserPicture(){ return this.fbUserPicture; }
  getFbUserEmail()  { return this.fbUserEmail; }
  getFbId()         { return this.fbID; }
  getFbToken()      { return this.fbToken; }

  /////////////// Setters

  setFbUserName(nome: string)      { this.fbUserName = nome; }
  setFbEmail(email: string)        { this.fbUserEmail = email; }
  setFbUserPicture(picture: string){ this.fbUserPicture = picture; }
  setFbID(id: string)              { this.fbID = id; }
  setFbToken(token: string)        { this.fbToken = token; }

  //////////////////////////////////////////////// Gesol

  /////////////// Getters

  getGesolClientId()    { return this.gesolClientId; }
  getGesolClientSecret(){ return this.gesolClientSecret; }
  getGesolUserName()    { return this.gesolUserName; }
  getGesolPassword()    { return this.gesolPassword; }
  getGesolToken()       { return this.gesolToken; }

  /////////////// Setters

  setGesolToken(token: string)  { this.gesolToken = token; }
  setGesolUsername(name: string){ this.gesolUserName = name; }
  setGesolPassword(pass: string){ this.gesolPassword = pass; }

}
