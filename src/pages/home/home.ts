import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { ConfigProvider } from "../../providers/config/config";
import { GesolProvider } from "../../providers/gesol/gesol";
import { Camera } from "ionic-native";
import { ServicosPage } from "../servicos/servicos";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  public solicitacoes = [];
  public meses = [];
  public novos_comentarios = [];

  // BLOB da imagem tirada pela câmera
  public base64image: string;

  constructor(public navCtrl: NavController,
              public config: ConfigProvider,
              public gesol: GesolProvider,
              public menu: MenuController) {

      // Habilitar o menu lateral

      this.menu.enable(true);

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
    
      this.gesol.getSolicitacoes().subscribe(

        res => {
                
          // Preencher a variável de solicitações

          this.solicitacoes = res;

          for(let item in this.solicitacoes){

            // Criar um objeto de Data com a propriedade created_at do item

            let data = new Date(this.solicitacoes[item].created_at);

            // Formatar a data para um formato legível para seres humands

            this.solicitacoes[item].data = data.getDate() + " de " + this.meses[data.getMonth()] + " de " + data.getFullYear();

            // Criar uma posição no vetor de novos comentários para essa solicitação

            this.novos_comentarios[this.solicitacoes[item].id] = "";

          }
        
        }, 
        
        fail => { 
          
          console.log("Falhou"); 
          console.log(fail); 
        }
      )
  }

  /**
   * Tirar uma foto com a câmera e guardar na variável base64image
   * @param
   */

   tirarFoto(){

      // Chamar a câmera
      Camera.getPicture({
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 1000,
        targetHeight: 750
      })
      
      // Quando a imagem for retornada
      .then((imagem) => {

          this.base64image = "data:image/jpeg;base64," + imagem;
          
          // Navegar para a página de serviços passando a imagem como parâmetro
          this.navCtrl.push(ServicosPage,{
            imagem : this.base64image
          });

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
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 1000,
        targetHeight: 750
      })
      
      // Quando a imagem for retornada
      .then((imagem) => {

          this.base64image = "data:image/jpeg;base64," + imagem;
          
          // Navegar para a página de serviços passando a imagem como parâmetro
          this.navCtrl.push(ServicosPage, {
            imagem: this.base64image
          });

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

    // Obter a Row com as mensagens da solicitação que foi clicada
    let row = document.getElementById("mensagens_"+id);

    // Caso a Altura da div seja 0 ou não esteja definidar, abrir

    if(row.style.height == "0px" || !row.style.height){

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

      row.style.height = altura + "px";

    } else {

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

          this.solicitacoes[i].mensagens.push({
            functionario_id : null,
            mensagem: this.novos_comentarios[solicitacao]
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

}