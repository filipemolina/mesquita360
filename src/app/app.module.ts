import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { CloudSettings, CloudModule } from "@ionic/cloud-angular";
import { IonicStorageModule } from "@ionic/storage";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ChamadosPage } from "../pages/chamados/chamados";
import { AtendimentoPage } from "../pages/atendimento/atendimento";
import { LoginPage } from "../pages/login/login";
import { ConfigProvider } from '../providers/config/config';
import { HttpModule } from "@angular/http";
import { Facebook } from "@ionic-native/facebook";
import { AuthProvider } from '../providers/auth/auth';
import { RegisterPage } from "../pages/register/register";
import { Mask } from '../directives/mask/mask';
import { TextMaskModule } from 'angular2-text-mask';
import { GesolProvider } from '../providers/gesol/gesol';
import { ServicosPage } from "../pages/servicos/servicos";

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
    LoginPage,
    RegisterPage,
    Mask,
    ServicosPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings),
    IonicStorageModule.forRoot(),
    TextMaskModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ChamadosPage,
    AtendimentoPage,
    LoginPage,
    RegisterPage,
    ServicosPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ConfigProvider,
    HttpModule,
    Facebook,
    AuthProvider,
    GesolProvider
  ]
})
export class AppModule {}
