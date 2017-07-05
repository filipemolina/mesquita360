import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AtendimentoPage } from "../atendimento/atendimento";

/**
 * Generated class for the ChamadosPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-chamados',
  templateUrl: 'chamados.html',
})
export class ChamadosPage {

  public sol = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    // Popular o array de solicitações

    this.sol.push({
      numero: 1001,
      status: 2,
      secretaria: "Sec. Mun. de Meio Ambiente e Agricultura",
      imagem: "img/buraco.jpg",
      texto: "Buraco na Avenida União",
      mensagens: [{
        user_id: 2,
        texto: "Bom dia, em que ponto da Avenida União está o buraco?",
        created_at: "10:03"
      }, {
        user_id: 1,
        texto: "Próximo à Igreja do Nazareno",
        created_at: "10:31"
      },{
        user_id: 2,
        texto: "Muito obrigado, o reparo será feito até amanhã as 17:00hs. Obrigado por colaborar para fazer de Mesquita uma cidade melhor!",
        created_at: "10:32",
      }]
    });

    this.sol.push({
      numero: 1384,
      status: 1,
      secretaria: "Secretaria de Meio Ambiente",
      imagem: "img/arvore.jpg",
      texto: "Árvore caída na rua Júlio Macedo",
      mensagens: [{
        user_id: 2,
        texto: "Boa tarde, essa árvore se encontra em terreno particular ou em via pública?",
        created_at: "10:03"
      },{
        user_id: 1,
        texto: "Em terrno particular que pertence à mim",
        created_at: "10:41",
      }]
    });

    this.sol.push({
      numero: 1425,
      status: 0,
      secretaria: "Secretaria de Obras",
      imagem: "img/buraco.jpg",
      texto: "Buraco aberto na rua da minha casa...",
      mensagens: [{
        user_id: 2,
        texto: "Bom dia, poderia por favor informar o nome da rua e o número da sua casa?",
        created_at: "10:03"
      }]
    });

  }

  ionViewDidLoad() {
    console.log(this.sol);
  }

  detalhes(id: number)
  {
    // Ir para a pagina de detalhes do Atendimento

    this.navCtrl.push(AtendimentoPage, this.sol[id]);
  }

}
