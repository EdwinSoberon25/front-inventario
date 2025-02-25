import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductoService, Producto } from '../../services/producto.service';

@Component({
  selector: 'app-modal-agregar-producto',
  templateUrl: './modal-agregar-producto.component.html',
  styleUrls: ['./modal-agregar-producto.component.css']
})
export class ModalAgregarProductoComponent {
  producto: Producto = { nombre: '', cantidad: 0, precio: 0 };

  constructor(
    public dialogRef: MatDialogRef<ModalAgregarProductoComponent>,
    private productoService: ProductoService,
    private snackBar: MatSnackBar
  ) {}

  agregarProducto(): void {
    if (this.producto.nombre && this.producto.cantidad > 0 && this.producto.precio > 0) {
      this.productoService.agregarProducto(this.producto).subscribe(() => {
        this.mostrarMensaje('✅ Producto agregado correctamente', 'Cerrar');
        this.dialogRef.close(true); // 🔥 Cierra el modal y avisa al componente padre
      });
    }
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }

  mostrarMensaje(mensaje: string, accion: string): void {
    this.snackBar.open(mensaje, accion, {
      duration: 3000, // 🕒 Duración de 3 segundos
      verticalPosition: 'bottom', // 📍 Ubicación
      horizontalPosition: 'center'
    });
  }
}
