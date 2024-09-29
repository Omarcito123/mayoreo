import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { user } from '../model/user';
import { ResponseModel } from '../model/response';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { producto } from '../model/producto';
import { venta } from '../model/venta';
import { pedido } from '../model/pedido';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  urlServer: string;
  userCredencial: user;
  userSesion: any;

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private authService: AuthService) {
    this.urlServer = `${environment.apiUrl}`;
  }

  login(data: user): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.urlServer}/users/login`;
    this.userCredencial = new user();
    this.userCredencial.username = btoa(data.username);
    this.userCredencial.pass = btoa(data.pass);
    const body = JSON.stringify(this.userCredencial);
    const options = { headers };
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getAllUsers(): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    const url = `${this.urlServer}/users/getAllUsers`;
    const options = { headers };
    return this.http.get<ResponseModel>(url, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  geInfoPerfil(usuario: user): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.urlServer}/users/getInfoPerfil`;
    this.userSesion = this.authService.currentUserValue;
    usuario.iduser = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(usuario);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updatePerfil(usuario: user): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.urlServer}/userInv/updatePerfilInv`;
    this.userSesion = this.authService.currentUserValue;
    usuario.idusermod = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(usuario);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  changePass(actual: any, nueva: any): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authService.getJwt().replace('Bearer ', '') });
    const url = `${this.urlServer}/users/changePass`;
    this.userSesion = this.authService.currentUserValue;
    const info = { id: this.userSesion.iduser, passActual: actual, newPass: nueva };
    const options = { headers };
    return this.http.post<ResponseModel>(url, info, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveUser(usuario: user): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.urlServer}/users/saveUser`;
    this.userSesion = this.authService.currentUserValue;
    usuario.iduseradd = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(usuario);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateUser(usuario: user): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.urlServer}/users/updateUser`;
    this.userSesion = this.authService.currentUserValue;
    usuario.idusermod = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(usuario);
    return this.http.put<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteUser(usuario: user): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.urlServer}/users/deleteUser`;
    this.userSesion = this.authService.currentUserValue;
    usuario.iduseradd = this.userSesion.iduser;
    const options = { headers };
    const body = JSON.stringify(usuario);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getListProducts(): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    const url = `${this.urlServer}/products/getListProducts`;
    const options = { headers };
    return this.http.get<ResponseModel>(url, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  saveProduct(product: producto): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    const url = `${this.urlServer}/products/saveProduct`;
    const options = { headers };
    this.userSesion = this.authService.currentUserValue;
    product.iduseradd = this.userSesion.iduser;
    const body = JSON.stringify(product);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateProduct(product: producto): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    const url = `${this.urlServer}/products/updateProduct`;
    const options = { headers };
    this.userSesion = this.authService.currentUserValue;
    product.idusermod = this.userSesion.iduser;
    const body = JSON.stringify(product);
    return this.http.put<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  findProductById(product: producto): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    const url = `${this.urlServer}/products/findProductById`;
    const options = { headers };
    const body = JSON.stringify(product);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteProduct(product: producto): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    const url = `${this.urlServer}/products/deleteProduct`;
    const options = { headers };
    const body = JSON.stringify(product);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  findProductByName(product: producto): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    const url = `${this.urlServer}/products/findProductByName`;
    const options = { headers };
    const body = JSON.stringify(product);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  createVenta(ventaList: Array<venta>): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.urlServer}/ventas/createVenta`;
    const options = { headers };
    const body = JSON.stringify(ventaList);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getVentasByDate(ventaFind: venta): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.urlServer}/ventas/getVentasByDate`;
    const options = { headers };
    const body = JSON.stringify(ventaFind);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getVentasMensuales(ventas: venta): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.urlServer}/ventas/getVentasMensuales`;
    const options = { headers };
    const body = JSON.stringify(ventas);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteVenta(venta: any): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.urlServer}/ventas/deleteVentaById`;
    this.userSesion = this.authService.currentUserValue;
    const options = { headers };
    const body = JSON.stringify(venta);
    return this.http.put<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  createPedido(pedidoList: Array<pedido>): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.urlServer}/pendientes/createPedido`;
    const options = { headers };
    const body = JSON.stringify(pedidoList);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getPendientesList(): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    const url = `${this.urlServer}/pendientes/getPendientesList`;
    const options = { headers };
    return this.http.get<ResponseModel>(url, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getPedidosList(): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    const url = `${this.urlServer}/pendientes/getPedidosList`;
    const options = { headers };
    return this.http.get<ResponseModel>(url, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deletePendientesList(item: pedido): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.urlServer}/pendientes/deletePendientesList`;
    const options = { headers };
    const body = JSON.stringify(item);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deletePendiente(pendiente: any): Observable<ResponseModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.urlServer}/pendientes/deletePendienteById`;
    this.userSesion = this.authService.currentUserValue;
    const options = { headers };
    const body = JSON.stringify(pendiente);
    return this.http.put<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  openSnackBar(message: string, action: string, type: string): void {
    this.snackBar.open(message, action, {
      duration: 4000,
      panelClass: type
    });
  }

  handleError(error: any): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
