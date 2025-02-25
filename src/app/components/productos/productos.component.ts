import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductoService, Producto } from '../../services/producto.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalAgregarProductoComponent } from '../modal-agregar-producto/modal-agregar-producto.component';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  idBuscado: number | null = null;
  displayedColumns: string[] = ['id', 'nombre', 'cantidad', 'precio', 'acciones'];
  dataSource = new MatTableDataSource<Producto>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private productoService: ProductoService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.productoService.obtenerProductos().subscribe(productos => {
      this.dataSource.data = productos.slice(0, 10); // 📌 Solo los 10 primeros resultados
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // 📌 Conectar el paginador con la tabla
  }

  buscarProducto() {
    if (!this.idBuscado) {
      this.obtenerProductos();
      return;
    }

    this.productoService.buscarProducto(this.idBuscado).subscribe(
      (producto: Producto) => {
        this.productos = [producto];
      },
      () => {
        this.productos = [];
      }
    );
  }

  eliminarProducto(id: number) {
    this.productoService.eliminarProducto(id).subscribe(() => {
      this.productos = this.productos.filter(p => p.id !== id);
      this.obtenerProductos();
    });
  }

  abrirModalAgregar(): void {
    const dialogRef = this.dialog.open(ModalAgregarProductoComponent, {
      width: '400px',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.obtenerProductos();
      }
    });
  }

}
