import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ConfigProvider } from "../../providers/config/config";
import { GesolProvider } from "../../providers/gesol/gesol";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  public solicitacoes = [];
  public meses = [];

  constructor(public navCtrl: NavController,
              public config: ConfigProvider,
              public gesol: GesolProvider) {

      console.log("Config no momento do carregamento da página");
      console.log(this.config);

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
    
      this.gesol
      .getSolicitacoes()
      .subscribe(
      res => {
              
        // Preencher a variável de solicitações

        this.solicitacoes = res;

        console.log("Solicitações");
        console.log(this.solicitacoes);

        for(let item in this.solicitacoes){

          // Criar um objeto de Data com a propriedade created_at do item

          let data = new Date(this.solicitacoes[item].created_at);

          // Formatar a data para um formato legível para seres humands

          this.solicitacoes[item].data = data.getDate() + " de " + this.meses[data.getMonth()] + " de " + data.getFullYear();

        }
      
      }, fail => { console.log("Falhou"); console.log(fail); })
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

          // altura += itens[i].attributes[1].ownerElement.clientHeight;
          altura += itens[i].attributes[0].ownerElement.scrollHeight;

        }

      }

      row.style.height = altura + "px";

    } else {

      // Caso contrário, setar a altura para 0px
      row.style.height = "0px";

    }

  }

  enviarMensagem(evento, solicitacao){

    // Obter o conteúdo do input de comentário

    // A propriedade "path" contém a árvore do elemento que ativou o evento, no caso o elemento button-inner.
    // Cada item desse vetor representa um elemento pai mais acima na árvore.

    //Cada elemento possui uma propriedade "children" contendo todos os elemento filhos em ordem de declaração no DOM

    // Nesse caso específico, eu subi 2 níveis na árvore e depois desci 3 níveis, selecionando sempre o primeiro elemento de cada nível
    // e obtendo, no fim, o valor do último elemento selecioado

    let input = evento.path[2].children[0].children[0].children[0];

    if(input.value != ""){

      // Fazer uma cahamda para a API e criar uma nova mensagem
      this.gesol.enviaMensagem(input.value, solicitacao).subscribe(
        
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
            mensagem: input.value
          });

          // Aumentar tamanho do container de mensagens
          evento.path[4].style.height =  evento.path[4].scrollHeight + 65 + "px";

          // Zerar o input
          input.value = "";
        }

      }

    }

  }

}