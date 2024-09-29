import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../service/api.service';
import { AuthService } from '../../../service/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { producto } from '../../../model/producto';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrl: './add-edit-product.component.css'
})
export class AddEditProductComponent {

  filteredOptions: Observable<string[]>;
  userSesion: any;
  productAddEdit = new producto();
  disabledTipo = false;
  selectedValue: number = 2;

  constructor(
    public dialogRef: MatDialogRef<AddEditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private api: ApiService,
    private SpinnerService: NgxSpinnerService, private authService: AuthService) {
    }

    ngOnInit(): void {
      this.userSesion = this.authService.currentUserValue;
      if (this.data != null){
        this.productAddEdit.idproduct = this.data.idproduct;
        this.productAddEdit.dateadd = this.data.dateadd;
        this.productAddEdit.datemod = this.data.datemod;
        this.productAddEdit.quantity = this.data.quantity;
        this.productAddEdit.existence = this.data.existence;
        this.productAddEdit.productname = this.data.productname;
        this.productAddEdit.iduseradd = this.data.iduseradd;
        this.productAddEdit.idusermod = this.data.idusermod;
        this.productAddEdit.purchaseprice = this.data.purchaseprice;
        this.productAddEdit.saleprice = this.data.saleprice;
        this.productAddEdit.unitaverage = this.data.unitaverage;
        this.disabledTipo = true;
        this.selectedValue = 1;
      }
    }

    saveProduct(): void{
    if (this.productAddEdit.productname == null){
        this.api.openSnackBar('Nombre del producto incorrecto', 'X', 'error');
      }else if (this.productAddEdit.productname === undefined){
        this.api.openSnackBar('Nombre del producto incorrecto', 'X', 'error');
      }else if (this.productAddEdit.productname === ''){
        this.api.openSnackBar('Nombre del producto incorrecto', 'X', 'error');
      }else{
        this.productAddEdit.iduseradd = this.userSesion.iduser;
        if (this.selectedValue === 1){
          this.SpinnerService.show();
          this.api.updateProduct(this.productAddEdit).subscribe(
            (response) => {
              if (response != null) {
                if (response.success) {
                  this.dialogRef.close();
                  this.api.openSnackBar('Producto agregado exitosamente', 'X', 'success');
                } else {
                  this.api.openSnackBar(response.message, 'X', 'error');
                }
              } else {
                this.api.openSnackBar('Error al atualizar el producto', 'X', 'error');
              }
              this.SpinnerService.hide();
            },
            (error) => {
              this.SpinnerService.hide();
              if (error.includes('403')){
                this.authService.logout();
              }
            }
          );
        }else if (this.selectedValue === 2){
          this.SpinnerService.show();
          this.api.saveProduct(this.productAddEdit).subscribe(
            (response) => {
              if (response != null) {
                if (response.success) {
                  this.dialogRef.close();
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
              if (error.includes('403')){
                this.authService.logout();
              }
            }
          );
        }
      }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteProductName(): void {
    if (this.productAddEdit != null) {
      this.productAddEdit.productname = '';
    }
  }

  fillDataProduct(): void{
    this.SpinnerService.show();
      this.api.findProductById(this.productAddEdit).subscribe(
        (response) => {
          if (response != null) {
            if (response.success) {
              this.productAddEdit = response.data;
            } else {
              this.api.openSnackBar(response.message, 'X', 'error');
            }
          } else {
            this.api.openSnackBar('Error al buscar el producto', 'X', 'error');
          }
          this.SpinnerService.hide();
        },
        (error) => {
          this.SpinnerService.hide();
          if (error.includes('403')){
            this.authService.logout();
          }
        }
      );
  }
}
