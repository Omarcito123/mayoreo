import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { venta } from '../../../model/venta';
import { user } from '../../../model/user';
import { ApiService } from '../../../service/api.service';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-list-ventas',
  templateUrl: './list-ventas.component.html',
  styleUrl: './list-ventas.component.css'
})
export class ListVentasComponent {

  ventasTodayList: Array<venta> = [];
  userSesion: any;
  selectedVendedor: number;
  totalVentas = 0;
  totalGanancias = 0;
  usersList: user[];
  ventasVen = new venta();
  rol = '';

  displayedColumns: string[] = ['unitaverage', 'cantidad', 'descripcion', 'purchaseunitprice', 'totalpurchaseprice', 'totalunitsaleprice', 'totalsaleprice', 'ganancia', 'fecha', 'options'];
  dataSource = new MatTableDataSource<venta>();

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private datePipe: DatePipe, private api: ApiService,
              private SpinnerService: NgxSpinnerService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userSesion = this.authService.currentUserValue;
    this.ventasVen.iduseradd = this.userSesion.iduser;
    this.rol = this.userSesion.rolname;
    this.getVentasToday();
  }

  getVentasToday(): void {
    this.SpinnerService.show();
    const myDate = new Date();
    this.ventasVen.dateadd = this.datePipe.transform(myDate, 'yyyy/MM/dd') || '';
    this.api.getVentasByDate(this.ventasVen).subscribe(
        (response) => {
          if (response != null) {
            if (response.success) {
              this.ventasTodayList = response.data;
              this.montoTotalVentas();
              this.montoTotalGanancias();
              this.dataSource = new MatTableDataSource(this.ventasTodayList);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            } else {
              this.api.openSnackBar(response.message, 'X', 'error');
            }
          } else {
            this.api.openSnackBar('Error al cargar las ventas del dia', 'X', 'error');
          }
          this.SpinnerService.hide();
        },
        (error) => {
          this.SpinnerService.hide();
        }
      );
  }

  montoTotalVentas(): void{
    this.totalVentas = this.ventasTodayList.filter(item => item.totalsaleprice != null)
                        .reduce((sum, current) => sum + current.totalsaleprice, 0);
  }

  montoTotalGanancias(): void{
    this.totalGanancias = this.ventasTodayList.filter(item => item.ganancia != null)
                        .reduce((sum, current) => sum + current.ganancia, 0);
  }

  applyFilter(event: Event): void{
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteVenta(venta1: any): void{
    this.SpinnerService.show();
    this.api.deleteVenta(venta1).subscribe(
        (response) => {
          if (response != null) {
            if (response.success) {
              this.api.openSnackBar(response.message, 'X', 'success');
              this.getVentasToday();
            } else {
              this.api.openSnackBar(response.message, 'X', 'error');
            }
          } else {
            this.api.openSnackBar('Error no e pudo eliminar el producto de la venta', 'X', 'error');
          }
          this.SpinnerService.hide();
        },
        (error) => {
          this.SpinnerService.hide();
        }
      );
  }
}