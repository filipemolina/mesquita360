import { Component } from '@angular/core';

import { 
  IonicPage, 
  NavController, 
  NavParams, 
  ActionSheetController, 
  LoadingController, 
  AlertController 
} from 'ionic-angular';

import { GesolProvider } from '../../providers/gesol/gesol';
import { Camera } from "ionic-native";
import { Crop } from "@ionic-native/crop";
import { ConfigProvider } from '../../providers/config/config';

/**
 * Generated class for the EditarPerfilPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-editar-perfil',
  templateUrl: 'editar-perfil.html',
})

export class EditarPerfilPage {

  public usuario: any = {};
  public escolaridades: any[];
  public loading;
  public mascara: any;
  
  public endereco: any = {};

  public telefone_fixo: any = {};
  public telefone_celular: any = {};

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public gesol: GesolProvider,
    public actionSheetController: ActionSheetController,
    public crop: Crop,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public config: ConfigProvider
  ){

    this.abrirLoading();

    // Obter todas as informações do usuário
    this.getUserInfo();
    
  }

  // Executar o chamado para alterar os dados do usuário quando este sair da página de alteração

  ionViewDidLeave(){
    this.salvarInfoUsuario();
  }

  abrirActionSheet(){

    // Criar a ActionSheet
    let actionsheet = this.actionSheetController.create({
      title: "Escolha uma opção:",
      buttons: [
        {
          text: "Tirar uma foto",
          handler: () => this.tirarFoto(),
          icon: 'camera'
        },
        {
          text: "Escolher da Galeria",
          handler: () =>  this.escolherFoto(),
          icon: 'image'
        },
        {
          text: "Cancelar",
          role: "cancel",
          icon: 'close',
          handler: () => console.log("Cancelou")
        }
      ]
    });

    // Mostrar a ActionSheet
    actionsheet.present();

  }

  tirarFoto(){
    
    // Chamar a câmera
    Camera.getPicture({
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1000,
      targetHeight: 750,
      correctOrientation: true,
      cameraDirection: Camera.Direction.FRONT
    })
    
    // Quando a imagem for retornada
    .then((imagem) => {

        // Cropar a imagem
        this.crop.crop(imagem, { quality: 100 })
        .then(
          nova_imagem => {

            // Converter a imagem para base64
            this.toBase64(nova_imagem).then(base64 => {
              
              this.usuario.foto = base64;

            })

          },

          erro => console.log("Erro no Crop", erro)

        );

    }, 

    // Em caso de Errro
    (err) => {
      console.log(err);
    });

  }

  escolherFoto(){
    
    // Chamar a câmera
    Camera.getPicture({
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1000,
      targetHeight: 750
    })
    
    // Quando a imagem for retornada
    .then((imagem) => {

        this.crop.crop(imagem, { quality: 100 })

        .then(
          nova_imagem => {

            this.toBase64(imagem).then(base64 => {

              this.usuario.foto = nova_imagem;

            })

          }
        );

    }, 

    // Em caso de Errro
    (err) => {
      console.log(err);
    });

  }

   /**
   * Converte um caminho de arquivo de imagem em uma imagem base64
   * @param url Caminho para o arquivo de imagem
   */

  toBase64(url: string){
    return new Promise<string>(function (resolve) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                resolve(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.send();
    });
  }

  getEscolaridade(){

    this.gesol.getEnum("solicitantes", "escolaridade").subscribe(

      res => {

        this.escolaridades = res;

        this.fecharLoading();

      },

      erro => {

        console.log("Erro do Enum", erro);

      }
    
    );

  }

  /**
   * Obter todas as informações do usuário em um único objeto
   */

  getUserInfo() {
    this.gesol.getSolicitanteInfo().subscribe(res => {
       
      // Todas as informações do usuário
      this.usuario = res;

      // Caso já haja algum endereço cadastrado, popular o array de endereço
      if(this.usuario.endereco)
        this.endereco = this.usuario.endereco;
      
      else
        this.endereco = {
          logradouro: "",
          numero: "",
          bairro: "",
          municipio: "",
          uf: "",
          cep: "",
        };

      // Caso já haja telefones cadastrados, popular o array de telefones

      if(this.usuario.telefones.length){
        //Gravar o primeiro telefone
        this.telefone_fixo = this.usuario.telefones[0];

        // Testar se o segundo telefone existe
        if(this.usuario.telefones.length > 1)
          this.telefone_celular = this.usuario.telefones[1];
      }
      else{

        this.telefone_fixo = {
            tipo_telefone: "Fixo",
            numero: ""
        }
        
        this.telefone_celular = {
            tipo_telefone: "Celular",
            numero: ""
        }
        
        console.log("telefone 1", this.telefone_fixo);
        console.log("telefone 2", this.telefone_celular);

      }

      // Obter todas as opções do Enum de escolaridade
      this.getEscolaridade();


    }, err => console.log(err));
  }

  salvarInfoUsuario(){

    // Adicionar as informações de endereço e telefones no objeto do usuário

    this.usuario.endereco = this.endereco;
    this.usuario.telefones = [this.telefone_fixo, this.telefone_celular];

    this.gesol.editaSolicitante(this.usuario).subscribe(

      res => {

        this.config.setSolicitante(res);

      },

      erro => {

        console.log("Ocorreu um erro!");

        // Objeto com todos os erros
        let erros = JSON.parse(erro._body);
        let mensagem: string = "";

        //Iterar pelos erros e concatenar em uma variável de texto

        // Iterar pelas propriedades do objeto com os erros
        for(var campo in erros){
          if(erros.hasOwnProperty(campo)){

            // Montar uma variável com todas as mensagens de erro
            mensagem += erros[campo][0] + "<br>";

          }
        }

      }

    );

  }

  /**
   * Buscar CEP
   * Recebe como argumento o próprio evento "change" para poder manipular o elemento através dele
   */

  buscaCEP(evento){

    this.abrirLoading();

    this.gesol.consultaCEP(evento.target.value).subscribe(
      res => {
        
        // Mudar o valor do input para o CEP formatado
        this.endereco.cep = res.cep;

        // Preencher o valor dos outros campos
        this.endereco.cep = res.cep;
        this.endereco.bairro = res.bairro;
        this.endereco.logradouro = res.logradouro;
        this.endereco.complemento = res.complemento;
        this.endereco.municipio = res.localidade;
        this.endereco.uf = res.uf;

        this.fecharLoading();

      },
      erro => {
        console.log(erro);
        this.fecharLoading();
      }
    );

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
