import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EscreverSolicitacaoPage } from './escrever-solicitacao';

@NgModule({
  declarations: [
    EscreverSolicitacaoPage,
  ],
  imports: [
    IonicPageModule.forChild(EscreverSolicitacaoPage),
  ],
  exports: [
    EscreverSolicitacaoPage
  ]
})
export class EscreverSolicitacaoPageModule {}
