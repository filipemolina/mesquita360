import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GesolProvider } from "../../providers/gesol/gesol";

/**
 * Generated class for the ServicosPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-servicos',
  templateUrl: 'servicos.html',
})
export class ServicosPage {

  public imagem: string;
  public setores = [];
  public cores = {
    1: '',
    2: 'preto',
    3: 'laranja',
    4: 'verde',
    5: 'azul',
    6: 'vermelho',
    7: 'branco',
    8: 'secondary',
    9: 'cinza',
    10: 'rosa',
    11: 'verde',
    12: 'secondary',
    13: '',
    14: 'preto',
    15: 'laranja',
    16: 'verde',
    17: 'azul',
    18: 'vermelho',
    19: 'branco',
};

  constructor(public navCtrl: NavController, public navParams: NavParams, public gesol: GesolProvider) {
    
    //Obter a imagem nos parâmetros
    this.imagem = this.navParams.get('imagem');

    // Obter a lista de setores do servidor
    this.gesol.getSetores().subscribe(
      // Sucesso
      res => {

        this.setores = res;
        console.log(this.setores);

      },

      // Falha

      fail => {

        console.log("Erro");
        console.log(fail);

      }
    );
  }

}
