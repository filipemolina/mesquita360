import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import { HomePage } from "../home/home";
import { HttpModule } from "@angular/http";

@NgModule({
  declarations: [
    LoginPage,
    HomePage
  ],
  imports: [
    HttpModule,
    IonicPageModule.forChild(LoginPage),
  ],
  exports: [
    LoginPage,
  ]
})
export class LoginPageModule {}
