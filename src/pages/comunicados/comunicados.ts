import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GesolProvider } from '../../providers/gesol/gesol';
import { ConfigProvider } from '../../providers/config/config';

/**
 * Generated class for the ComunicadosPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-comunicados',
  templateUrl: 'comunicados.html',
})
export class ComunicadosPage {

  datas:any = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public gesol: GesolProvider,
    public config: ConfigProvider) {

  }

  ionViewDidEnter() {
    
    this.gesol.getComunicados().subscribe(res => {
      
      this.config.setComunicados(res);

      for(let i = 0; i < this.config.getComunicados().length; i++){
        
        let data = new Date(this.config.getComunicados()[i].created_at);
  
        this.datas[this.config.getComunicados()[i].id] = data.getUTCDay() + "/" + data.getUTCMonth() + "/" + data.getUTCFullYear() + " " + data.getUTCHours()+":"+data.getUTCMinutes();
  
      }

    });

    console.log("Datas", this.datas);

  }

  formatarData(data){

    // Dividir os elementos da data
    let t = data.split(/[- :]/);

    return t[2] + "/" + t[1] + "/" + t[0] + " " + t[3] + ":" + t[4] + ":" + t[5];

  }

}
