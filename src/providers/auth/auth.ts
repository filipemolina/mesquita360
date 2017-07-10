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
  
  constructor(public http: Http, public config : ConfigProvider) {
    this.headers = new Headers();
  }

  getToken()
  {
    console.log("Entrou na getTOken");

    // Criar o corpo da requisição

    this.body = {
      'grant_type' : 'password',
      'client_id' : 2,
      'client_secret' : "q0McotnSV4P4r5yK6dA5eOCtdqBWaEcD9o2ZkoXS",
      'username' : 'filipemolina@live.com',
      'password' : 'Entar0ad*n',
      'scope' : '',
    };

    // Realizando o chamado e retornando um objeto Observable

    return this.http.post("http://localhost:8000/oauth/token", this.body)
      .map(res => res.json());
     
  }

}
