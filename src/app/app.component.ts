import { Component, ViewChild } from '@angular/core';
import { Events, Platform, NavController, MenuController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { ConfigProvider } from "../providers/config/config";
import { FCM } from '@ionic-native/fcm';
import { GesolProvider } from '../providers/gesol/gesol';

// Fazer com que o TypeScript não sobrescreva a variável do google
declare var google;

@Component({
  templateUrl: 'app.html',
})
export class MyApp {

  // Variáveis necessárias para guardar as solicitações e as mensagens associadas

  public solicitacoes = [];
  public minhasSolicitacoes = [];
  public meses = [];
  public novos_comentarios = [];
  public apoios = [];
  public meus_apoios = [];

  // Para acessar o navController no app.component é necessário usar o @ViewChild()
  @ViewChild('content') nav: NavController;

  constructor(
      private platform: Platform,
      statusBar: StatusBar,
      splashScreen: SplashScreen, 
      public config: ConfigProvider,
      public menuController : MenuController,
      private fcm : FCM,
      public gesol : GesolProvider,
      public alertCtrl: AlertController,
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

      platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        statusBar.overlaysWebView(false);
        statusBar.backgroundColorByHexString('#3d276b');
        splashScreen.hide();

        // Definir a home page como página inicial
        this.nav.setRoot(HomePage);

        this.verificarVersao();

        ////////////////////////////////////////////////////////////////////////
        // Eventos                                                            //
        ////////////////////////////////////////////////////////////////////////

          events.subscribe('recarregar:solicitacoes', () => {

            console.log("Recebeu o evento recarregar:solicitacoes");

            this.carregaSolicitacoes();

          });

          events.subscribe('recarregar:minhas', () => {

            console.log("Recebeu evento recarregar:minhas")

            this.carregaMinhasSolicitacoes();

          });

        ////////////////////////////////////////////////////////////////////////
        // Eventos                                                            //
        ////////////////////////////////////////////////////////////////////////

        ////////////////////////////////////////////////////////////////////////
        // FCM                                                                //
        ////////////////////////////////////////////////////////////////////////

          // Setar a token do FCM no ConfigProvider
          // Ela só será enviada para o servidor quando o usuário logar
          fcm.getToken().then(token => {

            this.config.FCM_ID = token;

          });

          // Quando a token do FCM expirar, outra é gerada automaticamente
          // Essa função é executada quando isso acontece
          fcm.onTokenRefresh().subscribe(token => {

            // Testar se o usuário está logado antes de tentar mudar a token dele no banco de dados
            if(this.config.getLogado())
              this.gesol.alteraFcmId(this.config.FCM_ID);
            

          });
          
          // Notificações FCM
          fcm.onNotification().subscribe( data => {

            console.log("Recebida do Firebase", data);

          });

        ////////////////////////////////////////////////////////////////////////
        // FCM                                                                //
        ////////////////////////////////////////////////////////////////////////
        
      });
  }
  
  // Função que recebe uma página e navega para ela
  // A página deve ser uma das variáveis declaradas acima

  goToPage(pagina: string)
  {
    this.menuController.close();
    this.nav.push(pagina);
  }

  sair(){
      // Fechar o menu
      this.menuController.close();

      //Apagar todos os dados do armazenamento interno do telefone
      this.config.logout();

      // Desabilitar o menu
      this.menuController.enable(false);
  }

  estaLogado(){
    return this.config.getLogado()
  }

  naoEstaLogado(){
    return !this.config.getLogado();
  }

  verificarVersao(){

    this.gesol.verificaVersao().subscribe(res => {
      let resposta : any = res;

      if(resposta._body != this.config.versao){

        let alert = this.alertCtrl.create({
          title: "Atenção",
          subTitle: "Você está utilizando uma versão antiga do aplicativo. Entre em contato com o setor de TI para obter a versão mais recente",
          buttons: [{
            text: "Ok",
            handler: () => {
              this.platform.exitApp();
            }
          }]
        });

        alert.present();

      }
    })

  }

  /**
   * Carregar as solicitações do Gesol e gravar no Config de onde elas serão exibidas pelas páginas
   * HomePage e Chamados
   */

  carregaSolicitacoes(){

    console.log("Chamou carregarSolicitacoes na App Component");
    
      this.gesol.getSolicitacoes().subscribe(
        
        res => {
                
          // Preencher a variável temporaria de solicitações
  
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
  
          // Gravar as solicitações já preparadas no config
          this.config.setSolicitacoes(this.solicitacoes);
  
          console.log("Terminou de carregar solicitações");
        
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

  carregaMinhasSolicitacoes(){

    console.log("Chamou o carregaMinhasSOlicitacoes");

    // Fazer a requisição ao Gesol pelas solicitações do usuário
    this.gesol.getMinhasSolicitacoes(true).subscribe(
      // Caso de sucesso
      res => {
        
        this.minhasSolicitacoes = res;

        for(let item in this.minhasSolicitacoes) {
          // Criar um objeto de Data com a propriedade created_at do item
          let data = new Date(this.minhasSolicitacoes[item].created_at);

          // Formatar a data para um formato legível para seres humands
          this.minhasSolicitacoes[item].data = data.getDate() + " de " + this.meses[data.getMonth()] + " de " + data.getFullYear();

          // Criar uma posição no vetor de novos comentários para essa solicitação
          this.novos_comentarios[this.minhasSolicitacoes[item].id] = "";

          // Criar uma posição no vetor de apoios com o id da solicitação e a quantidade de apoios
          this.apoios[this.minhasSolicitacoes[item].id] = this.minhasSolicitacoes[item].apoiadores_count;

          // Testar se o usuário apoiou esta solicitação
          let meus = this.minhasSolicitacoes[item].apoiadores.filter(apoiador => (apoiador.id == 21));

          // Adicionar ao vetor que guarda apenas os ids das solicitações apoiadas pelo usuário atualmente logado
          if(meus.length)
            this.meus_apoios.push(meus[0].pivot.solicitacao_id);

          // Criar um vetor para as mensagens dessa solicitação
          this.minhasSolicitacoes[item].mensagens = [];
      }

      this.config.setMinhasSolicitacoes(this.minhasSolicitacoes);

      console.log("Acabou de carregar minhas solicitações");

  },
  // Caso de falha
  fail => {
      console.log("Falha na solicitação (minhasSolicitacoes -> AppComponent)", fail);
  });

  }

}

