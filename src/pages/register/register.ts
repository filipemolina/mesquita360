import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GesolProvider } from "../../providers/gesol/gesol";
import { AlertController } from 'ionic-angular';
import { ConfigProvider } from "../../providers/config/config";
import { HomePage } from "../home/home";

/**
 * Generated class for the RegisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  masks: any;

  nome           : any = "";
  email          : any = "";
  cpf            : any = "";
  senha          : any = "";
  confirmar_senha: any = "";

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public gesol: GesolProvider,
              public alertCtrl: AlertController,
              public config: ConfigProvider) {

    // Máscaras que serão usadas no template

    this.masks = {
      cpf: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/],
    };

  }

  enviar(){

    this.gesol
        .criarUsuario(this.nome, this.email, this.cpf.trim(), this.senha, this.confirmar_senha)
        .subscribe(
          // Caso de Sucesso
          res => {

          // Gravar a token do Gesol
          this.config.setGesolToken(res.accessToken);

          // Gravar as informações do usuário
          this.config.setGesolNome(this.nome);
          this.config.setGesolUserName(this.email);
          this.config.setGesolCPF(this.cpf.trim());

          // Navegar para a página inicial
          this.navCtrl.setRoot(HomePage);

        }, 
          // Caso de erro
          err => {

            // Objeto com todos os erros
            let erros = JSON.parse(err._body);
            let mensagem: string = "";

            //Iterar pelos erros e concatenar em uma variável de texto

            // Iterar pelas propriedades do objeto com os erros
            for(var campo in erros){
              if(erros.hasOwnProperty(campo)){

                // Montar uma variável com todas as mensagens de erro
                mensagem += erros[campo][0] + "<br>";

              }
            }
            
            // Criar um alerta com as mensagens de erro concatenadas
            let alert = this.alertCtrl.create({
              title: "Atenção!",
              subTitle: mensagem,
              buttons: ['OK']
            });

            // Mostrar o alerta
            alert.present();

          }
        
        );

  }

}
