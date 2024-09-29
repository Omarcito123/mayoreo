import { DialogConfirmacionComponent } from './../dialog-confirmacion/dialog-confirmacion.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../service/api.service';
import { AuthService } from '../../service/auth.service';
import { AddEditProductComponent } from './add-edit-product/add-edit-product.component';
import { producto } from '../../model/producto';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent {

  product = new producto();
  productList: producto[];
  userSesion: any;
  totalInversion = 0;

  displayedColumns: string[] = ['codigo', 'unidadmedida', 'existencias', 'nombre', 'preciocompra', 'preciocompratotal', 'precioventa', 'precioventatotal', 'creado', 'modificado', 'options'];
  dataSource = new MatTableDataSource<producto>();

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private api: ApiService,
              private SpinnerService: NgxSpinnerService, public dialog: MatDialog,
              private authService: AuthService) { 

              }

  ngOnInit(): void {
    this.userSesion = this.authService.currentUserValue;
    this.getProductsList();
  }

  getProductsList(): void {
    this.SpinnerService.show();
    this.api.getListProducts().subscribe(
        (response) => {
          if (response != null) {
            if (response.success) {
              this.productList = response.data;
              this.dataSource = new MatTableDataSource(this.productList);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              this.inversionTotalVentas();
            } else {
              this.api.openSnackBar(response.message, 'X', 'error');
            }
          } else {
            this.api.openSnackBar('Error al obtener los productos', 'X', 'error');
          }
          this.SpinnerService.hide();
        },
        (error) => {
          this.SpinnerService.hide();
          this.api.openSnackBar(error, 'X', 'error');
        }
      );
  }

  inversionTotalVentas(): void{
    this.totalInversion = this.productList.filter(item => item.purchaseprice != null)
                        .reduce((sum, current) => sum + (current.purchaseprice * current.existence), 0);
  }

  addProduct(): void {
    const dialogRef = this.dialog.open(AddEditProductComponent, {
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getProductsList();
    });
  }

  editProduct(productEdit: any): void{
    const dialogRef = this.dialog.open(AddEditProductComponent, {
      data: productEdit
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getProductsList();
    });
  }

  saveProduct(product: any): void {
    this.SpinnerService.show();
    this.api.saveProduct(product).subscribe(
        (response) => {
          if (response != null) {
            if (response.success) {
              this.api.openSnackBar(response.message, 'X', 'success');
            } else {
              this.api.openSnackBar(response.message, 'X', 'error');
            }
          } else {
            this.api.openSnackBar('Error al guardar el producto', 'X', 'error');
          }
          this.SpinnerService.hide();
        },
        (error) => {
          this.SpinnerService.hide();
          this.api.openSnackBar(error, 'X', 'error');
        }
      );
  }

  deleteProduct(product: any): void{
    const dialogRef = this.dialog.open(DialogConfirmacionComponent, {
      width: '350px',
      height: '200px',
      data: {mensaje: 'Esta seguro que desea eliminar el producto?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'aceptar') {
        this.SpinnerService.show();
        product.iduseradd = this.userSesion.iduser;
        this.api.deleteProduct(product).subscribe(
        (response) => {
          if (response != null) {
            if (response.success) {
              this.getProductsList();
              this.api.openSnackBar('El producto fue eliminado con exito!', 'X', 'success');
            } else {
              this.api.openSnackBar(response.message, 'X', 'error');
            }
          } else {
            this.api.openSnackBar('Error al eliminar el producto', 'X', 'error');
          }
          this.SpinnerService.hide();
        },
        (error) => {
          this.SpinnerService.hide();
          this.api.openSnackBar(error, 'X', 'error');
        }
      );
      }
    });
  }

  applyFilter(event: Event): void{
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
