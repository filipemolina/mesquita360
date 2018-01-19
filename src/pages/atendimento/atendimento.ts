import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigProvider } from "../../providers/config/config";
import { GesolProvider } from "../../providers/gesol/gesol";

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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public config: ConfigProvider,
              public gesol: GesolProvider) {
    
    // Obter o id enviado através do navController usando navParams
    this.solicitacao = this.navParams.data.solicitacao;

  }

  ionViewDidLoad() {

    console.log("Solicitações no config", this.config.getSolicitacoes());
    console.log("Solicitação selecionada", this.solicitacao);

    this.gesol.showSolicitacao(this.solicitacao).subscribe(sol => {

      console.log("Solicitação recebida do Gesol", sol);

    });

  }

}
