import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigProvider } from "../../providers/config/config";
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook";
import { HomePage } from "../home/home";
import { AuthProvider } from "../../providers/auth/auth";

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  rootPage: any = HomePage;
  userID: string;
  token: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public config: ConfigProvider, 
              private fb: Facebook,
              public auth: AuthProvider) {}

  IonViewDidLoad()
  {
    this.auth.getGesolToken();
  }

  logarFacebook()
  {
    // Tentar logar no facebook usando a biblioteca nativa

    this.fb.login(['public_profile','user_birthday', 'user_hometown', 'user_location', 'email'])

      // Caso o login suceda

      .then((res: FacebookLoginResponse) => {

        // Armazenar a id do Usuário e o token de acesso

        this.config.setFbID(res.authResponse.userID);
        this.config.setFbToken(res.authResponse.accessToken);

        // Fazer a chamada para a Graph API para obter os dados do usuário

        this.fb.api("/" + this.config.fbID + "?fields=id,name,email,picture,birthday,location,hometown",
                 ['public_profile','user_birthday', 'user_hometown', 'user_location', 'email'])

          .then(resultado => {

            // Alterar as informações do usuário no aplicativo
            this.config.setFbEmail(resultado.email);
            this.config.setFbUserName(resultado.name);
            this.config.setFbUserPicture(resultado.picture.data.url);

            // Enviar a token do Facebook para o Gesol, que verifićará se o usuário existe ou não e retornará um objeto com 
            // username e senha

            this.auth.getGesolUser().subscribe(res => {

              // this.config.setGesolUsername(res.username);
              // this.config.setGesolPassword(res.password);

              console.log("Facebook");
              console.log(res);

            });

            // Obter a token de acesso do Gesol e gravar nas configurações apenas quando o resultado estiver disponível

            this.auth.getGesolToken().subscribe(res => {

              // Gravar a token no ConfigProvider

              this.config.setGesolToken(res.access_token);

              // Nesse ponto, todas as informações necessárias para logar o usuário ou criá-lo no banco do Gesol
              // já estão disponíveis no ConfigProvider.

              // Realizar a chamada para o Gesol criar um usuário ou logar o usuário atual
            
            });

          })
          .catch(e => { 
            console.log("Erro:");
            console.log(e);
          });

      })

      // Caso falhe

      .catch(e => console.log("Login Falhou", e));
  }

  logout()
  {
    this.fb.logout();
  }

  getGesolToken()
  {
    // Obter a token de acesso do Gesol e gravar nas configurações apenas quando o resultado estiver disponível

    this.auth.getGesolToken().subscribe(res => {

      // Gravar a token no ConfigProvider

      this.config.setGesolToken(res.access_token);
    
    });
  }

}
