import { DialogConfirmacionComponent } from './../dialog-confirmacion/dialog-confirmacion.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../service/api.service';
import { AuthService } from '../../service/auth.service';
import { user } from '../../model/user';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {

  userList: Array<user> = [];

  displayedColumns: string[] = ['firstname', 'surname', 'username', 'email', 'phone', 'options'];
  dataSource = new MatTableDataSource<user>();

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private api: ApiService, private SpinnerService: NgxSpinnerService,
              public dialog: MatDialog, private authService: AuthService) { }

  ngOnInit(): void {
    this.getUsersList();
  }

  applyFilter(event: Event): void{
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getUsersList(): void{
    this.SpinnerService.show();
    this.api.getAllUsers().subscribe(
        (response) => {
          if (response != null) {
            if (response) {
              this.userList = response.data;
              this.dataSource = new MatTableDataSource(this.userList);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            } else {
              this.api.openSnackBar('Error al obtener las lista de usuarios', 'X', 'error');
            }
          } else {
            this.api.openSnackBar('Error al obtener las lista de usuarios', 'X', 'error');
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

  addUser(): void {
    const dialogRef = this.dialog.open(AddEditUserComponent, {
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getUsersList();
    });
  }

  editUser(usuarioEdit: any): void{
    const dialogRef = this.dialog.open(AddEditUserComponent, {
      data: usuarioEdit
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getUsersList();
    });
  }

  deleteUsuario(usuarioDe: any): void{
    const dialogRef = this.dialog.open(DialogConfirmacionComponent, {
      width: '350px',
      height: '210px',
      data: {mensaje: 'Esta seguro que desea eliminar al usuario?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'aceptar') {
        this.SpinnerService.show();
        this.api.deleteUser(usuarioDe).subscribe(
          (response) => {
            if (response != null) {
              if (response.success) {
                this.getUsersList();
                this.api.openSnackBar('El usuario fue eliminado con exito!', 'X', 'success');
              } else {
                this.api.openSnackBar(response.message, 'X', 'error');
              }
            } else {
              this.api.openSnackBar('Error al eliminar el usuario', 'X', 'error');
            }
            this.SpinnerService.hide();
          },
          (error) => {
            this.SpinnerService.hide();
            this.api.openSnackBar(error, 'X', 'error');
          }
        );
      }
    });
  }
}
