import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { ConfigProvider } from "../../providers/config/config";
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook";
import { HomePage } from "../home/home";
import { AuthProvider } from "../../providers/auth/auth";
// import { RegisterPage } from "../register/register";
import { GesolProvider } from "../../providers/gesol/gesol";
import { AlertController, MenuController } from 'ionic-angular';

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

  // Campos da tela
  email: string;
  senha: string;

  constructor(public navCtrl: NavController, 
              public alertCtrl: AlertController,
              public config: ConfigProvider, 
              private fb: Facebook,
              public auth: AuthProvider,
              public gesol: GesolProvider,
              public menu: MenuController) {}

  cadastrar(){
    this.navCtrl.push('RegisterPage');
  }

  entrar(){

    // Fazer a chamada para a função de login do GesolProvider

    this.gesol.login(this.email, this.senha).subscribe(
      
      // Caso o login seja feito com sucesso

      res => {

        // Preencher as informações básicas do usuário

        this.config.setSolicitante(res);
        this.config.setLogado(true);

        // Tornar a homepage o novo Root
        this.navCtrl.setRoot(HomePage);

      },

      // Caso haja um erro

      err => {

        console.log("Erro!");
        console.log(err);

        // Objeto com todos os erros
        let erros = JSON.parse(err._body);

        console.log("Erros!");
        console.log(erros);

        let mensagem: string = "";

        // Iterar pelas propriedades do objeto com os erros
        for(var campo in erros){
          if(erros.hasOwnProperty(campo)){

            // Montar uma variável com todas as mensagens de erro
            mensagem += erros[campo][0] + "<br>";

          }
        }

        // Criar um alerta com as mensagens de erro concatenadas
        let alert = this.alertCtrl.create({
          title: "Atenção!",
          subTitle: mensagem,
          buttons: ['OK']
        });

        // Mostrar o alerta
        alert.present();

      }
    );
  }

  logarFacebook()
  {
    // Tentar logar no facebook usando a biblioteca nativa

    this.fb.login(['public_profile','email'])

      // Caso o login suceda

      .then((res: FacebookLoginResponse) => {

        // Armazenar a id do Usuário e o token de acesso

        this.config.setFbID(res.authResponse.userID);
        this.config.setFbToken(res.authResponse.accessToken);

        // Fazer a chamada para a Graph API para obter os dados do usuário

        this.fb.api("/" + res.authResponse.userID + "?fields=id,name,email,picture",
                 ['public_profile','email'])

          .then(resultado => {

            // Alterar as informações do usuário no aplicativo
            this.config.setFbUserEmail(resultado.email);
            this.config.setGesolUserName(resultado.email);
            this.config.setFbUserName(resultado.name);
            this.config.setFbUserPicture(resultado.picture.data.url);

            // Enviar a token do Facebook para o Gesol, que verifićará se o usuário existe ou não e retornará um objeto com 
            // username e senha

            this.auth.getGesolUser(
              resultado.email,
              resultado.name,
              resultado.picture.data.url,
              resultado.email,
              res.authResponse.accessToken,
              res.authResponse.userID).subscribe(res => {


              // Gravar os dados recebidos no ConfigProvider
              this.config.setGesolToken(res.token.accessToken);
              this.config.setLogado(true);
              this.config.setSolicitante(res);

              console.log("Config após atualização dos dados");
              console.log(this.config);

              // Redirecionar para a página principal
              this.navCtrl.setRoot(HomePage);

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

  voltarHome(){
    this.navCtrl.popToRoot();
  }

}
