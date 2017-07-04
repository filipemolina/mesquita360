import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChamadosPage } from './chamados';

@NgModule({
  declarations: [
    ChamadosPage,
  ],
  imports: [
    IonicPageModule.forChild(ChamadosPage),
  ],
  exports: [
    ChamadosPage
  ]
})
export class ChamadosPageModule {}
