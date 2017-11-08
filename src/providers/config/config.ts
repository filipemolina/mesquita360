import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import 'rxjs/add/operator/map';
import { NavController } from 'ionic-angular';

/*
  Generated class for the ConfigProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ConfigProvider {

  // Rota Raiz da Aplicação
  private root_url = "https://360.mesquita.rj.gov.br/gesol";  

  // Objeto que guarda todas as informações do solicitante

  public solicitante:any = {};

  // Chave da API do Google Maps

  public MapsApiKey: string = "AIzaSyDcdW2PsrS1fbsXKmZ6P9Ii8zub5FDu3WQ";

  // Credenciais e Info do Facebook
  
  private fbUserPicture:     string;
  private fbUserName:        string;
  private fbUserEmail:       string;
  private fbID:              string;
  private fbToken:           string;

  // Credenciais e Info do Gesol

  private gesolClientId:     number = 1;
  private gesolClientSecret: string = "yFuZ78ogEjwVXXGXkfp1N8yncIwqxk2OzDfESwpC";
  private gesolUserName:     string;
  private gesolPassword:     string;
  private gesolToken:        string;
  private gesolNome:         string;
  private gesolCPF:          string;
  private gesolFoto:         string;
  private gesolUserId:       number;

  private logado:            boolean;

  constructor(private storage: Storage) {

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

  }

  /////////////////////////////////////////////////////////////// Métodos Gerais

  ////// Logout
  // Apaga todos os dados relacionados ao usuário da storage

  logout(nav: NavController)
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

    this.storage.set('gesolToken', null).then(()=>{

      this.storage.set('logado', false).then(()=>{
        this.logado = false;
      })

    });

  }

  /**
   * Recebe um objeto de usuário e atualiza todas as informações salvas no aplicativo atualmente usando os setters definidos
   * abaixo
   * @param usuario Objeto que contem todas as informações do usuário no padrão Laravel, incluindo endereço e telefones
   */

  setSolicitante(usuario:any){

    // Salvar na variável
    this.solicitante = usuario.solicitante;
    
    this.setGesolCPF(usuario.solicitante.cpf);
    this.setGesolNome(usuario.solicitante.nome);
    this.setGesolFoto(usuario.solicitante.foto);
    this.setGesolUserName(usuario.solicitante.email);
    this.setGesolToken(usuario.token.accessToken);
    this.setGesolUserId(usuario.solicitante.id);

    // Salvar na Storage
    this.storage.set('solicitante', usuario.solicitante);

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

}
