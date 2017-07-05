import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AtendimentoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-atendimento',
  templateUrl: 'atendimento.html',
})
export class AtendimentoPage {

  public solicitacao;
  public classes: any = { 
    'danger'  : false,
    'warning' : false,
    'success' : false,
  };
  public status;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
    // Obter o id enviado através do navController usando navParams
    this.solicitacao = this.navParams.data;

    // Decidir qual classe utilizar dependendo do status

    if(this.solicitacao.status == 0)
    {
      this.classes.danger = true;
      this.status = "Solicitação Criada";
    }
    else if(this.solicitacao.status == 1)
    {
      this.classes.warning = true;
      this.status = "Analisando Solicitação";
    }
    else if(this.solicitacao.status == 2)
    {
      this.classes.success = true;
      this.status = "Solicitação Fechada";
    }

  }

  ionViewDidLoad() {

  }

}
