import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ConfigProvider } from "../../providers/config/config";
import { GesolProvider } from "../../providers/gesol/gesol";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  public solicitacoes: Array<any>;
  public meses = [];

  constructor(public navCtrl: NavController,
              public config: ConfigProvider,
              public gesol: GesolProvider) {

      // Inicializar o array de meses

      this.meses[1] ="Janeiro";
      this.meses[2] = "Fevereiro";
      this.meses[3] = "Março";
      this.meses[4] = "Abril";
      this.meses[5] = "Maio";
      this.meses[6] = "Junho";
      this.meses[7] = "Julho";
      this.meses[8] = "Agosto";
      this.meses[9] = "Setembro";
      this.meses[10] = "Outubro";
      this.meses[11] = "Novembro";
      this.meses[12] = "Dezembro";
    
      this.gesol.getSolicitacoes().subscribe(res => {
                
                    // Preencher a variável de solicitações

                    this.solicitacoes = res;

                    for(let item in this.solicitacoes){

                      // Criar um objeto de Data com a propriedade created_at do item

                      let data = new Date(this.solicitacoes[item].created_at);

                      // Formatar a data para um formato legível para seres humands

                      this.solicitacoes[item].data = data.getDate() + " de " + this.meses[data.getMonth()] + " de " + data.getFullYear();

                    }
                
                }, fail => { console.log("Falhou"); console.log(fail); })
  }

}