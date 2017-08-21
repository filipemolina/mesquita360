import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { ConfigProvider } from "../config/config";

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AuthProvider {


  // Endpoint da API

  private root_url = "http://192.168.111.111/gesol";
  
  constructor(public http: Http, public config : ConfigProvider) {
  }

  getGesolUser(email, nome, foto, username, token, uid){

    // Fazer um chamada para a API enviando a token do facebook e receber um usuário
    // (Novo ou antigo)

    return this.http.post(this.root_url+"/api/user", { 
        token: token,
        nome:  nome,
        email: email,
        foto:  foto,
        uid:   uid,
      }).map(res => res.json());

  }

}