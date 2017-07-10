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
    this.auth.getToken();
  }

  logarFacebook()
  {
    // Tentar logar no facebook usando a biblioteca nativa

    this.fb.login(['public_profile','user_birthday', 'user_hometown', 'user_location', 'email'])

      // Caso o login suceda

      .then((res: FacebookLoginResponse) => {

        // Armazenar a id do Usuário e o token de acesso

        this.userID = res.authResponse.userID;
        this.token = res.authResponse.accessToken;

        // Fazer a chamada para a Graph API para obter os dados do usuário

        this.fb.api("/" + this.userID + "?fields=id,name,email,picture,birthday,location,hometown",
                 ['public_profile','user_birthday', 'user_hometown', 'user_location', 'email'])

          .then(resultado => {

            // Alterar as informações do usuário no aplicativo
            this.config.setUserEmail(resultado.email);
            this.config.setUserName(resultado.name);
            this.config.setUserPicture(resultado.picture.data.url);

            // Definir a tela inicial como a tela de solicitações
            this.navCtrl.setRoot(HomePage);

            // Ir para a tela inicial
            this.entrar();

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

  entrar()
  {
    // Obter a token de acesso do sistema e gravar nas configurações apenas quando o resultado estiver disponível

    this.auth.getToken().subscribe(res => {

      // Gravar a token no ConfigProvider

      this.config.setAccessToken(res.access_token);
    
    });
  }

}
