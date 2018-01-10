import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { GoogleMapsEvent } from 'ionic-native';
import { Http } from "@angular/http";

// Fazer com que o TypeScript não sobrescreva a variável do google
declare var google;
declare var plugin;

/**
 * Generated class for the ApontarPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-apontar',
  templateUrl: 'apontar.html',
})
export class ApontarPage {

  @ViewChild('mapaApontar') mapElement: ElementRef;
  map:any;
  marker:any;
  public endereco:string = "Rua Arthur Oliveira Vechy, 120 - Mesquita - RJ";
  public partes_endereco:any = [];

  public latitude:any;
  public longitude:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public config: ConfigProvider,
    public http: Http,
    public events: Events){
  }

  ionViewDidLoad() {
      this.loadMap();
  }

  //Montar o mapa com as coordenadas obtidas pelo GPS ou centralizar na prefeitura caso elas ainda não estejam disponíveis
  loadMap(){

    if(this.config.temEndereco){

      this.montaMapa([this.config.lati, this.config.longi]);

    } else {

      this.montaMapa([-22.7827251, -43.43185])
      
    }

  }

  montaMapa(coord){

    // Criar um objeto com as coordenadas do chamado
    let latLng = new google.maps.LatLng(coord[0], coord[1]);
    
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    // Adicionar um marcador central
  
    this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    /////////////////////// Evento Click do Mapa

    this.map.addListener('click', (e) => {

      // Deletar o marcador antigo, criar um novo e atualizar o endereço na barra inferior
      this.addMarker(e).then(() => {
        this.atualizarEndereco();
      });

    });

  }

  addMarker(e){

    return new Promise((resolve, reject) => {

      //TODO: Salvar a latitude e a longitude vindo pelo evento nas variáveis locais

      let coord = e.latLng.toJSON();
      this.latitude = coord.lat;
      this.longitude = coord.lng;

      //Zerar o último marcador
      this.marker.setMap(null);

      // Criar um novo marcador onde o usuário clicou
      this.marker = new google.maps.Marker({
        map: this.map,
        position: e.latLng
      });
      
      // Centralizar o mapa onde o usuário clicou
      this.map.panTo(e.latLng);

      resolve();

    });

  }

  atualizarEndereco(){

    this.endereco = "Carregando novo endereço...";
    this.events.publish('updateScreen');

    this.http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+this.latitude+","+this.longitude+"&sensor=true&key=AIzaSyDcdW2PsrS1fbsXKmZ6P9Ii8zub5FDu3WQ")
    .map(res => res.json())
    .subscribe(data => {

      let address = data.results[0];

      // Separar os dados do endereço
      this.partes_endereco['numero']     = address.address_components[0].long_name;
      this.partes_endereco['logradouro'] = address.address_components[1].long_name;
      this.partes_endereco['bairro']     = address.address_components[2].long_name;
      this.partes_endereco['municipio']  = address.address_components[4].long_name;
      this.partes_endereco['uf']         = address.address_components[5].short_name;
      this.partes_endereco['latitude']   = this.latitude;
      this.partes_endereco['longitude']  = this.longitude;

      this.endereco = this.partes_endereco["logradouro"]+", "+this.partes_endereco["numero"]+" - "+this.partes_endereco["municipio"]+" - "+this.partes_endereco["uf"];

      console.log("Novo Endereço:", this.endereco);
      this.events.publish('updateScreen');

    })

  }
  
  getEndereco(){
    return this.endereco;
  }

  confirmarLocalizacao(){

    console.log("Chamou confirmar Localização");

    this.config.endereco = this.partes_endereco;
    this.config.lati = this.partes_endereco['latitude'];
    this.config.longi = this.partes_endereco['longitude'];

    console.log("Endereço no config", this.config.endereco);
    console.log("Endereço local", this.partes_endereco);
    console.log("Endereço no config", this.config.endereco);

    this.events.publish("updateScreen");

    this.navCtrl.pop();

  }

}
