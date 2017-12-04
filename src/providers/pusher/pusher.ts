import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

// Impedir que o Typescrypt sobrescreva a variável do Pusher
// (Incluída no arquivo index.html)
declare var Pusher;

/*
  Generated class for the PusherProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class PusherProvider {

  // Variáveis usadas no pusher
  private pusher;

  constructor(public http: Http) {

    // Criar uma nova instância do Pusher
    this.pusher = new Pusher('d5bbfbed2c038130dedf', {
      cluster: 'us2',
      encrypted: true
    });

    // Ligar ao canal Solicitações
    let solicitacoes_channel = this.pusher.subscribe('solicitacoes');

    // Ouvir o evento 'nova'
    solicitacoes_channel.bind('nova', (data) => {
      this.teste(data);
    });

  }

  teste(data){

    console.log("Logado atraveś do PusherProvider", data.message);

  }

}
