import { Component } from '@angular/core';
import { NavController, MenuController, LoadingController, ToastController, FabContainer, AlertController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ConfigProvider } from "../../providers/config/config";
import { GesolProvider } from "../../providers/gesol/gesol";
import { Camera } from "ionic-native";
import { Crop } from "@ionic-native/crop";
import { Storage } from "@ionic/storage";

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
  public loading: boolean = true;

  offset = 0;
  toast: any;


  // BLOB da imagem tirada pela câmera
  public base64image: string;

  constructor(public navCtrl: NavController,
              public config: ConfigProvider,
              public alertCtrl: AlertController,
              public gesol: GesolProvider,
              public menu: MenuController,
              public loadingCtrl: LoadingController,
              public crop: Crop,
              public splashScreen: SplashScreen,
              public toastCtrl: ToastController,
              private storage: Storage) {

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
   * ao contrário do constructor e da ionViewDidLoad que só são chamados uma vez.
   */

  ionViewDidEnter(){

    // O que diz aí em baixo
    this.carregarSolicitacoes();

    // Obter o valor da variável que diz se o usuário está logado no sistema
    this.storage.get('logado').then(val => {

        // Habilitar ou desabilitar o menu de acordo com o valor desta variável
        if(val){
          this.menu.enable(true);
        } else {
          this.menu.enable(false);
        }

    })
    
  }

  /**
   * Carregar as 10 solicitações mais recentes
   */

  carregarSolicitacoes(){

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
        
        let alert = this.alertCtrl.create({
          title: 'Sem Conexão',
          subTitle: 'Nâo é possível acessar o servidor do Mesquita 360º. Verifique sua conexão com a internet e tente novamente.',
          buttons: ['Ok']
        });

        alert.present();
      }
    );

  }

  adicionarSolicitacoes(infiniteScroll){

     // Calcular o offset

     this.offset += 10;

     this.gesol.addSolicitacoes(this.offset).subscribe(
      
      res => {
              
        // Aidioncar os novos itens à variável de solicitações

        this.solicitacoes = this.solicitacoes.concat(res);

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

        // Fechar o gif de loading

        infiniteScroll.complete();
      
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

   tirarFoto(fab: FabContainer){

      // Obter o endereço enquanto o resto da lógica é feito
      this.config.getLatLong();

      console.log("Chamou a Câmera");
     
      fab.close();

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
          console.log("Retornou a imagem. Chamando o Crop...");

          // Cropar a imagem
          this.crop.crop(imagem, { quality: 100 })
          .then(nova_imagem => {
              console.log("Retornou a imagem cropada, convertendo para base64...");

              // Converter a imagem para base64
              this.toBase64(nova_imagem).then(base64 => {
                console.log("Converteu para base64. Chamando a página de serviços");
                
                this.base64image = base64;

                // Navegar para a página de serviços passando a imagem como parâmetro
                this.navCtrl.push('ServicosPage',{
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

    escolherFoto(fab: FabContainer){

      // Obter o endereço enquanto o resto da lógica é feito
      this.config.getLatLong();

      fab.close();

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
                this.navCtrl.push('ServicosPage', {
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
   * Fechar o gif de Loading
   */


  fecharLoading(){

    this.loading = false;

  }

  /**
   * Abrir e fechar o Toast de "Procurando por novas solicitações..." 
   */

   abrirToast(){

    this.toast = this.toastCtrl.create({
      message: "Carregando novas solicitações...",
      duration: 3000,
      position: 'bottom'
    });

    this.toast.present();

   }

   fecharToast(){

    this.toast.dismiss();

   }

  // Enviar o id de uma solicitação e de um solicitante e adicionar ou remover o apoio

  apoiar(solicitacao, solicitante){

    //Fazer a chamada AJAX
    this.gesol.apoiar(solicitacao, solicitante).subscribe(

      res => {

        let resposta = res;

        // A resposta desse AJAX é o número de apoios que a solicitação possui.
        // Atribuir esse número ao vetor na posição correta para que o valor seja atualizado na tela
        this.apoios[solicitacao] = resposta.qtd;

        // Caso o usuário já tenha apoiado essa solicitação, excluir o seu id do vetor de apoios
        if(resposta.remover)
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

  doInfinite(infiniteScroll){
    
    this.adicionarSolicitacoes(infiniteScroll);

  }

  irParaLogin()
  {
    this.navCtrl.push('LoginPage');
  }

  /**
   * Verificar se usuário está ou não está logado no sistema atualmente
   */

  estaLogado(){
    return this.config.getLogado();
  }

  naoEstaLogado(){
    return !this.config.getLogado() || this.config.getLogado() == null;
  }

}