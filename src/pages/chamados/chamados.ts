import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { GesolProvider } from "../../providers/gesol/gesol";
import { ConfigProvider } from "../../providers/config/config";
import { Alert } from 'ionic-angular/components/alert/alert';

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
  public meses = [];
  public novos_comentarios = [];
  public apoios = [];
  public meus_apoios = [];
  public loading: any;

  //////////////////////// Esta página mostra apenas as solicitações do próprio usuário logado, independente do status

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public gesol : GesolProvider,
              public config: ConfigProvider,
              public loadingCtrl: LoadingController,
              public alertController: AlertController,
              public events: Events) {

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

  ionViewDidEnter(){

    // Trigar o evento que faz com que o app.component.ts busque as solicitações no Gesol
    this.events.publish("recarregar:minhas");

  }

  defineClasse(item){
    
    if(item.status == "Aberta" || item.status == "Pendente"){
      return "danger";
    } else if(item.status == "Encaminhada" || item.status == "Aguardando" || item.status == "Em execução"){
      return "warning";
    } else {
      return "success";
    }

  }

 // Expandir ou encolher as mensagens
  expandirMensagens(id){

    // Obter a Row com as mensagens da solicitação que foi clicada
    let row = document.getElementById("minhas_mensagens_"+id);

    // Caso a Altura da div seja 0 ou não esteja definidar, abrir

    if(row.style.height == "0px" || !row.style.height){

      // Altura da div de mensagens
      //let altura = 0;

      // Obter um objeto com todoas as mensagens
      //let itens = row.childNodes;

      // Obter a quantidade de mensagens
      //let qtd = itens.length;

      // Iterar pelas mensagens e somar as suas alturas
      //for(var i = 0; i < qtd; i++){

        //if(typeof itens[i].attributes !== "undefined"){

          //altura += itens[i].attributes[0].ownerElement.scrollHeight;

        //}

      //}

      row.style.height = 'auto';

    } else {

      // Caso contrário, setar a altura para 0px
      row.style.height = "0px";

    }

  }

  // Enviar mensagem para o gesol
  enviarMensagem(evento, solicitacao){

    // Obter o botão que envia os comentários
    let botao = evento.target;

    // Desabilitar o botão para que essa mensagem não seja enviada multiplas vezes
    this.desabilitarBotao(botao);

    // Zerar o input de comentários dessa solicitação e salvar o comentário em uma variável
    let comentario = this.novos_comentarios[solicitacao];
    this.novos_comentarios[solicitacao] = "";

    // Os novos comentários ficam guardados em um vetor
    if(typeof comentario !== 'undefined' && comentario.replace(/\s/g,'') != ""){

      // Adicionar o novo comentário à solicitação no Config
      this.config.novoComentario(solicitacao, comentario);

      // Fazer uma cahamda para a API e criar uma nova mensagem
      this.gesol.enviaMensagem(comentario, solicitacao).subscribe(
        
        // Caso suceda
        res => {
          
          // Liberar novamente o botão de enviar comentários
          this.habilitarBotao(botao);
        },

        //Caso Falhe
        fail => {console.log
          console.log("Cadastro de Mensagem Falhou:");
          console.log(fail);

          // Liberar novamente o botão de enviar comentários
          this.habilitarBotao(botao);
        }
      );

    }

    // Liberar novamente o botão de enviar comentários
    this.habilitarBotao(botao);

  }

  // Retornar o id do solicitante para ser usado no template
  getSolicitanteId(){
    return this.config.getGesolUserId();
  }

  detalhes(id: number)
  {
    // Ir para a pagina de detalhes do Atendimento

    this.navCtrl.push('AtendimentoPage', this.sol[id]);
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
        this.apoios[solicitacao] = res.qtd;

        // Caso o usuário já tenha apoiado essa solicitação, excluir o seu id do vetor de apoios
        if(res.remover)
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


  private carregarSolicitacoes() {
      // Fazer a requisição ao Gesol pelas solicitações do usuário

      this.gesol.getMinhasSolicitacoes(true).subscribe(
        // Caso de sucesso
        res => {
          
          this.sol = res;

          for(let item in this.sol) {
            // Criar um objeto de Data com a propriedade created_at do item
            let data = new Date(this.sol[item].created_at);

            // Formatar a data para um formato legível para seres humands
            this.sol[item].data = data.getDate() + " de " + this.meses[data.getMonth()] + " de " + data.getFullYear();

            // Criar uma posição no vetor de novos comentários para essa solicitação
            this.novos_comentarios[this.sol[item].id] = "";

            // Criar uma posição no vetor de apoios com o id da solicitação e a quantidade de apoios
            this.apoios[this.sol[item].id] = this.sol[item].apoiadores_count;

            // Testar se o usuário apoiou esta solicitação
            let meus = this.sol[item].apoiadores.filter(apoiador => (apoiador.id == 21));

            // Adicionar ao vetor que guarda apenas os ids das solicitações apoiadas pelo usuário atualmente logado
            if(meus.length)
              this.meus_apoios.push(meus[0].pivot.solicitacao_id);

            // Criar um vetor para as mensagens dessa solicitação
            this.sol[item].mensagens = [];
        }

        this.config.setSolicitacoes(this.sol);
        
        this.fecharLoading();
    },
    // Caso de falha
    fail => {
        console.log("Falha na solicitação", fail);
    });
  }

  deletaSolicitacao(id){

    let alert = this.alertController.create({
      title: "Atenção!",
      message: "Deseja realmente excluir essa solicitação?",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel"
        },
        {
          text: "Ok",
          handler: () => {

             // Faz a chamada para o gesol para deletar a solicitação

            this.gesol.deletaSolicitacao(id).subscribe(
              res => {

                // Caso o processo seja bem sucedido...

                if(res.status){

                  //Chamar o evento no app.component.ts para recarregar as minhas solicitações
                  this.events.publish('recarregar:minhas');

                }

              },
              fail => {
                console.log("Falha na exclusão de solicitação", fail);
              }
            );

          }
        }
      ]
    });

    alert.present();

  }

  apagarComentario(comentario_id, solicitacao_id){

    // Mostrar um alert pedindo para o usuário confirmar a exclusão do comentário    
    let alert = this.alertController.create({
      title: "Atenção!",
      message: "Deseja realmente apagar esse comentário?",
      buttons: [
        {
          text: "Sim",
          handler: ()=>{

            // Fazer uma chamada para a API apagar o comentário            
            this.gesol.apagarComentario(comentario_id).subscribe(()=>{

            // Substituir o texto do comentário apagado no vetor de solicitações do aplicativo
            this.config.apagarComentario(comentario_id, solicitacao_id);

            });

          }
        },
        {
          text: "Cancelar",
          role: 'cancel'
        }
      ]
    });

    alert.present();

  }

  desabilitarBotao(elem){

    if(elem.tagName == "SPAN")
      elem.parentElement.disabled = true;
    else
      elem.disabled = true;

  }

  habilitarBotao(elem){

    if(elem.tagName == "SPAN")
      elem.parentElement.disabled = false;
    else
      elem.disabled = false;

  }
}
