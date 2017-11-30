import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, App, ViewController } from 'ionic-angular';
import { Geolocation } from "@ionic-native/geolocation";
import { Http } from "@angular/http";
import { GesolProvider } from "../../providers/gesol/gesol";
import { ConfigProvider } from "../../providers/config/config";
import { Diagnostic } from "@ionic-native/diagnostic";

// Fazer com que o TypeScript não sobrescreva a variável do google
declare var google;

/**
 * Generated class for the EscreverSolicitacaoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-escrever-solicitacao',
  templateUrl: 'escrever-solicitacao.html',
})
export class EscreverSolicitacaoPage {

  // Campos do formulário
  servico: string;
  texto: string;
  loading: any;

  // Informaçõs do Mapa  
  public endereco = [];
  location: any;
  lati: any;
  longi: any;
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  // Informações do Setor para o qual essa solicitação foi aberta
  imagem: any;
  setor: string;
  servicos = [];
  cor_setor: any;
  icone_setor: any;
  nome_setor: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private geolocation: Geolocation, 
              public http: Http,
              public gesol: GesolProvider,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public viewController: ViewController,
              public appCtrl: App,
              public diagnostic: Diagnostic,
              public config : ConfigProvider) {

    this.imagem = this.navParams.get('imagem');
    this.setor = this.navParams.get('setor');

  }

  ionViewDidLoad(){
    this.loadMap();
  }

  ionViewDidEnter(){

    // Obter todas as informações do setor

    this.getSetor(this.setor);

  }

  loadMap(){

    console.log("Chamou o LoadMap");
    console.log("Config nesse momento", this.config);

    //Testar se a localização já foi obtida pelo aplicativo

    if(this.config.temEndereco == false){
      console.log("O endereço ainda não foi obtido pelo config");
      // Chamar novamente essa mesma função até que a localização tenha sido obtida
      window.setTimeout(this.loadMap, 100);
    } else {

      console.log("O Endereço já foi obtido, prosseguindo");
      
      // Criar um objeto com as coordenadas do chamado
      let latLng = new google.maps.LatLng(this.config.lati, this.config.longi);

      // Salvar o endereço em uma propriedade desta classe
      this.endereco = this.config.endereco;
    
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
  
      // Criar o mapa
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  
      // Adicionar um marcador central
  
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter()
      });

    }

  }

  // Obtém as informações necessárias para mostrar o setor

  getSetor(id){
    
    // Obter a cor e o ícone do setor
    this.gesol.getSetor(this.setor).subscribe(
      
      res => {
        this.cor_setor = res.cor;
        this.icone_setor = res.icone;
        this.nome_setor = res.nome;
      }

    )
    
    // Obter todos os serviços desse setor
    this.gesol.getServicos(this.setor).subscribe(
      res => {

        this.servicos = res;

        // Selecionar o primeiro servico desse setor
        this.servico = this.servicos[0].id;

      }
    );
  }

  /**
   * Enviar a solicitação para o Gesol
   */

  gravaSolicitacao(){

    this.abrirLoading();

    this.gesol.enviaSolicitacao(this.imagem, this.servico, this.texto, this.endereco).subscribe(
      
      // Caso de sucesso
      res => {

        this.fecharLoading();

        // Navegar de volta para a página inicial

        // Criar o alerta com os erros
        let alert = this.alertCtrl.create({
          title: "Parabéns!",
          subTitle: "Sua solicitação foi enviada e em breve será analisada pela Prefeitura. Acompanhe o andamento do seu atendimento na página 'Minhas Solicitações' no menu principal.",
          buttons: [
            {
              text: "Ok",
              handler: () => {

                this.navCtrl.popToRoot();

              }
            }
          ]
        });

        // Mostrar o aleta
        alert.present();

      },

      // Caso de falha
      erro => {

        this.fecharLoading();

        let erros = JSON.parse(erro._body);

        // Variável com as mensagens de erro concatenadas
        let mensagens = "";

        // Popular as mensagens de erro
        for(let campo in erros){
          if(erros.hasOwnProperty(campo)){
            mensagens += erros[campo][0] + "<br>";
          }
        }

        // Criar o alerta com os erros
        let alert = this.alertCtrl.create({
          title: "Atenção",
          subTitle: mensagens,
          buttons: ['ok']
        });

        // Mostrar o aleta
        alert.present();

      }

    );

  }

  voltar(){
    this.navCtrl.pop();
  }

  /**
   * Abrir o gif de Loading
   */

  abrirLoading(){
    
    this.loading = this.loadingCtrl.create({
      content: "Carregando..."
    });

    this.loading.present();

  }

  fecharLoading(){

    this.loading.dismiss();

  }

}