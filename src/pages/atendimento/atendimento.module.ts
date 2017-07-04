import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AtendimentoPage } from './atendimento';

@NgModule({
  declarations: [
    AtendimentoPage,
  ],
  imports: [
    IonicPageModule.forChild(AtendimentoPage),
  ],
  exports: [
    AtendimentoPage
  ]
})
export class AtendimentoPageModule {}
