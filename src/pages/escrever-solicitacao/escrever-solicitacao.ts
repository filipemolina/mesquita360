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

    console.log("ES -> Chamou o LoadMap", new Date());
    console.log("ES -> Config nesse momento", this.config, new Date());

    //Testar se a localização já foi obtida pelo aplicativo

    if(!this.config.temEndereco){
      
      this.obterEnderecoECarregarMapa();

    } else {

      console.log("ES -> O Endereço já foi obtido, prosseguindo", new Date());
      
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

  obterEnderecoECarregarMapa(){

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
          this.endereco['numero']        = address.address_components[0].long_name;
          this.endereco['logradouro']    = address.address_components[1].long_name;
          this.endereco['bairro']        = address.address_components[2].long_name;
          this.endereco['municipio']     = address.address_components[4].long_name;
          this.endereco['uf']            = address.address_components[5].short_name;
          this.endereco['latitude']      = this.lati;
          this.endereco['longitude']     = this.longi;

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
        
            let marker = new google.maps.Marker({
              map: this.map,
              animation: google.maps.Animation.DROP,
              position: this.map.getCenter()
            });

        }, erro => {

          console.log("CONFIG -> Erro da API do Google:", erro, new Date());

        })

    }, erro => {

      console.log("CONFIG -> Erro do MAPA:", erro, new Date());

    })
    .catch(erro => {
      
      console.log("CONFIG -> Erro na linha 143: ", erro, new Date());

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
   * Enviar a solicitação para o Gesol
   */

  gravaSolicitacao(){

    this.abrirLoading();

    // Testar se o endereço já foi obtido
    if(Object.keys(this.endereco).length || Object.keys(this.config.endereco).length){

      // Testar se a foto foi tirada em Mesquita

      if(this.endereco['municipio'] == "Mesquita"){
      
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
              buttons: ['ok']
            });
    
            // Mostrar o aleta
            alert.present();

            this.fecharLoading();
    
          }
    
        );
  
      } else {
  
        let alert = this.alertCtrl.create({
          title: "Atenção",
          subTitle: "Apenas solicitações registradas no município de Mesquita podem ser registradas pelo Mesquita 360.",
          buttons: ['ok']
        });
  
        alert.present();

        this.fecharLoading();
  
      }

    } else {

      // Caso o enderço ainda não tenha sido obtido

      let alert = this.alertCtrl.create({
        title: "Atenção",
        subTitle: "Aguarde um momento enquanto estamos localizando você.",
        buttons: ['ok']
      });

      alert.present();

      console.log("Endereço da página", this.endereco, Object.keys(this.endereco).length, "Endereço do config", this.config.endereco, Object.keys(this.endereco).length);

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