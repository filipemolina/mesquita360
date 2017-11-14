import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditarPerfilPage } from './editar-perfil';
import { InputMask } from "../../directives/InputMask/InputMask";
import { BrMaskerModule } from 'brmasker-ionic-3';

@NgModule({
  declarations: [
    EditarPerfilPage,
    InputMask
  ],
  imports: [
    IonicPageModule.forChild(EditarPerfilPage),
    BrMaskerModule
  ],
  exports: [
    EditarPerfilPage
  ]
})
export class EditarPerfilPageModule {}
