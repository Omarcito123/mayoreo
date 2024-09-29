import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { AuthService } from './service/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mayoreoApp';
  currentPath: String;

  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date;

  constructor(private idle: Idle, private keepalive: Keepalive, private router: Router, private location: Location, private authService: AuthService) {

    // Establece un tiempo de espera inactivo de 5 segundos, con fines de prueba.
    idle.setIdle(14400);

    // Establece un período de tiempo de espera de 5 segundos. después de 10 segundos de inactividad, el usuario se considerará agotado.
    idle.setTimeout(10);

    // Establece las interrupciones predeterminadas, en este caso, cosas como clics, desplazamientos, toques en el documento
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');

    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      console.log(this.idleState);
      this.authService.logout();
      //this.router.navigate(['/login']);
    });

    idle.onIdleStart.subscribe(() => {
      /*this.idleState = 'You\'ve gone idle!'
      console.log(this.idleState);
      this.childModal.show();*/
    });

    idle.onTimeoutWarning.subscribe((countdown) => {
      /*this.idleState = 'You will time out in ' + countdown + ' seconds!'
      console.log(this.idleState);*/
    });

    // Establece el intervalo de ping en 15 segundos.
    keepalive.interval(15);

    keepalive.onPing.subscribe(() =>
      this.lastPing = new Date());

    // Revisemos la ruta cada vez que cambie la ruta, detengamos o iniciemos la verificación inactiva según corresponda.
    router.events.subscribe((val) => {

      this.currentPath = location.path();
      if (this.currentPath.search(/authentication\/login/gi) == -1)
        idle.watch();
      else
        idle.stop();

    });
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
}
