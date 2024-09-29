import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../service/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { producto } from '../../model/producto';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { productoCar } from '../../model/productoCar';
import { venta } from '../../model/venta';
import * as uuid from 'uuid';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css'
})
export class VentasComponent {

  productSell = new producto();
  totalCompra = 0;
  precioFinal = 0;
  gananciaTotal = 0;
  itemsInCar = 0;
  noInProgres = true;
  numberRecibo: string;
  filteredOptions: Observable<string[]>;
  productList: producto[];
  options: string[] = [];
  myControl = new FormControl();
  productAddCarList: Array<productoCar> = [];
  ventaList: Array<venta> = [];
  userSesion: any;
  ventaCar: venta;
  esperando = 'No';

  displayedColumns: string[] = [
    'unitaverage',
    'cantidad',
    'nombre',
    'precioregular',
    'precioTotal',
    'ganancia',
    'options',
  ];
  dataSource = new MatTableDataSource<productoCar>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private location: Location,
    private api: ApiService,
    private datePipe: DatePipe,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.getListProducts();
    this.userSesion = this.authService.currentUserValue;
  }

  getListProducts(): void {
    this.SpinnerService.show();
    this.api.getListProducts().subscribe(
      (response) => {
        if (response != null) {
          if (response.success) {
            this.productList = response.data;
            this.options = response.data.map((a) => a.productname);
            this.filteredOptions = this.myControl.valueChanges.pipe(
              startWith(''),
              map((value) => this._filter(value))
            );
          } else {
            this.api.openSnackBar(response.message, 'X', 'error');
          }
        } else {
          this.api.openSnackBar('Error al cargar la lista de productos', 'X', 'error');
        }
        this.SpinnerService.hide();
      },
      (error) => {
        this.SpinnerService.hide();
      }
    );
  }

  private _filter(value: string): string[] {
    if(value != undefined){
      const name = value.toLowerCase();
      return this.options.filter((option) => option.toLowerCase().includes(name));
    } else {
      return [];
    }
  }

  realizarVenta(): void {
    this.noInProgres = false;

    this.SpinnerService.show();
    this.ventaList = [];
    const billDate = uuid.v4();
    const iduseradd = this.userSesion.iduser;
    this.productAddCarList.forEach((ventaObj) => {
      if (ventaObj.productname !== 'totalAllProduct') {     
        this.ventaCar = new venta();
        this.ventaCar.bill = billDate;
        this.ventaCar.idproducto = ventaObj.idproduct;
        this.ventaCar.productname = ventaObj.productname;
        this.ventaCar.quantity = ventaObj.quantity;
        this.ventaCar.purchaseunitprice = ventaObj.purchaseprice;
        this.ventaCar.totalpurchaseprice = ventaObj.purchaseprice * ventaObj.quantity;
        this.ventaCar.totalunitsaleprice = ventaObj.saleprice;
        if(ventaObj.saleprice != ventaObj.totalprice){
          this.ventaCar.totalsaleprice = ventaObj.totalprice;
          this.ventaCar.ganancia = ventaObj.totalprice - (ventaObj.purchaseprice * ventaObj.quantity);
        } else {
          this.ventaCar.totalsaleprice = ventaObj.saleprice * ventaObj.quantity;
          this.ventaCar.ganancia = (ventaObj.saleprice * ventaObj.quantity) - (ventaObj.purchaseprice * ventaObj.quantity);
        }        
        this.ventaCar.unitaverage = ventaObj.unitaverage;
        this.ventaCar.iduseradd = iduseradd;
        this.ventaCar.idusermod = 0;
        this.ventaList.push(this.ventaCar);
      }
    });
    this.esperando = 'Si';
    this.api.createVenta(this.ventaList).subscribe(
      (response) => {
        this.esperando = 'No';
        if (response != null) {
          if (response) {
            location.reload();
            this.api.openSnackBar(
              'Venta realizada exitosamente',
              'X',
              'success'
            );
          } else {
            this.api.openSnackBar('Error al realizar la venta', 'X', 'error');
          }
          this.noInProgres = true;
        } else {
          this.noInProgres = true;
          this.api.openSnackBar('Error al realizar la venta', 'X', 'error');
        }
        this.noInProgres = true;
        this.SpinnerService.hide();
      },
      (error) => {
        this.noInProgres = true;
        this.esperando = 'No';
        this.SpinnerService.hide();
      }
    );
  }

  agregarProducto(): void {
    if (this.productSell.productname == null) {
      this.api.openSnackBar('Nombre del producto incorrecto', 'X', 'error');
    } else if (this.productSell.productname === undefined) {
      this.api.openSnackBar('Nombre del producto incorrecto', 'X', 'error');
    } else if (this.productSell.productname === '') {
      this.api.openSnackBar('Nombre del producto incorrecto', 'X', 'error');
    } else if (
      this.productSell.quantity == null ||
      this.productSell.quantity === undefined
    ) {
      this.api.openSnackBar('Ingresa los campos requeridos', 'X', 'error');
    } else if (this.productSell.quantity === 0) {
      this.api.openSnackBar(
        'Ingresa la cantidad de producto a vender',
        'X',
        'error'
      );
      return;
    } else if (this.productSell.quantity > this.productSell.existence) {
      this.api.openSnackBar(
        this.productSell.productname + ' no tiene suficientes existencias',
        'X',
        'error'
      );
      return;
    } else {
      const productAddCar = new productoCar(
        this.productSell.idproduct,
        this.productSell.dateadd,
        this.productSell.datemod,
        this.productSell.existence,
        this.productSell.quantity,
        this.productSell.iduseradd,
        this.productSell.idusermod,
        this.productSell.productname,
        this.productSell.purchaseprice,
        this.productSell.saleprice,
        this.productSell.unitaverage,
        this.productSell.totalprice
      );
      this.productAddCarList.push(productAddCar);
      const indexTotal = this.findTotalAllProduct('totalAllProduct');
      this.addItemTotalProducts(indexTotal);
      this.dataSource = new MatTableDataSource(this.productAddCarList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.api.openSnackBar('Producto agregado al carrito', 'X', 'success');
      this.clearProduct();
      this.itemsInCar = this.productAddCarList.length;
    }
  }

  addItemTotalProducts(index: any): void {
    if (index !== -1) {
      this.productAddCarList.splice(index, 1);
    }
    const sum = this.productAddCarList
      .filter((item) => item.productname !== 'totalAllProduct')
      .reduce((suma, current) => suma + current.totalprice, 0);
      const inversion = this.productAddCarList
      .filter((item) => item.productname !== 'totalAllProduct')
      .reduce((suma, current) => suma + (current.purchaseprice * current.quantity), 0);
    this.totalCompra = sum;
    this.gananciaTotal = sum - inversion;
  }

  findTotalAllProduct(name: any): number {
    return this.productAddCarList.findIndex((i) => i.productname === name);
  }

  deleteProductCar(item: any): void {
    const index = this.productAddCarList.findIndex(
      (i) => i.idproduct === item.idproduct
    );
    this.productAddCarList.splice(index, 1);
    const indexTotal = this.findTotalAllProduct('totalAllProduct');
    this.addItemTotalProducts(indexTotal);
    this.dataSource = new MatTableDataSource(this.productAddCarList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.api.openSnackBar('Producto eliminado del carrito', 'X', 'success');
  }

  clearProduct(): void {
    this.productSell = new producto();
  }

  calcularTotalProd(): void {
    this.productSell.totalprice =
        this.productSell.quantity * this.productSell.saleprice;
  }

  fillDataProduct(): void {
    if (this.productSell.productname === undefined || this.productSell.productname === ''){
      return;
    }

    this.SpinnerService.show();

    this.api.findProductByName(this.productSell).subscribe(
      (response) => {
        if (response != null) {
          if (response.success) {
            if (response.data != null) {
              this.productSell = response.data;
              this.productSell.quantity = 1;
              this.productSell.totalprice = this.productSell.saleprice * this.productSell.quantity;
              if (response.data.existence > 0) {
                response.data.cantidad = 1;
              }
            }
          } else {
            this.api.openSnackBar(response.message, 'X', 'error');
          }
        } else {
          this.api.openSnackBar("Error al buscar el producto", 'X', 'error');
        }
        this.SpinnerService.hide();
      },
      (error) => {
        this.SpinnerService.hide();
      }
    );
  }

  calcultatePrice(productSell: any): void {
    productSell.totalprice = productSell.saleprice * productSell.quantity;
  }
}
