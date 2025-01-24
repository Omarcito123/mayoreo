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
  month4 = new lista();
  month5 = new lista();
  month6 = new lista();
  month7 = new lista();
  month8 = new lista();
  month9 = new lista();
  month10 = new lista();
  month11 = new lista();
  month12 = new lista();
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

    d.setMonth(d.getMonth() - 1);
    d.toLocaleDateString();

    const nameMonth4 = this.monthNames[d.getMonth()] + ' ' + d.getFullYear();
    this.month4.value = d.getMonth() + 1;
    this.month4.description = nameMonth4;

    d.setMonth(d.getMonth() - 1);
    d.toLocaleDateString();

    const nameMonth5 = this.monthNames[d.getMonth()] + ' ' + d.getFullYear();
    this.month5.value = d.getMonth() + 1;
    this.month5.description = nameMonth5;

    d.setMonth(d.getMonth() - 1);
    d.toLocaleDateString();

    const nameMonth6 = this.monthNames[d.getMonth()] + ' ' + d.getFullYear();
    this.month6.value = d.getMonth() + 1;
    this.month6.description = nameMonth6;

    d.setMonth(d.getMonth() - 1);
    d.toLocaleDateString();

    const nameMonth7 = this.monthNames[d.getMonth()] + ' ' + d.getFullYear();
    this.month7.value = d.getMonth() + 1;
    this.month7.description = nameMonth7;

    d.setMonth(d.getMonth() - 1);
    d.toLocaleDateString();

    const nameMonth8 = this.monthNames[d.getMonth()] + ' ' + d.getFullYear();
    this.month8.value = d.getMonth() + 1;
    this.month8.description = nameMonth8;

    d.setMonth(d.getMonth() - 1);
    d.toLocaleDateString();

    const nameMonth9 = this.monthNames[d.getMonth()] + ' ' + d.getFullYear();
    this.month9.value = d.getMonth() + 1;
    this.month9.description = nameMonth9;

    d.setMonth(d.getMonth() - 1);
    d.toLocaleDateString();

    const nameMonth10 = this.monthNames[d.getMonth()] + ' ' + d.getFullYear();
    this.month10.value = d.getMonth() + 1;
    this.month10.description = nameMonth10;

    d.setMonth(d.getMonth() - 1);
    d.toLocaleDateString();

    const nameMonth11 = this.monthNames[d.getMonth()] + ' ' + d.getFullYear();
    this.month11.value = d.getMonth() + 1;
    this.month11.description = nameMonth11;

    d.setMonth(d.getMonth() - 1);
    d.toLocaleDateString();

    const nameMonth12 = this.monthNames[d.getMonth()] + ' ' + d.getFullYear();
    this.month12.value = d.getMonth() + 1 + + d.getFullYear();
    this.month12.description = nameMonth12;

    this.monthsList.push(this.monthAct);
    this.monthsList.push(this.month1);
    this.monthsList.push(this.month2);
    this.monthsList.push(this.month3);
    this.monthsList.push(this.month4);
    this.monthsList.push(this.month5);
    this.monthsList.push(this.month6);
    this.monthsList.push(this.month7);
    this.monthsList.push(this.month8);
    this.monthsList.push(this.month9);
    this.monthsList.push(this.month10);
    this.monthsList.push(this.month11);
    this.monthsList.push(this.month12);
  }

  getVentasMensuales(): void{
    this.SpinnerService.show();
    this.ventasVen.dateadd = this.selectedMonth + '';
    this.ventasVen.datemod = this.monthsList.find(x => x.value === this.selectedMonth).description;
    console.log(this.ventasVen);
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