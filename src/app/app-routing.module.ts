import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { HomeComponent } from './component/home/home.component';
import { ActiveUrlService } from './util/auth/active-url.service';
import { InventarioComponent } from './component/inventario/inventario.component';
import { UsuariosComponent } from './component/usuarios/usuarios.component';
import { VentasComponent } from './component/ventas/ventas.component';
import { MiPerfilComponent } from './component/mi-perfil/mi-perfil.component';
import { PendientesComponent } from './component/pendientes/pendientes.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [ActiveUrlService], children: [
    { path: 'perfil', component: MiPerfilComponent, canActivate: [ActiveUrlService] },
    { path: 'usuarios', component: UsuariosComponent, canActivate: [ActiveUrlService] },
    { path: 'ventas', component: VentasComponent, canActivate: [ActiveUrlService] },
    { path: 'pendiente', component: PendientesComponent, canActivate: [ActiveUrlService] },
    { path: 'inventario', component: InventarioComponent, canActivate: [ActiveUrlService] },
  ] },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }