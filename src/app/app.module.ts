import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { CloudSettings, CloudModule } from "@ionic/cloud-angular";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ChamadosPage } from "../pages/chamados/chamados";
import { AtendimentoPage } from "../pages/atendimento/atendimento";
import { LoginPage } from "../pages/login/login";
import { ConfigProvider } from '../providers/config/config';
import { HttpModule } from "@angular/http";
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook";
import { AuthProvider } from '../providers/auth/auth';

const cloudSettings : CloudSettings = {
  'core' : {
    'app_id' : '281455835652510'
  }
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ChamadosPage,
    AtendimentoPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ChamadosPage,
    AtendimentoPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ConfigProvider,
    HttpModule,
    Facebook,
    AuthProvider
  ]
})
export class AppModule {}
