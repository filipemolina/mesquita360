import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ChamadosPage } from '../pages/chamados/chamados';
import { LoginPage } from '../pages/login/login';
import { ConfigProvider } from "../providers/config/config";

@Component({
  templateUrl: 'app.html',
})
export class MyApp {

  // Para acessar o navController no app.component é necessário usar o @ViewChild()
  @ViewChild('content') nav: NavController;

  // Páginas que serão navegadas através do Menu Principal
  // rootPage:any = HomePage;
  chamadosPage: any = ChamadosPage;
  loginPage: any = LoginPage;

  constructor(
      platform: Platform, 
      statusBar: StatusBar, 
      splashScreen: SplashScreen, 
      public config: ConfigProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // Ir para a página de login (Caso o usuário não esteja logado)
      if(this.config.gesolToken == null)
      {
        console.log("GesolToken é nula");
        this.nav.setRoot(LoginPage);
      }
      else{
        console.log("Gesol Token não é nula, ir direto para a HomePage");
        this.nav.setRoot(HomePage);
      }
        
    });
  }
  
  // Função que recebe uma página e navega para ela
  // A página deve ser uma das variáveis declaradas acima

  goToPage(pagina: any)
  {
    this.nav.push(pagina);
  }
}

