import { Injectable } from '@angular/core';
import { HttpModule } from "@angular/http";
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { ConfigProvider } from "../config/config";

/*
  Generated class for the GesolProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class GesolProvider {

  private headers: Headers;
  private body: any;

  // Endpoint da API

  private root_url = "http://192.168.111.111/gesol";

  constructor(public http: Http) {}

  criarUsuario(nome, email, cpf, senha, confirmar_senha){

    return this.http.post(this.root_url+"/api/user/create", {
      nome: nome,
      email: email,
      cpf: cpf,
      senha: senha,
      senha_confirmation: confirmar_senha
    }).map(res => res.json());

  }

  login(email, senha){

    return this.http.post(this.root_url+"/api/user/login", {
      email : email,
      senha : senha
    }).map(res => res.json());

  }

}
