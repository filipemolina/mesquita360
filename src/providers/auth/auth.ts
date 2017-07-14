import { Injectable } from '@angular/core';
import { HttpModule } from "@angular/http";
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

  private headers : Headers;
  private body : any;
  private client_id: number = 2;
  private client_secret: string = "DlUz2kwRBrSUMmNYfO8wgfdlduAijPuaI015cnpS";
  private gesolUserName: string = 'filipemolina@live.com';
  private gesolPassword: string = '123456';

  // Endpoint da API

  private root_url = "http://192.168.111.111/gesol";
  
  constructor(public http: Http, public config : ConfigProvider) {
    this.headers = new Headers();
  }

  getGesolUser(){

    // Fazer um chamada para a API enviando a token do facebook e receber um usuário
    // (Novo ou antigo)

    return this.http.post(this.root_url+"/api/user", { 
        token: this.config.fbToken,
        nome: this.config.fbUserName,
        email: this.config.fbUserEmail,
        foto: this.config.fbUserPicture,
        uid: this.config.fbID
      }).map(res => res.json());

  }

  getGesolToken()
  {
    // Criar o corpo da requisição

    this.body = {
      'grant_type' : 'password',
      'client_id' : this.client_id,
      'client_secret' : this.client_secret,
      'username' : this.gesolUserName,
      'password' : this.gesolPassword,
      'scope' : '',
    };

    // Realizando o chamado e retornando um objeto Observable

    return this.http.post(this.root_url+"/oauth/token", this.body)
      .map(res => res.json());
     
  }

}
