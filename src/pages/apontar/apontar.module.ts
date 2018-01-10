import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ApontarPage } from './apontar';

@NgModule({
  declarations: [
    ApontarPage,
  ],
  imports: [
    IonicPageModule.forChild(ApontarPage),
  ],
  exports: [
    ApontarPage
  ]
})
export class ApontarPageModule {}
