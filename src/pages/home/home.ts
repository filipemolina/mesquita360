import { Component } from '@angular/core';
import { Events, NavController, MenuController, LoadingController, ToastController, FabContainer, AlertController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ConfigProvider } from "../../providers/config/config";
import { GesolProvider } from "../../providers/gesol/gesol";
import { Diagnostic } from "@ionic-native/diagnostic";
import { Camera } from "@ionic-native/camera";
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

  offset = 10;
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
              private storage: Storage,
              private camera: Camera,
              private diagnostic: Diagnostic,
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

  /**
   * Essa função é chamada TODAS AS VEZES que uma página se torna visível, 
   * ao contrário do constructor e da ionViewDidLoad que só são chamados uma vez.
   */

  ionViewDidEnter(){

    // O que diz aí em baixo
    this.events.publish('recarregar:solicitacoes');

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

  adicionarSolicitacoes(infiniteScroll){

     this.gesol.addSolicitacoes(this.offset).subscribe(
      
      res => {
              
        // Aidioncar os novos itens à variável de solicitações

        this.solicitacoes = res;

        for(let item in this.solicitacoes){

          // Criar um objeto de Data com a propriedade created_at do item
          let data = new Date(this.solicitacoes[item].created_at);

          // Formatar a data para um formato legível para seres humanos
          this.solicitacoes[item].data = data.getDate() + " de " + this.meses[data.getMonth() + 1] + " de " + data.getFullYear();

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

        // Gravar as solicitações já preparadas no config, de onde elas serão lidas pela view
        this.config.concatenarSolicitacoes(this.solicitacoes);

        // Fechar o gif de loading
        infiniteScroll.complete();

        // Aumentar o offset apenas se tiver recebido alguma solicitação
        if(this.solicitacoes.length)
          this.offset += 10;
      
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

      this.diagnostic.getLocationAuthorizationStatus().then(res => console.log("Authorization", res));

      // Obter o endereço enquanto o resto da lógica é feito
      this.config.getLatLong().catch(() => {

        // Criar o alerta com os erros
        let alert = this.alertCtrl.create({
          title: "Atenção",
          subTitle: 'O Aplicativo Mesquita 360º precisa obter a sua localização atual para enviar a sua solicitação. Por favor, habilite o GPS de seu aparelho e tente novamente.',
          buttons: [{
            text: "Ok",
            handler: () => {

              // Mesmo se o usuário aperte OK para mudar suas configurações de localização o aplicativo deve retornar
              // à home, pois existe a possibilidade de o usuário não ativar o GPS e mesmo assim voltar ao aplicativo.
              // Nesse caso não é recomendável que ele prossiga
              this.diagnostic.switchToLocationSettings();
              this.navCtrl.popToRoot();
            }
          },
          {
            text: 'Cancelar',
            handler: () => {
              
              this.navCtrl.popToRoot();

            }
          }]
        });

        // Mostrar o aleta
        alert.present();

      });
     
      fab.close();

      // Chamar a câmera
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.CAMERA,
        encodingType: this.camera.EncodingType.JPEG,
        targetWidth: 1000,
        targetHeight: 750,
        correctOrientation: true,
      })  
      // Quando a imagem for retornada
      .then((imagem) => {

          // Cropar a imagem
          this.crop.crop(imagem, { quality: 100 })
          .then(nova_imagem => {

              // Converter a imagem para base64
              this.toBase64(nova_imagem).then(base64 => {
                
                this.base64image = base64;

                // Navegar para a página de serviços passando a imagem como parâmetro
                this.navCtrl.push('ServicosPage',{
                  imagem : this.base64image
                });

              })

            },

            erro => console.log("Erro no Crop", erro)

          );

          console.log(imagem);

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
      this.config.getLatLong().catch(() => {

        // Criar o alerta com os erros
        let alert = this.alertCtrl.create({
          title: "Atenção",
          subTitle: 'O Aplicativo Mesquita 360º precisa obter a sua localização atual para enviar a sua solicitação. Por favor, habilite o GPS de seu aparelho e tente novamente.',
          buttons: [{
            text: "Ok",
            handler: () => {

              // Mesmo se o usuário aperte OK para mudar suas configurações de localização o aplicativo deve retornar
              // à home, pois existe a possibilidade de o usuário não ativar o GPS e mesmo assim voltar ao aplicativo.
              // Nesse caso não é recomendável que ele prossiga
              this.diagnostic.switchToLocationSettings();
              this.navCtrl.popToRoot();

            }
          },
          {
            text: 'Cancelar',
            handler: () => {
              
              this.navCtrl.popToRoot();

            }
          }]
        });

        // Mostrar o aleta
        alert.present();

      });

      fab.close();

      // Chamar a câmera
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        encodingType: this.camera.EncodingType.JPEG,
        targetWidth: 1000,
        targetHeight: 750
      })
      
      // Quando a imagem for retornada
      .then((imagem) => {

          // this.base64image = "data:image/jpeg;base64," + imagem;

          this.crop.crop(imagem, { quality: 100 })
          .then(
            nova_imagem => {

              this.toBase64(nova_imagem).then(base64 => {

                // Navegar para a página de serviços passando a imagem como parâmetro
                this.navCtrl.push('ServicosPage', {
                  imagem: base64
                });

              });

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

      //row.style.height = altura + "px";
      row.style.height = 'auto';

    } else {

      // Caso contrário, setar a altura para 0px
      //row.style.height = "0px"
      
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

  apoiar(evento, item){

    // Obter o botão de apoio e desabilitá-lo
    let botao = evento.target;
    this.desabilitarBotao(botao);

    // Obter o id do solicitante
    let solicitante = this.config.getSolicitante().id;

    // Testar se o usuário já apoiou essa solicitação
    if(this.config.usuarioApoiouSolicitacao(item))
      // Remover o apoio do vetor de solicitações antes da resposta da API
      this.config.removerApoio(item.id, solicitante, this.config.getSolicitacoes());
    else
      // Adicionar o apoio no vetor de solicitações antes da resposta da API
      this.config.adicionarApoio(item.id, solicitante, this.config.getSolicitacoes());

    //Fazer a chamada AJAX
    this.gesol.apoiar(item.id, solicitante).subscribe(

      // Habilitar novamente o botão
      res => { this.habilitarBotao(botao) },
      err => { this.habilitarBotao(botao) }

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

  /**
   * O Ionic nem sempre envia o botão como target do evento click. Para isso é necessário testar se a span.button-inner
   * não foi enviada em seu lugar
   */

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

  apagarComentario(comentario_id, solicitacao_id){

    let alert = this.alertCtrl.create({
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

          },
        },
        {
          text: "Cancelar",
          role: 'cancel'
        }
      ]
    });

    alert.present();

  }

}