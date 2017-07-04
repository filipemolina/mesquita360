import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ChamadosPage } from '../pages/chamados/chamados';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  
  @ViewChild('content') nav: NavController;
  rootPage:any = HomePage;
  chamadosPage: any = ChamadosPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  // Função que recebe uma página e navega para ela
  // A página deve ser uma das variáveis declaradas acima

  goToPage(pagina: any)
  {
    this.nav.push(pagina);
  }
}

