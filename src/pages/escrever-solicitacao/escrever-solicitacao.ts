import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, App, ViewController, Events } from 'ionic-angular';
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
  marker:any;

  // Informações do Setor para o qual essa solicitação foi aberta
  imagem: any;
  setor: string;
  servicos = [];
  cor_setor: any;
  icone_setor: any;
  nome_setor: string;
  eu:any;

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
              public config : ConfigProvider,
              public events: Events) {

    this.imagem = this.navParams.get('imagem');
    this.setor = this.navParams.get('setor');

    // Caso o endereço não esteja disponível, tentar carregar novamente quando isso acontecer
    this.events.subscribe('carregarMapa', () => {
      console.log("Ouviu o evento Carregar Mapa");
      this.loadMap();
    });

    this.events.subscribe('centralizarMapa', () => {

      this.centralizar(new google.maps.LatLng(this.config.lati, this.config.longi));

    });

  }

  ionViewDidLoad(){

    // Tentar carregar o mapa no carregamento desta página...
    this.loadMap();
  }

  ionViewDidEnter(){

    // Obter todas as informações do setor

    this.getSetor(this.setor);
    this.loadMap();

  }

  apontar(){
    this.navCtrl.push("ApontarPage");
  }

  loadMap(){

    //Testar se a localização já foi obtida pelo aplicativo

    if(this.config.temEndereco){

      this.events.publish('centralizarMapa');
      
      // Criar um objeto com as coordenadas do chamado
      let latLng = new google.maps.LatLng(this.config.lati, this.config.longi);

      console.log("LATLNG", this.config.lati, this.config.longi);

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
  
      this.marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter()
      });

    } else {
      console.log("A Config não tem Endereço");
    }

  }

  obterEnderecoECarregarMapa(){

    let loading = this.loadingCtrl.create({
      content: "Obtendo localização..."
    });

    loading.present();

    console.log("Não tinha endereço, precisou chamar a função com nome ridiculamente longo");
    
    // Obter a localização
    this.geolocation.getCurrentPosition()
    .then(resp => {

      console.log("CONFIG -> Obteve a localização atual", new Date());

      this.lati = resp.coords.latitude;
      this.longi = resp.coords.longitude;
      console.log("CONFIG -> Inciando chamada do Google...", new Date());
      // Chamada à API do Google
      this.http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+this.lati+","+this.longi+"&sensor=true&key=AIzaSyDcdW2PsrS1fbsXKmZ6P9Ii8zub5FDu3WQ")
        .map(res => res.json())
        .subscribe(data => {
          console.log("CONFIG -> Resultado da chamada ao google", data, new Date());
          let address = data.results[0];
          // this.location = address.formatted_address;

          // Separar os dados do endereço
          this.config.endereco['numero']        = address.address_components[0].long_name;
          this.config.endereco['logradouro']    = address.address_components[1].long_name;
          this.config.endereco['bairro']        = address.address_components[2].long_name;
          this.config.endereco['municipio']     = address.address_components[4].long_name;
          this.config.endereco['uf']            = address.address_components[5].short_name;
          this.config.endereco['latitude']      = this.lati;
          this.config.endereco['longitude']     = this.longi;

          ////////////////////////////////// Criar o mapa

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
        
            this.marker = new google.maps.Marker({
              map: this.map,
              animation: google.maps.Animation.DROP,
              position: this.map.getCenter()
            });

            loading.dismiss();

        }, erro => {

          console.log("CONFIG -> Erro da API do Google:", erro, new Date());

          loading.dismiss();

        })

    }, erro => {

      console.log("CONFIG -> Erro do MAPA:", erro, new Date());
      loading.dismiss();

    })
    .catch(erro => {
      
      console.log("CONFIG -> Erro na linha 143: ", erro, new Date());
      loading.dismiss();

    });
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
   * Centraliar o mapa na nova localidade e criar um marcador
   */

   centralizar(latLng){

    if(typeof this.map !== 'undefined'){

      this.map.setCenter(latLng);
      
      this.marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter()
      });

    }

   }

  /**
   * Enviar a solicitação para o Gesol
   */

  gravaSolicitacao(evento){

    this.abrirLoading();

    // Desabilitar o botão de enviar 
    let botao = evento.target;
    botao.disabled = true;

    // Testar se o endereço já foi obtido
    if(Object.keys(this.config.endereco).length){

      // Testar se a foto foi tirada em Mesquita

      if(this.config.endereco['municipio'] == "Mesquita"){
      
        this.gesol.enviaSolicitacao(this.imagem, this.servico, this.texto, this.config.endereco).subscribe(
          
          // Caso de sucesso
          res => {
    
            this.fecharLoading();

            //Habilitar novamente o botão
            botao.disabled = false;
    
            // Criar o alerta
            let alert = this.alertCtrl.create({
              title: "Parabéns!",
              enableBackdropDismiss: false,
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
    
            this.config.temEndereco = false;

    
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
              enableBackdropDismiss: false,
              buttons: ['ok']
            });
    
            // Mostrar o aleta
            alert.present();

            //Habilitar novamente o botão
            botao.disabled = false;

            this.fecharLoading();
    
          }
    
        );
  
      } else {
  
        let alert = this.alertCtrl.create({
          title: "Atenção",
          enableBackdropDismiss: false,
          subTitle: "Apenas solicitações registradas no município de Mesquita podem ser registradas pelo Mesquita 360.",
          buttons: ['ok']
        });
  
        alert.present();

        //Habilitar novamente o botão
        botao.disabled = false;

        this.fecharLoading();
  
      }

    } else {

      // Caso o enderço ainda não tenha sido obtido

      let alert = this.alertCtrl.create({
        title: "Atenção",
        enableBackdropDismiss: false,
        subTitle: "Aguarde um momento enquanto estamos localizando você.",
        buttons: ['ok']
      });

      alert.present();

      //Habilitar novamente o botão
      botao.disabled = false;

      this.fecharLoading();

    }

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