import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterPage } from './register';
import { BrMaskerModule } from 'brmasker-ionic-3';

@NgModule({
  declarations: [
    RegisterPage
  ],
  imports: [
    IonicPageModule.forChild(RegisterPage),
    BrMaskerModule
  ],
  exports: [
    RegisterPage
  ]
})
export class RegisterPageModule {}
