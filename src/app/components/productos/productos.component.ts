import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductoService, Producto } from '../../services/producto.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ModalAgregarProductoComponent } from '../modal-agregar-producto/modal-agregar-producto.component';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  idBuscado: number | null = null;
  nombreBuscado: string = ''; // 🔹 Nuevo campo para la búsqueda por nombre
  displayedColumns: string[] = ['id', 'nombre', 'cantidad', 'precio', 'acciones'];
  dataSource = new MatTableDataSource<Producto>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private productoService: ProductoService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.productoService.obtenerProductos().subscribe(productos => {
      this.dataSource.data = productos;
      this.productos = productos; // 🔹 Guardar todos los productos para búsqueda local
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  buscarProducto() {
    if (!this.idBuscado && !this.nombreBuscado.trim()) {
      this.obtenerProductos(); // 🔄 Si no hay búsqueda, mostrar todos
      return;
    }
  
    if (this.idBuscado) {
      this.productoService.buscarProducto(this.idBuscado).subscribe(
        (producto: Producto | null) => {
          if (producto) {
            this.dataSource.data = [producto];
          } else {
            this.dataSource.data = [];
          }
        },
        () => this.dataSource.data = []
      );
    } else {
      // 🔹 Filtrar los productos almacenados en memoria por nombre
      this.dataSource.data = this.productos.filter(p => 
        p.nombre.toLowerCase().includes(this.nombreBuscado.toLowerCase())
      );
    }
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

  abrirModalEditar(producto: Producto) {
    const dialogRef = this.dialog.open(ModalAgregarProductoComponent, {
      width: '400px',
      data: { producto }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.obtenerProductos();
      }
    });
  }
}
