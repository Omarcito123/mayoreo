import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../service/api.service';
import { AuthService } from '../../../service/auth.service';
import { pedido } from '../../../model/pedido';

@Component({
  selector: 'app-pendiente-by-name',
  templateUrl: './pendiente-by-name.component.html',
  styleUrl: './pendiente-by-name.component.css'
})
export class PendienteByNameComponent {
  
  userSesion: any;
  pedidoVen = new pedido();
  pendientesList: Array<pedido> = [];
  totalVentasMes = 0;
  totalGanancias = 0;

  displayedColumns: string[] = ['fecha', 'nombre', 'totalvendido', 'totalganancia', 'options'];
  dataSource = new MatTableDataSource<pedido>();

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private api: ApiService, private SpinnerService: NgxSpinnerService,
              public dialog: MatDialog, private authService: AuthService) { }

  ngOnInit(): void {
    this.userSesion = this.authService.currentUserValue;
    this.getPendientesList();
  }

  applyFilter(event: Event): void{
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getPendientesList(): void{
    this.SpinnerService.show();
    this.api.getPendientesList().subscribe(
        (response) => {
          if (response != null) {
            if (response.success) {
              this.pendientesList = response.data;
              this.montoTotalVentas();
              this.montoTotalGanancias();
              this.dataSource = new MatTableDataSource(this.pendientesList);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            } else {
              this.api.openSnackBar(response.message, 'X', 'error');
            }
          } else {
            this.api.openSnackBar('Error al cagas los pendientes', 'X', 'error');
          }
          this.SpinnerService.hide();
        },
        (error) => {
          this.SpinnerService.hide();
        }
      );
  }

  montoTotalVentas(): void{
    this.totalVentasMes = this.pendientesList.filter(item => item.totalsaleprice != null)
                        .reduce((sum, current) => sum + current.totalsaleprice, 0);
  }

  montoTotalGanancias(): void{
    this.totalGanancias = this.pendientesList.filter(item => item.ganancia != null)
                        .reduce((sum, current) => sum + current.ganancia, 0);
  }

  deletePendiente(pendiente: any): void {
    this.SpinnerService.show();
    this.api.deletePendientesList(pendiente).subscribe(
        (response) => {
          if (response != null) {
            if (response.success) {
              this.api.openSnackBar(response.message, 'X', 'error');
              this.getPendientesList();
            } else {
              this.api.openSnackBar(response.message, 'X', 'error');
            }
          } else {
            this.api.openSnackBar('Error al cagas los pendientes', 'X', 'error');
          }
          this.SpinnerService.hide();
        },
        (error) => {
          this.SpinnerService.hide();
        }
      );
  }
}
