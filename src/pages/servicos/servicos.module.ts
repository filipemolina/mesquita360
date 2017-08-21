import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServicosPage } from './servicos';

@NgModule({
  declarations: [
    ServicosPage,
  ],
  imports: [
    IonicPageModule.forChild(ServicosPage),
  ],
  exports: [
    ServicosPage
  ]
})
export class ServicosPageModule {}
