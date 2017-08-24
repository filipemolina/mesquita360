import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelecionarServicoPage } from './selecionar-servico';

@NgModule({
  declarations: [
    SelecionarServicoPage,
  ],
  imports: [
    IonicPageModule.forChild(SelecionarServicoPage),
  ],
  exports: [
    SelecionarServicoPage
  ]
})
export class SelecionarServicoPageModule {}
