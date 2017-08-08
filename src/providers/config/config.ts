import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import 'rxjs/add/operator/map';

/*
  Generated class for the ConfigProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ConfigProvider {

  // Credenciais e Info do Facebook
  
  private fbUserPicture:     string;
  private fbUserName:        string;
  private fbUserEmail:       string;
  private fbID:              string;
  private fbToken:           string;

  // Credenciais e Info do Gesol

  private gesolClientId:     number = 1;
  private gesolClientSecret: string = "fKbmJiFYFyGWYBc0q5eQLl6x75G2yZKr3saFtENo";
  private gesolUserName:     string;
  private gesolPassword:     string;
  private gesolToken:        string;
  private gesolNome:         string;
  private gesolCPF:          string;
  private gesolFoto:         string;
  private gesolUserId:       number;

  constructor(private storage: Storage) {

    // Ler os valores guardados no dispositivo

    // Facebook

    storage.get('fbUserPicture')    .then(dado => { this.fbUserPicture = dado });
    storage.get('fbUserName')       .then(dado => { this.fbUserName    = dado });
    storage.get('fbUserEmail')      .then(dado => { this.fbUserEmail   = dado });
    storage.get('fbID')             .then(dado => { this.fbID          = dado });
    storage.get('fbToken')          .then(dado => { this.fbToken       = dado });

    // Gesol

    storage.get('gesolClientId')    .then(dado => { this.gesolClientId     = dado });
    storage.get('gesolClientSecret').then(dado => { this.gesolClientSecret = dado });
    storage.get('gesolUserName')    .then(dado => { this.gesolUserName     = dado });
    storage.get('gesolPassword')    .then(dado => { this.gesolPassword     = dado });
    storage.get('gesolToken')       .then(dado => { this.gesolToken        = dado });
    storage.get('gesolNome')        .then(dado => { this.gesolNome         = dado });
    storage.get('gesolCPF')         .then(dado => { this.gesolCPF          = dado });
    storage.get('gesolFoto')        .then(dado => { this.gesolFoto         = dado });
    storage.get('gesolUserId')      .then(dado => { this.gesolUserId       = dado });

  }
  
  /////////////////////////////////////////////////////////////// Falsos Getters

  // Retorna o nome do usuário na seguinte ordem: 
  // Gesol 
  // -> Facebook  
  // ->-> Sem Nome

  getUserName(){

    if(this.gesolNome != null){
      return this.gesolNome;
    } else if(this.fbUserName != null){
      return this.fbUserName;
    } else {
      return "Sem Nome";
    }
  }

  // Retorna o email do usuário na seguinte ordem: 
  // Gesol 
  // -> Facebook  
  // ->-> "teste@exemplo.com"

  getEmail(){

    // O username do Gesol é o email do usuário

    if(this.gesolUserName != null){
      return this.gesolUserName;
    } else if(this.fbUserEmail != null){
      return this.fbUserEmail;
    } else {
      return "teste@exemplo.com";
    }
  }

  // Retorna a foto do usuário na seguinte ordem: 
  // Gesol 
  // -> Facebook  
  // ->-> "teste@exemplo.com"

  getFoto(){

    if(this.gesolFoto != null){
      return this.gesolFoto;
    } else if(this.fbUserPicture != null){
      return this.fbUserPicture;
    } else {
      return "https://api.adorable.io/avatars/85/teste";
    }
  }

  /////////////////////////////////////////////////////////////// Mètodos de Get
  // Simplesmente retornam o valor das variáveis

  //Facebook

  getFbUserName()       { return this.fbUserName; }
  getFbUserPicture()    { return this.fbUserPicture; }
  getFbUserEmail()      { return this.fbUserEmail; }
  getFbID()             { return this.fbID; }
  getFbToken()          { return this.fbToken; }

  // Gesol

  getGesolClientId()    { return this.gesolClientId; }
  getGesolClientSecret(){ return this.gesolClientSecret; }
  getGesolUserName()    { return this.gesolUserName; }
  getGesolPassword()    { return this.gesolPassword; }
  getGesolToken()       { return this.gesolToken; }
  getGesolNome()        { return this.gesolNome; }
  getGesolCPF()         { return this.gesolCPF; }
  getGesolFoto()        { return this.gesolFoto; }
  getGesolUserId()      { return this.gesolUserId; }


  /////////////////////////////////////////////////////////////// Mètodos de Set
  // Primeiro mudam o valor da chave na storage. Assim que isso foi feito, mudam o valor da variável local.

  // Facebook

  setFbUserName(dado: string)    { this.storage.set("fbUserName", dado)   .then(() => { this.fbUserName    = dado }) }
  setFbUserPicture(dado: string) { this.storage.set("fbUserPicture", dado).then(() => { this.fbUserPicture = dado }) }
  setFbUserEmail(dado: string)   { this.storage.set("fbUserEmail", dado)  .then(() => { this.fbUserEmail   = dado }) }
  setFbID(dado: string)          { this.storage.set("fbID", dado)         .then(() => { this.fbID          = dado }) }
  setFbToken(dado: string)       { this.storage.set("fbToken", dado)      .then(() => { this.fbToken       = dado }) }

  // Gesol

  setGesolToken(dado: string)    { this.storage.set("gesolToken", dado)   .then(() => { this.gesolToken    = dado }) }
  setGesolUserName(dado: string) { this.storage.set("gesolUserName", dado).then(() => { this.gesolUserName = dado }) }
  setGesolPassword(dado: string) { this.storage.set("gesolPassword", dado).then(() => { this.gesolPassword = dado }) }
  setGesolNome(dado:string)      { this.storage.set("gesolNome", dado)    .then(() => { this.gesolNome     = dado }) }
  setGesolCPF(dado:string)       { this.storage.set("gesolCPF", dado)     .then(() => { this.gesolCPF      = dado }) }
  setGesolFoto(dado: string)     { this.storage.set("gesolFoto", dado)    .then(() => { this.gesolFoto     = dado }) }
  setGesolUserId(dado: number)   { this.storage.set("gesolUserId", dado)  .then(() => { this.gesolUserId   = dado }) }

}
