import { Injectable } from '@angular/core';
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

  // Endpoint da API

  private root_url = "http://192.168.111.111/gesol";

  constructor(public http: Http, public config: ConfigProvider) {}

  ////////////////////////////////////////////////////////////////////////// Autenticação

  // Criar Usuário

  criarUsuario(nome, email, cpf, senha, confirmar_senha){

    return this.http.post(this.root_url+"/api/user/create", {
      nome: nome,
      email: email,
      cpf: cpf,
      senha: senha,
      senha_confirmation: confirmar_senha
    }).map(res => res.json());

  }

  // Logar Usuário Criado

  login(email, senha){

    return this.http.post(this.root_url+"/api/user/login", {
      email : email,
      senha : senha
    }).map(res => res.json());

  }
  ////////////////////////////////////////////////////////////////////////// Obtenção de dados

  // Obter todas as solicitações

  getSolicitacoes(){

    let headers = this.montaHeaders();

    return this.http.get(this.root_url+"/api/solicitacoes", { headers: headers })
               .map(res => res.json());
  }

  /**
   * Retorna apenas as solicitações criadas pelo próprio usuário
   */

  getMinhasSolicitacoes(){

    let headers = this.montaHeaders();

    return this.http.get(this.root_url+"/api/solicitacoes/minhas?id="+this.config.getGesolUserId(), { headers : headers })
                    .map(res => res.json());

  }

  // Obter os setores para criar uma solicitação

  getSetores(){
    
    let headers = this.montaHeaders();

    return this.http.get(this.root_url+"/api/setores", { headers: headers })
               .map(res => res.json());
  }

  // Obter todos os serviços de um determinado setor

  getServicos(id){
    let headers = this.montaHeaders();

    return this.http.post(this.root_url+"/api/servicosporsetor", { id: id }, { headers : headers })
               .map(res => res.json());
  }

  // Obter um setor através do ID

  getSetor(id){

    let headers = this.montaHeaders();

    return this.http.get(this.root_url+"/api/setores/"+id, { headers: headers })
               .map(res => res.json());

  }

  // Cadastrar uma nova mensagem em uma solicitação

  enviaMensagem(mensagem, solicitacao){

    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Authorization', 'Bearer '+this.config.getGesolToken());

    let body= {
      mensagem: mensagem,
      solicitacao_id: solicitacao
    };

    return this.http.post(this.root_url+"/api/mensagens", body, { headers: headers })
              .map(res => res.json());

  }

  /**
   * Cadastrar uma nova solicitação no Gesol
   */

  enviaSolicitacao(foto, servico, texto, endereco){

    let headers = this.montaHeaders();

    let body = {
      foto: foto,
      servico_id: servico,
      conteudo: texto,
      logradouro: endereco['logradouro'],
      numero: endereco['numero'],
      bairro: endereco['bairro'],
      municipio: endereco['municipio'],
      uf: endereco['uf'],
      latitude: endereco['latitude'],
      longitude: endereco['longitude'],
      solicitante_id: this.config.getGesolUserId()
    }

    return this.http.post(this.root_url+"/api/solicitacoes", body, { headers: headers })
               .map(res => res.json());

  }

  /**
   * Retorna um cabeçalho que pode ser usado em qualquer requisição
   */

  private montaHeaders(){
    
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Authorization', 'Bearer '+this.config.getGesolToken());

    return headers;

  }

}
