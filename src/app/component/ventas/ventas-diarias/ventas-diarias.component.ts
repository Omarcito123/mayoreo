import { venta } from '../../../model/venta';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../../service/api.service';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-ventas-diarias',
  templateUrl: './ventas-diarias.component.html',
  styleUrl: './ventas-diarias.component.css'
})
export class VentasDiariasComponent {

  ventasByDateList: Array<venta> = [];
  userSesion: any;
  selectedVendedor: number;
  totalVentas = 0;
  totalGanancias = 0;
  ventasVen = new venta();
  selectedSucursal: number;
  dateVenta: Date;

  displayedColumns: string[] = ['unitaverage', 'cantidad', 'descripcion', 'purchaseunitprice', 'totalpurchaseprice', 'totalunitsaleprice', 'totalsaleprice', 'ganancia', 'fecha'];
  dataSource = new MatTableDataSource<venta>();

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private datePipe: DatePipe, private api: ApiService,
    private SpinnerService: NgxSpinnerService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userSesion = this.authService.currentUserValue;
  }

  getVentasByDate(): void {
    this.SpinnerService.show();
    this.ventasVen.dateadd = this.datePipe.transform(this.dateVenta, 'yyyy/MM/dd') || '';
    this.api.getVentasByDate(this.ventasVen).subscribe(
        (response) => {
          if (response != null) {
            if (response.success) {
              this.ventasByDateList = response.data;
              this.montoTotalVentas();
              this.montoTotalGanancias();
              this.dataSource = new MatTableDataSource(this.ventasByDateList);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            } else {
              this.api.openSnackBar(response.message, 'X', 'error');
            }
          } else {
            this.api.openSnackBar('Error cargando las ventas diarias', 'X', 'error');
          }
          this.SpinnerService.hide();
        },
        (error) => {
          this.SpinnerService.hide();
        }
      );
  }

  montoTotalVentas(): void{
    this.totalVentas = this.ventasByDateList.filter(item => item.totalsaleprice != null)
                        .reduce((sum, current) => sum + current.totalsaleprice, 0);
  }

  montoTotalGanancias(): void{
    this.totalGanancias = this.ventasByDateList.filter(item => item.ganancia != null)
                        .reduce((sum, current) => sum + current.ganancia, 0);
  }

  applyFilter(event: Event): void{
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
