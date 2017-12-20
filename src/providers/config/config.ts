import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import 'rxjs/add/operator/map';
import { NavController, AlertController, Events } from 'ionic-angular';
import { Geolocation } from "@ionic-native/geolocation";
import { Diagnostic } from "@ionic-native/diagnostic";
import { Http } from "@angular/http";

/*
  Generated class for the ConfigProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ConfigProvider {

  // Versão do aplicativo
  public versao = "0.0.3";

  // Rota Raiz da Aplicação
  private root_url = "https://360.mesquita.rj.gov.br/gesol";  

  // Objeto que guarda todas as informações do solicitante
  public solicitante:any = [];

  // Objeto que guarda todas as solicitações recebidas do Gesol
  private solicitacoes:any;
  private minhasSolicitacoes:any;

  // Token do FCM (Firebase Cloud Message)
  public FCM_ID: string;

  // Chave da API do Google Maps

  public MapsApiKey: string = "AIzaSyDcdW2PsrS1fbsXKmZ6P9Ii8zub5FDu3WQ";
  public lati: any;
  public longi: any;
  public endereco : any[] = [];
  public temEndereco: boolean = false;
  private GPSAtivado = false;

  // Credenciais e Info do Facebook
  
  private fbUserPicture:     string;
  private fbUserName:        string;
  private fbUserEmail:       string;
  private fbID:              string;
  private fbToken:           string;

  // Credenciais e Info do Gesol

  private gesolClientId:     number = 1;
  private gesolClientSecret: string = "WKVS6iv2lzuozddUBDbZ5ClADX7A5jHJf3YAjMjX";
  private gesolUserName:     string;
  private gesolPassword:     string;
  private gesolToken:        string;
  private gesolNome:         string;
  private gesolCPF:          string;
  private gesolFoto:         string;
  private gesolUserId:       number;

  private logado:            boolean;

  constructor(private storage: Storage, 
              private geolocation: Geolocation, 
              private http: Http,
              public diagnostic: Diagnostic,
              public alertCtrl: AlertController,
              public events: Events) {

    // Ler os valores guardados no dispositivo

    // Facebook

    storage.get('fbUserPicture')    .then(dado => { this.fbUserPicture     = dado });
    storage.get('fbUserName')       .then(dado => { this.fbUserName        = dado });
    storage.get('fbUserEmail')      .then(dado => { this.fbUserEmail       = dado });
    storage.get('fbID')             .then(dado => { this.fbID              = dado });
    storage.get('fbToken')          .then(dado => { this.fbToken           = dado });

    // Gesol

    storage.get('gesolUserName')    .then(dado => { this.gesolUserName     = dado });
    storage.get('gesolPassword')    .then(dado => { this.gesolPassword     = dado });
    storage.get('gesolToken')       .then(dado => { this.gesolToken        = dado });
    storage.get('gesolNome')        .then(dado => { this.gesolNome         = dado });
    storage.get('gesolCPF')         .then(dado => { this.gesolCPF          = dado });
    storage.get('gesolFoto')        .then(dado => { this.gesolFoto         = dado });
    storage.get('gesolUserId')      .then(dado => { this.gesolUserId       = dado });

    // Solicitante

    storage.get('solicitante')      .then(dado => { this.solicitante       = dado });

    // Logado

    storage.get('logado')           .then(dado => { this.logado = dado });

    // Registrar uma função que será executada toda vez que o status da localização mudar
    this.diagnostic.registerLocationStateChangeHandler((arg) => {
      
      if(arg != this.diagnostic.locationMode.LOCATION_OFF){
        this.getLatLong();
      } else {
        this.temEndereco = false;
      }

    });

  }

  /////////////////////////////////////////////////////////////// Métodos Gerais

  ////// Logout
  // Apaga todos os dados relacionados ao usuário da storage

  logout()
  {
    this.setFbID(null);
    this.setFbToken(null);
    this.setFbUserEmail(null);
    this.setFbUserName(null);
    this.setFbUserPicture(null);
    this.setGesolCPF(null);
    this.setGesolFoto(null);
    this.setGesolNome(null);
    this.setGesolPassword(null);
    this.setGesolUserId(null);
    this.setGesolUserName(null);

    // Zerar o solicitante guardado na memória do celular
    this.storage.set('solicitante', null).then(() => {
      
      this.solicitante = null;

    });

    this.storage.set('gesolToken', null).then(()=>{

      this.storage.set('logado', false).then(()=>{
        this.logado = false;
      })

    });

  }

  /**
   * Obtém a latitude e longitude utilizando a API do google maps
   */

   getLatLong(nav? : NavController){

    // Retornar uma promessa
    return new Promise((resolve, reject) => {
  
      this.diagnostic.isLocationEnabled()
        .then(success => {
  
          // GPS está ativado e disponível, obter a localização normalmente
          if(success){
  
            // Obter a localização
            this.geolocation.getCurrentPosition()
            .then(resp => {
  
              this.lati = resp.coords.latitude;
              this.longi = resp.coords.longitude;

              // Chamada à API do Google
              this.http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+this.lati+","+this.longi+"&sensor=true&key=AIzaSyDcdW2PsrS1fbsXKmZ6P9Ii8zub5FDu3WQ")
                .map(res => res.json())
                .subscribe(data => {

                  let address = data.results[0];
                  // this.location = address.formatted_address;
  
                  // Separar os dados do endereço
                  this.endereco['numero']        = address.address_components[0].long_name;
                  this.endereco['logradouro']    = address.address_components[1].long_name;
                  this.endereco['bairro']        = address.address_components[2].long_name;
                  this.endereco['municipio']     = address.address_components[4].long_name;
                  this.endereco['uf']            = address.address_components[5].short_name;
                  this.endereco['latitude']      = this.lati;
                  this.endereco['longitude']     = this.longi;
  
                  this.temEndereco = true;

                  resolve(this.endereco);
  
                }, erro => {
  
                  console.log("CONFIG -> Erro da API do Google:", erro, new Date());
  
                })
  
            }, erro => {
  
              console.log("CONFIG -> Erro do MAPA:", erro, new Date());
  
            })
            .catch(erro => {
              
              console.log("CONFIG -> Erro na linha 143: ", erro, new Date());
  
            });
  
          } else {
  
            reject();
  
          }
  
        });

    });

   }

  /**
   * Recebe um objeto de usuário e atualiza todas as informações salvas no aplicativo atualmente usando os setters definidos
   * abaixo
   * @param dados Resposta do Laravel que contém o objeto do solicitante com endereço, telefones e user e também contem uma token de acesso
   */

  setSolicitante(dados:any){

    // Salvar na variável
    this.solicitante = dados.solicitante;
    
    this.setGesolCPF(dados.solicitante.cpf);
    this.setGesolNome(dados.solicitante.nome);
    this.setGesolFoto(dados.solicitante.foto);
    this.setGesolUserName(dados.solicitante.email);
    this.setGesolToken(dados.token.accessToken);
    this.setGesolUserId(dados.solicitante.id);

    // Salvar na Storage
    this.storage.set('solicitante', dados.solicitante);

  }

  getLogado(){
    return this.logado;
  }

  getRootUrl(){
    return this.root_url;
  }

  getSolicitante(){
    return this.solicitante;
  }
  
  /////////////////////////////////////////////////////////////// Falsos Getters

  // Retorna o nome do usuário na seguinte ordem: 
  // Gesol 
  // -> Facebook  
  // -> -> Sem Nome

  getUserName(){

    if(this.solicitante != null){
      return this.solicitante.nome;
    } else {
      return "";
    }
  }

  // Retorna o email do usuário na seguinte ordem: 
  // Gesol 
  // -> Facebook  
  // ->-> "teste@exemplo.com"

  getEmail(){

    // O username do Gesol é o email do usuário

    if(this.solicitante != null){
      return this.solicitante.email;
    } else {
      return "";
    }
  }

  // Retorna a foto do usuário na seguinte ordem: 
  // Gesol 
  // -> Facebook  
  // ->-> Avatar

  getFoto(){

    if(this.solicitante != null){
      return this.solicitante.foto;
    } else {
      return "../assets/img/blank.jpg";
    }
  }

  /////////////////////////////////////////////////////////////// Mètodos de Get
  // Simplesmente retornam o valor das variáveis

  //Facebook

  getFbUserName()       { return this.fbUserName;    }
  getFbUserPicture()    { return this.fbUserPicture; }
  getFbUserEmail()      { return this.fbUserEmail;   }
  getFbID()             { return this.fbID;          }
  getFbToken()          { return this.fbToken;       }

  // Gesol

  getGesolClientId()    { return this.gesolClientId;     }
  getGesolClientSecret(){ return this.gesolClientSecret; }
  getGesolUserName()    { return this.gesolUserName;     }
  getGesolPassword()    { return this.gesolPassword;     }
  getGesolToken()       { return this.gesolToken;        }
  getGesolNome()        { return this.gesolNome;         }
  getGesolCPF()         { return this.gesolCPF;          }
  getGesolFoto()        { return this.gesolFoto;         }
  getGesolUserId()      { return this.gesolUserId;       }


  /////////////////////////////////////////////////////////////// Mètodos de Set
  // Primeiro definem o valor da variável para ser acessada globalmente pelo App.
  // Após isso, guardam o valor da variável na storage do aplicativo.

  // Facebook

  setFbUserName(dado: string)    { this.fbUserName    = dado; this.storage.set("fbUserName", dado);    }
  setFbUserPicture(dado: string) { this.fbUserPicture = dado; this.storage.set("fbUserPicture", dado); }
  setFbUserEmail(dado: string)   { this.fbUserEmail   = dado; this.storage.set("fbUserEmail", dado);   }
  setFbID(dado: string)          { this.fbID          = dado; this.storage.set("fbID", dado);          }
  setFbToken(dado: string)       { this.fbToken       = dado; this.storage.set("fbToken", dado);       }

  // Gesol

  setGesolToken(dado: string)    { this.gesolToken    = dado; this.storage.set("gesolToken", dado);    }
  setGesolUserName(dado: string) { this.gesolUserName = dado; this.storage.set("gesolUserName", dado); }
  setGesolPassword(dado: string) { this.gesolPassword = dado; this.storage.set("gesolPassword", dado); }
  setGesolNome(dado:string)      { this.gesolNome     = dado; this.storage.set("gesolNome", dado);     }
  setGesolCPF(dado:string)       { this.gesolCPF      = dado; this.storage.set("gesolCPF", dado);      }
  setGesolFoto(dado: string)     { this.gesolFoto     = dado; this.storage.set("gesolFoto", dado);     }
  setGesolUserId(dado: number)   { this.gesolUserId   = dado; this.storage.set("gesolUserId", dado);   }

  // Logado

  setLogado(dado: boolean)   { this.logado   = dado; this.storage.set("logado", dado);   }

  /**
   * Gets e Sets das Solicitações
   */

  public getSolicitacoes(){
    return this.solicitacoes;
  }

  public setSolicitacoes(sol){
    this.solicitacoes = sol;
  }

  public getMinhasSolicitacoes(){
    return this.minhasSolicitacoes;
  }

  public setMinhasSolicitacoes(sol){
    this.minhasSolicitacoes = sol;
  }

  public getQtdSolicitacoes(){
    return this.solicitacoes.length;
  }

  // Cadastra uma nova mensagem no vetor de mensagens da solicitação especificada
  public novoComentario(solicitacao_id, comentario, pagina){

     // Encontar o índice da solicitação no array de solicitaçoes
    let indice = this.solicitacoes.findIndex(elem => {
      return elem.id == solicitacao_id;
    });

    // Caso a solicitação exista no Array
    if(indice >= 0){

      //Adicionar a nova mensagem no índice encontrado do vetor de solicitações
      this.solicitacoes[indice].comentarios.push({
        funcionario_id : null,
        comentario: comentario
      });

    }

    // Fazer o mesmo no array de minhas solicitações, apenas se ele já tiver sido carregado
    if(this.minhasSolicitacoes){

      // Encontar o índice da solicitação no array de MINHAS solicitaçoes
      indice = this.minhasSolicitacoes.findIndex(elem => {
        return elem.id == solicitacao_id;
      });

      // Caso a solicitação exista no Array
      if(indice >= 0){

        //Adicionar a nova mensagem no índice encontrado do vetor de solicitações
        this.minhasSolicitacoes[indice].comentarios.push({
          funcionario_id : null,
          comentario: comentario
        });

      }

    }

  }

  private aumentarTamanho(id){


    // Obter o tamanho da última mensagem enviada e a altura atual do container de mensagens
    // let altura_da_ultima = document.querySelectorAll("#"+id+" .mensagens_container:nth-last-of-type(1)")[0].scrollHeight;
    // let altura_atual = parseInt(document.getElementById(id).style.height);

    // Aumentar tamanho do container de mensagens
    // document.getElementById(id).style.height = altura_atual + altura_da_ultima + "px";

    document.getElementById(id).style.height = "auto";

  }

  /**
   * Recebe do GESOL um objeto comentário e o insere no array de comentários da solicitação correta
   * @param comentario Objeto Comentário recebido do Gesol em formato JSON
   */

  inserirComentario(comentario){

    console.log("Função inserirCOmentario");
    console.log("Comentário recebedio", comentario);

    // Encontrar os índices da solicitação nos dois vetores
    let indice1 = this.solicitacoes.findIndex(elem => { return elem.id == comentario.solicitacao_id });

    console.log("ìndice encontrado", indice1);

    // Adicionar o comentário nos arrays, caso os índices existam

    if(indice1 >= 0){

      console.log("indice é maior ou igual a zero");
      
      this.solicitacoes[indice1].comentarios.push(comentario);

      console.log("Array de comentários após adicionar", this.solicitacoes[indice1].comentarios);

      this.events.publish('updateScreen');

    }

    // Fazer o mesmo no vetor MinhasSolicitações apenas se ele já estiver preenchido

    if(this.minhasSolicitacoes){

      console.log("Entrou no inserir Comentários e está alterando minhasSolicitações");
      console.log("Comentário", comentario);

      let indice2 = this.minhasSolicitacoes.findIndex(elem => { return elem.id == comentario.solicitacao_id });

      console.log("Índice", indice2);
      
      if(indice2 >= 0){
  
        this.minhasSolicitacoes[indice2].comentarios.push(comentario);
        
        this.events.publish('updateScreen');
  
      }

    }

  }

  concatenarSolicitacoes(sol){

    this.solicitacoes.concat(sol);

  }

}
