import { Component } from '@angular/core';
import { NavController, MenuController, LoadingController } from 'ionic-angular';
import { ConfigProvider } from "../../providers/config/config";
import { GesolProvider } from "../../providers/gesol/gesol";
import { Camera } from "ionic-native";
import { ServicosPage } from "../servicos/servicos";
import { Crop } from "@ionic-native/crop";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  public solicitacoes = [];
  public meses = [];
  public novos_comentarios = [];
  public apoios = [];
  public meus_apoios = [];

  loading: any;

  // BLOB da imagem tirada pela câmera
  public base64image: string;

  constructor(public navCtrl: NavController,
              public config: ConfigProvider,
              public gesol: GesolProvider,
              public menu: MenuController,
              public loadingCtrl: LoadingController,
              public crop: Crop) {

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
      
  }

  /**
   * Essa função é chamada TODAS AS VEZES que uma página se torna visível, 
   * ao contrároi do constructor e da ionViewDidLoad que só são chamados uma vez.
   */

  ionViewDidEnter(){

    // Habilitar o menu lateral
    // this.menu.enable(true);

    console.log("Estado do Menu", this.menu);
    
    // O que diz aí em baixo
    this.carregarSolicitacoes();
    
  }

  /**
   * Carregar as 10 solicitações mais recentes
   */

  carregarSolicitacoes(){

    // Abrir o gif de loading

    this.abrirLoading();

    this.gesol.getSolicitacoes().subscribe(
      
      res => {
              
        // Preencher a variável de solicitações

        this.solicitacoes = res;

        for(let item in this.solicitacoes){

          // Criar um objeto de Data com a propriedade created_at do item
          let data = new Date(this.solicitacoes[item].created_at);

          // Formatar a data para um formato legível para seres humanos
          this.solicitacoes[item].data = data.getDate() + " de " + this.meses[data.getMonth()] + " de " + data.getFullYear();

          // Criar uma posição no vetor de novos comentários para essa solicitação
          this.novos_comentarios[this.solicitacoes[item].id] = "";

          // Criar uma posição no vetor de apoios com o id da solicitação e a quantidade de apoios
          this.apoios[this.solicitacoes[item].id] = this.solicitacoes[item].apoiadores_count;

          // Testar se o usuário está logado
          if(this.estaLogado())
          {
            // Testar se o usuário apoiou esta solicitação
            let meus = this.solicitacoes[item].apoiadores.filter(apoiador => (apoiador.id == 21));

            // Adicionar ao vetor que guarda apenas os ids das solicitações apoiadas pelo usuário atualmente logado
            if(meus.length)
              this.meus_apoios.push(meus[0].pivot.solicitacao_id);
          }

        }

        // Fechar tela de loading

        this.fecharLoading();
      
      }, 
      
      fail => { 
        
        console.log("Falhou"); 
        console.log(fail); 
      }
    );

  }

  /**
   * Tirar uma foto com a câmera e guardar na variável base64image
   * @param
   */

   tirarFoto(){

      // Chamar a câmera
      Camera.getPicture({
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 1000,
        targetHeight: 750,
        correctOrientation: true,
      })
      
      // Quando a imagem for retornada
      .then((imagem) => {

          // this.base64image = "data:image/jpeg;base64," + imagem;

          // Cropar a imagem
          this.crop.crop(imagem, { quality: 100 })
          .then(
            nova_imagem => {

              // Converter a imagem para base64
              this.toBase64(nova_imagem).then(base64 => {
                
                this.base64image = base64;

                // Navegar para a página de serviços passando a imagem como parâmetro
                this.navCtrl.push(ServicosPage,{
                  imagem : this.base64image
                });

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

   /**
    * Escolher foto da galeria
    * @param
    */

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

          // this.base64image = "data:image/jpeg;base64," + imagem;

          this.crop.crop(imagem, { quality: 100 })
          .then(
            nova_imagem => {

              this.toBase64(imagem).then(base64 => {

                // Navegar para a página de serviços passando a imagem como parâmetro
                this.navCtrl.push(ServicosPage, {
                  imagem: base64
                });

              })

            }
          );

      }, 

      // Em caso de Errro
      (err) => {
        console.log(err);
      });

    }

  // Definir uma classe de acordo com o status da solicitação
  defineClass(status){

    if(status == "Aberta" || status == "Aguardando"){

      return "success";

    } else if(status == "Encaminhada" || status == "Pendente" || status == "Em execução"){

      return "warning";

    } else {

      return "danger";

    }
    
  }

  // Expandir ou encolher as mensagens
  expandirMensagens(id){

    console.log("Chamou");

    // Obter a Row com as mensagens da solicitação que foi clicada
    let row = document.getElementById("mensagens_"+id);

    console.log("Elemento", row);

    // Caso a Altura da div seja 0 ou não esteja definidar, abrir

    if(row.style.height == "0px" || !row.style.height){

      console.log("Altura era igual a 0");

       // Altura da div de mensagens
      let altura = 0;

      // Obter um objeto com todoas as mensagens
      let itens = row.childNodes;

      // Obter a quantidade de mensagens
      let qtd = itens.length;

      // Iterar pelas mensagens e somar as suas alturas
      for(var i = 0; i < qtd; i++){

        if(typeof itens[i].attributes !== "undefined"){

          altura += itens[i].attributes[0].ownerElement.scrollHeight;

        }

      }

      console.log("Nova altura", altura);

      row.style.height = altura + "px";

    } else {

      console.log("Altura era maior que 0, mudando para 0");

      // Caso contrário, setar a altura para 0px
      row.style.height = "0px";

    }

  }

  // Enviar mensagem para o gesol
  enviarMensagem(evento, solicitacao){

    // Os novos comentários ficam guardados em um vetor

    if(this.novos_comentarios[solicitacao] != ""){

      // Fazer uma cahamda para a API e criar uma nova mensagem
      this.gesol.enviaMensagem(this.novos_comentarios[solicitacao], solicitacao).subscribe(
        
        // Caso suceda
        res => {
          console.log("Mensagem Cadastrada");
        },

        //Caso Falhe
        fail => {
          console.log("Cadastro de Mensagem Falhou:");
          console.log(fail);
        }
      );

      // Colocar a nova mensagem na tela

      for(let i = 0; i < this.solicitacoes.length; i++){

        if(this.solicitacoes[i].id == solicitacao){

          // Criar uma mensagem fake para adicionar na solicitação enquanto a verdadeira é enviada para o servidor

          this.solicitacoes[i].comentarios.push({
            functionario_id : null,
            comentario: this.novos_comentarios[solicitacao]
          });

          // Aumentar tamanho do container de mensagens
          evento.path[4].style.height =  evento.path[4].scrollHeight + 65 + "px";

          // Zerar o input
          this.novos_comentarios[solicitacao] = "";
        }

      }

    }

  }

  // Retornar o id do solicitante para ser usado no template
  getSolicitanteId(){
    return this.config.getGesolUserId();
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

  // Enviar o id de uma solicitação e de um solicitante e adicionar ou remover o apoio

  apoiar(solicitacao, solicitante){

    //Fazer a chamada AJAX
    this.gesol.apoiar(solicitacao, solicitante).subscribe(

      res => {

        // A resposta desse AJAX é o número de apoios que a solicitação possui.
        // Atribuir esse número ao vetor na posição correta para que o valor seja atualizado na tela
        this.apoios[solicitacao] = res;

        // Caso o usuário já tenha apoiado essa solicitação, excluir o seu id do vetor de apoios
        if(this.meus_apoios.indexOf(solicitacao) > -1)
        {
           // Obter o índice do item para excluir
           let index = this.meus_apoios.indexOf(solicitacao);

           // Excluir o apoio
          this.meus_apoios.splice(index, 1);

        } else {

          // Caso contrário, adicionar
          this.meus_apoios.push(solicitacao);

        }
      }

    );

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

  /**
   * Verificar se usuário está ou não está logado no sistema atualmente
   */

  estaLogado(){
    return this.config.getGesolToken() != null;
  }

  naoEstaLogado(){
    return this.config.getGesolToken() == null;
  }

}