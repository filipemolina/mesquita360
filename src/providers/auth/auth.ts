import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
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

  // private root_url = "http://192.168.111.111/gesol";
  // private root_url = "http://192.168.0.18/gesol";
  private root_url: string;
  
  constructor(public http: Http, public config : ConfigProvider) {

    this.root_url = this.config.getRootUrl();

  }

  getGesolUser(email, nome, foto, username, token, uid, fcm_id){

    // Fazer um chamada para a API enviando a token do facebook e receber um usuário
    // (Novo ou antigo)

    return this.http.post(this.root_url+"/api/user", {
      token: token,
      nome:  nome,
      email: email,
      foto:  foto,
      uid:   uid,
      fcm_id: fcm_id
    }).map(res => res.json());

  }

}