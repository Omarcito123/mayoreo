import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSpinnerModule } from "ngx-spinner";
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { LoginComponent } from './component/login/login.component';
import { HomeComponent } from './component/home/home.component';
import { AngularMaterialModule } from './util/angular-material/angular-material.module';
import { DialogConfirmacionComponent } from './component/dialog-confirmacion/dialog-confirmacion.component';
import { InventarioComponent } from './component/inventario/inventario.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { VentasComponent } from './component/ventas/ventas.component';
import { UsuariosComponent } from './component/usuarios/usuarios.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddEditProductComponent } from './component/inventario/add-edit-product/add-edit-product.component';
import { VentasMensualesComponent } from './component/ventas/ventas-mensuales/ventas-mensuales.component';
import { VentasDiariasComponent } from './component/ventas/ventas-diarias/ventas-diarias.component';
import { ListVentasComponent } from './component/ventas/list-ventas/list-ventas.component';
import { AddEditUserComponent } from './component/usuarios/add-edit-user/add-edit-user.component';
import { MiPerfilComponent } from './component/mi-perfil/mi-perfil.component';
import { ChangePassComponent } from './component/mi-perfil/change-pass/change-pass.component';
import { PendientesComponent } from './component/pendientes/pendientes.component';
import { PendienteByNameComponent } from './component/pendientes/pendiente-by-name/pendiente-by-name.component';
import { DetallePendienteComponent } from './component/pendientes/detalle-pendiente/detalle-pendiente.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DialogConfirmacionComponent,
    InventarioComponent,
    VentasComponent,
    UsuariosComponent,
    AddEditProductComponent,
    VentasMensualesComponent,
    VentasDiariasComponent,
    ListVentasComponent,
    AddEditUserComponent,
    MiPerfilComponent,
    ChangePassComponent,
    PendientesComponent,
    PendienteByNameComponent,
    DetallePendienteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxSpinnerModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    NgIdleKeepaliveModule.forRoot(),
    NgbModule
  ],
  providers: [
    DatePipe,
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
