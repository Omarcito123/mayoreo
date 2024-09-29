import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../../../service/api.service';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrl: './change-pass.component.css'
})
export class ChangePassComponent {
  actual = '';
  nueva = '';
  confirma = '';
  hide = true;
  hide2 = true;
  hide3 = true;

  constructor(
    public dialogRef: MatDialogRef<ChangePassComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private api: ApiService,
    private SpinnerService: NgxSpinnerService, private authService: AuthService) {
    }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  showHidenPass(): void{
    this.hide = !this.hide;
  }

  showHidenPass2(): void{
    this.hide2 = !this.hide2;
  }

  showHidenPass3(): void{
    this.hide3 = !this.hide3;
  }

  changePass(): void{
    if (this.actual === '' || this.nueva === '' || this.confirma === ''){
      this.api.openSnackBar('Todos los campos son requeridos', 'X', 'error');
    }else{
      if (this.nueva !== this.confirma){
        this.api.openSnackBar('La nueva contraseña y la confirmacion no coinciden', 'X', 'error');
      }else{
        this.SpinnerService.show();
        this.api.changePass(this.actual, this.nueva).subscribe(
          (response) => {
            if (response != null) {
              if (response.success) {
                this.api.openSnackBar(response.message, 'X', 'success');
                this.onNoClick();
              } else {
                this.api.openSnackBar(response.message, 'X', 'error');
              }
            } else {
              this.api.openSnackBar('Error al cambiar la contraseña', 'X', 'error');
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
  }
}
