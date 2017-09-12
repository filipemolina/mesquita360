import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, AlertController, LoadingController, App, ViewController } from 'ionic-angular';
import { Geolocation } from "@ionic-native/geolocation";
import { Http } from "@angular/http";
import { GesolProvider } from "../../providers/gesol/gesol";
import { HomePage } from "../home/home";

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
              public appCtrl: App) {
    
    this.obtemLocalizacao();

    this.imagem = this.navParams.get('imagem');
    this.setor = this.navParams.get('setor');

    // Obter todas as informações do setor

    this.getSetor(this.setor);

  }

  obtemLocalizacao(){

    this.abrirLoading();

    // Obter a localização
    this.geolocation.getCurrentPosition()
    .then(resp => {

      this.lati = resp.coords.latitude;
      this.longi = resp.coords.longitude;

      // Chamada à API do Google
      this.http.get("http://maps.googleapis.com/maps/api/geocode/json?latlng="+this.lati+","+this.longi+"&sensor=true")
        .map(res => res.json())
        .subscribe(data => {
          let address = data.results[0];
          this.location = address.formatted_address;

          // Separar os dados do endereço
          this.endereco['numero']        = address.address_components[0].long_name;
          this.endereco['logradouro']    = address.address_components[1].long_name;
          this.endereco['bairro']        = address.address_components[2].long_name;
          this.endereco['municipio']     = address.address_components[4].long_name;
          this.endereco['uf']            = address.address_components[5].short_name;
          this.endereco['latitude']      = this.lati;
          this.endereco['longitude']     = this.longi;

          console.log("Endereco do objeto ", this.endereco);

          // Montar o Mapa
          this.loadMap();

        })

    })
    .catch(erro => {
      console.log("Erro do Maps: ", erro);
    });
  }

  loadMap(){

    // Criar um objeto com as coordenadas do chamado
    let latLng = new google.maps.LatLng(this.lati, this.longi);

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

    this.fecharLoading();

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

        this.viewController.dismiss();
        this.appCtrl.getRootNav().popToRoot();

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
