import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductoService, Producto } from '../../services/producto.service';

@Component({
  selector: 'app-modal-agregar-producto',
  templateUrl: './modal-agregar-producto.component.html',
  styleUrls: ['./modal-agregar-producto.component.css']
})
export class ModalAgregarProductoComponent {
  producto: Producto;
  esEdicion: boolean;

  constructor(
    public dialogRef: MatDialogRef<ModalAgregarProductoComponent>,
    private productoService: ProductoService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.esEdicion = !!data?.producto;
    this.producto = data?.producto ? { ...data.producto } : { nombre: '', cantidad: 0, precio: 0 };
  }

  guardarProducto(): void {
    if (!this.producto.nombre || this.producto.cantidad <= 0 || this.producto.precio <= 0) return;

    // 🔹 Verificar si el producto ya existe
    this.productoService.existeProducto(this.producto.nombre).subscribe((existe) => {
      if (existe && (!this.esEdicion || this.producto.nombre !== this.data?.producto.nombre)) {
        this.mostrarMensaje('⚠️ El producto ya existe. Intenta con otro nombre.', 'Cerrar');
      } else {
        this.enviarProducto();
      }
    });
  }

  enviarProducto(): void {
    if (this.esEdicion) {
      this.productoService.editarProducto(this.producto).subscribe(() => {
        this.mostrarMensaje('✅ Producto editado correctamente', 'Cerrar');
        this.dialogRef.close(true);
      });
    } else {
      this.productoService.agregarProducto(this.producto).subscribe(() => {
        this.mostrarMensaje('✅ Producto agregado correctamente', 'Cerrar');
        this.dialogRef.close(true);
      });
    }
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }

  mostrarMensaje(mensaje: string, accion: string): void {
    this.snackBar.open(mensaje, accion, {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center'
    });
  }
}
