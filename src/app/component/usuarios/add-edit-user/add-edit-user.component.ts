import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { user } from '../../../model/user';
import { lista } from '../../../model/lista';
import { ApiService } from '../../../service/api.service';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrl: './add-edit-user.component.css'
})
export class AddEditUserComponent {

  hide = true;
  selectedEstado: number;
  selectedSucursal: number;
  selectedRol: number;
  listaEstados: lista[];
  listaRoles: lista[];
  usuario = new user();
  isNewUser = true;

  constructor(
    public dialogRef: MatDialogRef<AddEditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiService,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.getRolesList();
    if (this.data != null) {
      this.selectedEstado = this.data.active;
      this.selectedRol = this.data.idrol;
      this.selectedSucursal = this.data.idsucursal;
      this.usuario.iduser = this.data.iduser;
      this.usuario.firstname = this.data.firstname;
      this.usuario.secondname = this.data.secondname;
      this.usuario.surname = this.data.surname;
      this.usuario.secondsurname = this.data.secondsurname;
      this.usuario.username = this.data.username;
      this.usuario.dateadd = this.data.dateadd;
      this.usuario.pass = this.data.pass;
      this.usuario.idrol = this.data.idrol;
      this.usuario.email = this.data.email;
      this.usuario.phone = this.data.phone;
      this.usuario.dateborn = this.data.dateborn;
      this.isNewUser = false;
    }
  }

  showHidenPass(): void {
    this.hide = !this.hide;
  }

  getRolesList(): void {
    this.listaRoles = [
      { value: 1, description: 'Administrador' },
      { value: 2, description: 'Usuario' },
    ];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveUser(): void {
      this.usuario.idrol = this.selectedRol;
      if (this.isNewUser) {
        this.SpinnerService.show();
        this.api.saveUser(this.usuario).subscribe(
          (response) => {
            if (response != null) {
              if (response.success) {
                this.dialogRef.close();
                this.api.openSnackBar(response.message, 'X', 'success');
              } else {
                this.api.openSnackBar(response.message, 'X', 'error');
              }
            } else {
              this.api.openSnackBar('Error al guardar el usuario', 'X', 'error');
            }
            this.SpinnerService.hide();
          },
          (error) => {
            this.SpinnerService.hide();
            if (error.includes('403')) {
              this.authService.logout();
            }
          }
        );
      } else {
        this.SpinnerService.show();
        this.usuario.idrol = this.selectedRol;
        this.api.updateUser(this.usuario).subscribe(
          (response) => {
            if (response != null) {
              if (response.success) {
                this.dialogRef.close();
                this.api.openSnackBar(
                  'Usuario modificado exitosamente',
                  'X',
                  'success'
                );
              } else {
                this.api.openSnackBar(response.message, 'X', 'error');
              }
            } else {
              this.api.openSnackBar('Error al actualizar el usuario', 'X', 'error');
            }
            this.SpinnerService.hide();
          },
          (error) => {
            this.SpinnerService.hide();
            if (error.includes('403')) {
              this.authService.logout();
            }
          }
        );
      }
  }
}
