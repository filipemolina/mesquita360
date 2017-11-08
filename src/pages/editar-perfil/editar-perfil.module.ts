import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditarPerfilPage } from './editar-perfil';
import { InputMask } from "../../directives/InputMask/InputMask";

@NgModule({
  declarations: [
    EditarPerfilPage,
    InputMask
  ],
  imports: [
    IonicPageModule.forChild(EditarPerfilPage),
  ],
  exports: [
    EditarPerfilPage
  ]
})
export class EditarPerfilPageModule {}
