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

  public id : number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
    // Obter o id enviado através do navController usando navParams
    this.id = this.navParams.get('id');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AtendimentoPage');
  }

}
