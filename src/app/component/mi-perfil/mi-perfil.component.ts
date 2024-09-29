import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../../service/api.service';
import { AuthService } from '../../service/auth.service';
import { user } from '../../model/user';
import { ChangePassComponent } from './change-pass/change-pass.component';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent {

  hide = true;
  myPerfil = new user();
  userSesion: any;
  user = new user();
  rol = '';

  constructor(private api: ApiService, public dialog: MatDialog,
              private SpinnerService: NgxSpinnerService, private authService: AuthService) {
    }

  ngOnInit(): void {
    this.userSesion = this.authService.currentUserValue;
    this.rol = this.userSesion.rolname;
    this.geInfoPerfil();
  }

  showHidenPass(): void {
    this.hide = !this.hide;
  }

  geInfoPerfil(): void{
    this.SpinnerService.show();
    this.api.geInfoPerfil(this.user).subscribe(
          (response) => {
            if (response != null) {
              if (response.success) {
                this.myPerfil = response.data;
                if(this.myPerfil.dateborn != null){
                  if(this.myPerfil.dateborn != ''){
                    var dates = this.myPerfil.dateborn.split('/');
                    this.myPerfil.dateborn = dates[2] + '-' + dates[1] + '-' + dates[0];
                  }
                }                
              } else {
                this.api.openSnackBar(response.message, 'X', 'error');
              }
            } else {
              this.api.openSnackBar('Error obteniendo la informacion del perfil', 'X', 'error');
            }
            this.SpinnerService.hide();
          },
          (error) => {
            this.SpinnerService.hide();
            if (error.includes('403')){
              this.authService.logout();
            }
          }
        );
  }

  changePass(): void {
    const dialogRef = this.dialog.open(ChangePassComponent, {
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      this.geInfoPerfil();
    });
  }

  updatePerfil(): void{
    this.user.iduser = this.myPerfil.iduser;
    this.user.firstname = this.myPerfil.firstname;
    this.user.secondname = this.myPerfil.secondname;
    this.user.surname = this.myPerfil.surname;
    this.user.secondsurname = this.myPerfil.secondsurname;
    this.user.email = this.myPerfil.email;
    this.user.phone = this.myPerfil.phone;
    this.user.dateborn = this.myPerfil.dateborn;
    this.SpinnerService.show();
    this.api.updatePerfil(this.user).subscribe(
      (response) => {
        if (response != null) {
          if (response.success) {
            this.api.openSnackBar(response.message, 'X', 'success');
          } else {
            this.api.openSnackBar(response.message, 'X', 'error');
          }
        } else {
          this.api.openSnackBar('Error al actualizar la informacion del perfil', 'X', 'error');
        }
        this.SpinnerService.hide();
      },
      (error) => {
        this.SpinnerService.hide();
        if (error.includes('403')){
          this.authService.logout();
        }
      }
    );
  }
}
