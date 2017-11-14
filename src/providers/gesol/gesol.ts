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
  // Minha máquina
  // private root_url = "http://192.168.111.111/gesol";

  // SRVHOMO URL Interna
  private root_url : string;

  constructor(public http: Http, public config: ConfigProvider) {

    //URL Externa SRVHOMO
    this.root_url = this.config.getRootUrl();

  }

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
  // Offset é um parâmetro opcional, como indicado por "?" no final do nome

  getSolicitacoes(){

    // let headers = this.montaHeaders();

    return this.http.get(this.root_url+"/api/solicitacoes")
               .timeout(10000)
               .map(res => res.json());
  }

  // Adicionar solicitações no Infinite Scroll

  addSolicitacoes(offset){

    return this.http.get(this.root_url+"/api/solicitacoes?offset="+offset)
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
      comentario: mensagem,
      solicitacao_id: solicitacao
    };

    return this.http.post(this.root_url+"/api/comentarios", body, { headers: headers })
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
   * Deletar uma solicitação no GESOL desde que o status dela ainda seja "Aberta"
   * @param id
   */

  deletaSolicitacao(id){

    let headers = this.montaHeaders();

    let body = {

      id : id,
      _method : "DELETE"

    }

    return this.http.post(this.root_url+"/api/solicitacoes/"+id, body, { headers : headers })
               .map(res => res.json());

  }

  editaSolicitante(solicitante){

    let headers = this.montaHeaders();

    let body = { 
      solicitante: solicitante,
      _method: "PUT"
    };

    return this.http.post(this.root_url + "/api/solicitantes/" + solicitante.id, body, { headers: headers })
            .map(res => res.json());

  }

  /**
   * Apoiar ou desapoiar
   */

   apoiar(solicitacao, solicitante){

    let headers = this.montaHeaders();

    let body = {
      solicitacao_id : solicitacao,
      solicitante_id : solicitante
    }

    return this.http.post(this.root_url + "/api/apoiar", body, { headers: headers })
              .map(res => res.json());

   }
   
   /**
    *  Obter o solicitante e todos as suas informações de cadastro
    */

    getSolicitanteInfo()
    {
      let headers = this.montaHeaders();

      let id = this.config.getGesolUserId();

      console.log("ID DO SOLICITANTE", id);

      return this.http.get(this.root_url + "/api/solicitantes/" + id, { headers: headers })
              .map(res => res.json());
    }

  /**
   * Retorna uma lista com todas as opções do Enum
   */

  getEnum(tabela, coluna){

    let headers = this.montaHeaders();

    return this.http.get(this.root_url + "/api/enum/" + tabela + "/" + coluna, { headers: headers })
              .map(res => res.json());

  }

  /**
   * Consulta CEP via API dos correios
   */

  consultaCEP(cep){

    return this.http.get("http://viacep.com.br/ws/" + cep + "/json")
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
