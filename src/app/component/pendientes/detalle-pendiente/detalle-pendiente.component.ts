import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { pedido } from '../../../model/pedido';
import { user } from '../../../model/user';
import { ApiService } from '../../../service/api.service';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-detalle-pendiente',
  templateUrl: './detalle-pendiente.component.html',
  styleUrl: './detalle-pendiente.component.css'
})
export class DetallePendienteComponent {
  pedidosList: Array<pedido> = [];
  userSesion: any;
  selectedVendedor: number;
  totalVentas = 0;
  totalGanancias = 0;
  usersList: user[];
  pedidosVen = new pedido();
  rol = '';

  displayedColumns: string[] = ['nombre', 'unitaverage', 'cantidad', 'descripcion', 'purchaseunitprice', 'totalpurchaseprice', 'totalunitsaleprice', 'totalsaleprice', 'ganancia', 'fecha', 'options'];
  dataSource = new MatTableDataSource<pedido>();

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private datePipe: DatePipe, private api: ApiService,
              private SpinnerService: NgxSpinnerService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userSesion = this.authService.currentUserValue;
    this.pedidosVen.iduseradd = this.userSesion.iduser;
    this.rol = this.userSesion.rolname;
    this.getPedidosList();
  }

  getPedidosList(): void {
    this.SpinnerService.show();
    this.api.getPedidosList().subscribe(
        (response) => {
          if (response != null) {
            if (response.success) {
              this.pedidosList = response.data;
              this.montoTotalVentas();
              this.montoTotalGanancias();
              this.dataSource = new MatTableDataSource(this.pedidosList);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            } else {
              this.api.openSnackBar(response.message, 'X', 'error');
            }
          } else {
            this.api.openSnackBar('Error al cargar la lista de pedidos', 'X', 'error');
          }
          this.SpinnerService.hide();
        },
        (error) => {
          this.SpinnerService.hide();
        }
      );
  }

  montoTotalVentas(): void{
    this.totalVentas = this.pedidosList.filter(item => item.totalsaleprice != null)
                        .reduce((sum, current) => sum + current.totalsaleprice, 0);
  }

  montoTotalGanancias(): void{
    this.totalGanancias = this.pedidosList.filter(item => item.ganancia != null)
                        .reduce((sum, current) => sum + current.ganancia, 0);
  }

  applyFilter(event: Event): void{
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deletePendiente(pendiente: any): void{
    this.SpinnerService.show();
    this.api.deletePendiente(pendiente).subscribe(
        (response) => {
          if (response != null) {
            if (response.success) {
              this.api.openSnackBar(response.message, 'X', 'success');
              this.getPedidosList();
            } else {
              this.api.openSnackBar(response.message, 'X', 'error');
            }
          } else {
            this.api.openSnackBar('Error al eliminar el producto del pendiente', 'X', 'error');
          }
          this.SpinnerService.hide();
        },
        (error) => {
          this.SpinnerService.hide();
        }
      );
  }
}
