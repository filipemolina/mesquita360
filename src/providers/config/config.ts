import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import 'rxjs/add/operator/map';
import { NavController, AlertController } from 'ionic-angular';
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

  // Rota Raiz da Aplicação
  private root_url = "https://360.mesquita.rj.gov.br/gesol";  

  // Objeto que guarda todas as informações do solicitante

  public solicitante:any = {};

  // Chave da API do Google Maps

  public MapsApiKey: string = "AIzaSyDcdW2PsrS1fbsXKmZ6P9Ii8zub5FDu3WQ";
  public lati: any;
  public longi: any;
  public endereco : any[] = [];
  public temEndereco: boolean = false;

  // Credenciais e Info do Facebook
  
  private fbUserPicture:     string;
  private fbUserName:        string;
  private fbUserEmail:       string;
  private fbID:              string;
  private fbToken:           string;

  // Credenciais e Info do Gesol

  private gesolClientId:     number = 1;
  private gesolClientSecret: string = "S45SAbHuHkI9n1TwAOvU1zVbrOifXT3lD7YVGVoN";
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
              public alertCtrl: AlertController) {

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
   * Obtém a latitude e longitude utilizando a API do google maps
   */

   getLatLong(){

    console.log("Chamou a GetLatLong");

    this.diagnostic.isLocationEnabled()
      .then(success => {

        console.log("Chamou isLocationEnabled");

        // GPS está ativado e disponível, obter a localização normalmente
        if(success){

          console.log("GPS Está ativo e disponível");

          // Obter a localização
          this.geolocation.getCurrentPosition()
          .then(resp => {

            console.log("Obteve a localização atual");

            this.lati = resp.coords.latitude;
            this.longi = resp.coords.longitude;
            console.log("Inciando chamada do Google...");
            // Chamada à API do Google
            this.http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+this.lati+","+this.longi+"&sensor=true&key=AIzaSyDcdW2PsrS1fbsXKmZ6P9Ii8zub5FDu3WQ")
              .map(res => res.json())
              .subscribe(data => {
                console.log("Resultado da chamada ao google", data);
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

                console.log("Obteve o endereço:", this.endereco, this.temEndereco);

              }, erro => {

                console.log("Erro da API do Google:", erro);

              })

          }, erro => {

            console.log("Erro do MAPA:", erro);

          })
          .catch(erro => {
            
            console.log("Erro na linha 143: ", erro);

          });

        } else {

          // Criar o alerta com os erros
          let alert = this.alertCtrl.create({
            title: "Atenção",
            subTitle: 'O Aplicativo Mesquita 360º precisa obter a sua localização atual para enviar a sua solicitação. Por favor, habilite o GPS de seu aparelho e tente novamente.',
            buttons: [{
              text: "Ok",
              handler: () => {

                this.diagnostic.switchToLocationSettings();

              }
            },
            {
              text: 'Cancelar',
              role: 'cancel'
            }]
          });

          // Mostrar o aleta
          alert.present();

        }

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
