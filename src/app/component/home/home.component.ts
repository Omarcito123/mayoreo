import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmacionComponent } from './../dialog-confirmacion/dialog-confirmacion.component';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  userSesion: any;
  rol = '';

  constructor(public dialog: MatDialog, private authService: AuthService) { }

  ngOnInit(): void {
    this.userSesion = this.authService.currentUserValue;
    this.rol = this.userSesion.rolname;
  }

  openDialogLogout(): void {
    const dialogRef = this.dialog.open(DialogConfirmacionComponent, {
      width: '350px',
      height: '200px',
      panelClass: 'custom-dialog-container',
      data: {mensaje: '¿Estas seguro que quieres cerrar la sesion?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'aceptar') {
        this.authService.logout();
      }
    });
  }
}
