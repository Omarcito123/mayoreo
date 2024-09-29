import { Component } from '@angular/core';
import { user } from '../../model/user';
import { ApiService } from '../../service/api.service';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  userLogin: user = new user();

  constructor(private api: ApiService, private router: Router,
    private authService: AuthService, private SpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  login(usuario: user): void {
    if (usuario.username === undefined || usuario.username === ''){
      this.api.openSnackBar('Favor ingresa tu usuario', 'X', 'error');
    } else if (usuario.pass === undefined || usuario.pass === '') {
      this.api.openSnackBar('Favor ingresa tu contraseña', 'X', 'error');
    } else {
      this.SpinnerService.show();
      this.api.login(usuario).subscribe(
        (response) => {
          if (response != null) {
            if (response.message === 'Login correcto') {
              this.authService.setJwt(response.data);              
              this.router.navigate(['/home/']);
            } else {
              this.api.openSnackBar(response.message, 'X', 'error');
            }
          } else {
            this.api.openSnackBar('error', 'X', 'error');
          }
          this.SpinnerService.hide();
        },
        (error) => {
          this.api.openSnackBar(error, 'X', 'error');
          this.SpinnerService.hide();
        }
      );
    }
  }
}
