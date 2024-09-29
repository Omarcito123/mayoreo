import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-confirmacion',
  templateUrl: './dialog-confirmacion.component.html',
  styleUrl: './dialog-confirmacion.component.css'
})
export class DialogConfirmacionComponent {
  mensaje: string;
  btn = 'aceptar';

  constructor(public dialogRef: MatDialogRef<DialogConfirmacionComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
                this.mensaje = data.mensaje;
              }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
