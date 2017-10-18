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

// TODO: Configurar o Lazy Loading em todas os componentes (*.ts), retirar a importação e usar apenas
// o nome da página como uma string, 'LoginPage' por exemplo.