import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../service/api.service';
import { AuthService } from '../../../service/auth.service';
import { venta } from '../../../model/venta';
import { lista } from '../../../model/lista';

@Component({
  selector: 'app-ventas-mensuales',
  templateUrl: './ventas-mensuales.component.html',
  styleUrl: './ventas-mensuales.component.css'
})
export class VentasMensualesComponent {

  monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre',
  'Octubre', 'Noviembre', 'Diciembre'];
  monthAct = new lista();
  month1 = new lista();
  month2 = new lista();
  month3 = new lista();
  selectedMonth: number;
  userSesion: any;
  monthsList: any[] = [];
  ventasVen = new venta();
  ventasMensualesList: Array<venta> = [];
  totalVentasMes = 0;
  totalGanancias = 0;

  displayedColumns: string[] = ['fecha', 'totalvendido', 'totalganancia'];
  dataSource = new MatTableDataSource<venta>();

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private api: ApiService, private SpinnerService: NgxSpinnerService,
              public dialog: MatDialog, private authService: AuthService) { }

  ngOnInit(): void {
    this.userSesion = this.authService.currentUserValue;
    this.getMonthList();
  }

  applyFilter(event: Event): void{
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getMonthList(): void{
    const d = new Date();
    const actual = d.getMonth() + 1;
    const nameMonthAct = this.monthNames[d.getMonth()] + ' ' + d.getFullYear();
    this.monthAct.value = d.getMonth() + 1;
    this.monthAct.description = nameMonthAct;

    d.setMonth(d.getMonth() - 1);
    d.toLocaleDateString();

    const nameMonth1 = this.monthNames[d.getMonth()] + ' ' + d.getFullYear();
    this.month1.value = d.getMonth() + 1;
    this.month1.description = nameMonth1;

    d.setMonth(d.getMonth() - 1);
    d.toLocaleDateString();

    const nameMonth2 = this.monthNames[d.getMonth()] + ' ' + d.getFullYear();
    this.month2.value = d.getMonth() + 1;
    this.month2.description = nameMonth2;

    d.setMonth(d.getMonth() - 1);
    d.toLocaleDateString();

    const nameMonth3 = this.monthNames[d.getMonth()] + ' ' + d.getFullYear();
    this.month3.value = d.getMonth() + 1;
    this.month3.description = nameMonth3;

    this.monthsList.push(this.monthAct);
    this.monthsList.push(this.month1);
    this.monthsList.push(this.month2);
    this.monthsList.push(this.month3);
  }

  getVentasMensuales(): void{
    this.SpinnerService.show();
    this.ventasVen.dateadd = this.selectedMonth + '';
    this.ventasVen.datemod = this.monthsList.find(x => x.value === this.selectedMonth).description;
    this.api.getVentasMensuales(this.ventasVen).subscribe(
        (response) => {
          if (response != null) {
            if (response.success) {
              this.ventasMensualesList = response.data;
              this.montoTotalVentas();
              this.montoTotalGanancias();
              this.dataSource = new MatTableDataSource(this.ventasMensualesList);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            } else {
              this.api.openSnackBar(response.message, 'X', 'error');
            }
          } else {
            this.api.openSnackBar('Error al cagas las ventas mensuales', 'X', 'error');
          }
          this.SpinnerService.hide();
        },
        (error) => {
          this.SpinnerService.hide();
        }
      );
  }

  montoTotalVentas(): void{
    this.totalVentasMes = this.ventasMensualesList.filter(item => item.totalsaleprice != null)
                        .reduce((sum, current) => sum + current.totalsaleprice, 0);
  }

  montoTotalGanancias(): void{
    this.totalGanancias = this.ventasMensualesList.filter(item => item.ganancia != null)
                        .reduce((sum, current) => sum + current.ganancia, 0);
  }
}