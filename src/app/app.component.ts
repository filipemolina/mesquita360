import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ConfigProvider } from "../providers/config/config";

@Component({
  templateUrl: 'app.html',
})
export class MyApp {

  // Para acessar o navController no app.component é necessário usar o @ViewChild()
  @ViewChild('content') nav: NavController;

  constructor(
      platform: Platform, 
      statusBar: StatusBar, 
      splashScreen: SplashScreen, 
      public config: ConfigProvider,
      public menuController : MenuController) {

      platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        statusBar.overlaysWebView(false);
        statusBar.backgroundColorByHexString('#3d276b');
        splashScreen.hide();

        // Definir a home page como página inicial
        this.nav.setRoot(HomePage);

      
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
      this.config.logout(this.nav);

      // Desabilitar o menu
      this.menuController.enable(false);
  }

  estaLogado(){
    return this.config.getLogado()
  }

  naoEstaLogado(){
    return !this.config.getLogado();
  }

}

