import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditarPerfilPage } from './editar-perfil';
import { Crop } from "@ionic-native/crop";

@NgModule({
  declarations: [
    EditarPerfilPage,
  ],
  imports: [
    IonicPageModule.forChild(EditarPerfilPage),
    Crop
  ],
  exports: [
    EditarPerfilPage
  ]
})
export class EditarPerfilPageModule {}
