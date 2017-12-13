import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { ConfigProvider } from "../providers/config/config";
import { FCM } from '@ionic-native/fcm';
import { GesolProvider } from '../providers/gesol/gesol';

// Fazer com que o TypeScript não sobrescreva a variável do google
declare var google;

@Component({
  templateUrl: 'app.html',
})
export class MyApp {

  // Para acessar o navController no app.component é necessário usar o @ViewChild()
  @ViewChild('content') nav: NavController;

  constructor(
      private platform: Platform, 
      statusBar: StatusBar, 
      splashScreen: SplashScreen, 
      public config: ConfigProvider,
      public menuController : MenuController,
      private fcm : FCM,
      public gesol : GesolProvider,
      public alertCtrl: AlertController) {

      platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        statusBar.overlaysWebView(false);
        statusBar.backgroundColorByHexString('#3d276b');
        splashScreen.hide();

        // Definir a home page como página inicial
        this.nav.setRoot(HomePage);

        this.verificarVersao();

        // Setar a token do FCM no ConfigProvider
        // Ela só será enviada para o servidor quando o usuário logar
        fcm.getToken().then(token => {

          this.config.FCM_ID = token;

        });

        // Quando a token do FCM expirar, outra é gerada automaticamente
        // Essa função é executada quando isso acontece
        fcm.onTokenRefresh().subscribe(token => {

          // Testar se o usuário está logado antes de tentar mudar a token dele no banco de dados
          if(this.config.getLogado())
            this.gesol.alteraFcmId(this.config.FCM_ID);
          

        });
        
        // Notificações FCM
        fcm.onNotification().subscribe( data => {

          console.log("Recebida do Firebase", data);

        });
        
      });
  }
  
  // Função que recebe uma página e navega para ela
  // A página deve ser uma das variáveis declaradas acima

  goToPage(pagina: string)
  {
    this.menuController.close();
    this.nav.push(pagina);
  }

  sair(){
      // Fechar o menu
      this.menuController.close();

      //Apagar todos os dados do armazenamento interno do telefone
      this.config.logout();

      // Desabilitar o menu
      this.menuController.enable(false);
  }

  estaLogado(){
    return this.config.getLogado()
  }

  naoEstaLogado(){
    return !this.config.getLogado();
  }

  verificarVersao(){

    this.gesol.verificaVersao().subscribe(res => {
      let resposta : any = res;

      if(resposta._body != this.config.versao){

        let alert = this.alertCtrl.create({
          title: "Atenção",
          subTitle: "Você está utilizando uma versão antiga do aplicativo. Entre em contato com o setor de TI para obter a versão mais recente",
          buttons: [{
            text: "Ok",
            handler: () => {
              this.platform.exitApp();
            }
          }]
        });

        alert.present();

      }
    })

  }

}

