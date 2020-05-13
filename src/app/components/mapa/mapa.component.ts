import { Component, OnInit } from '@angular/core';
import { Marcador } from '../../classes/marcador.class';
import {  MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MapaEditarComponent } from './mapa-editar.component';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  // propiedad de clase tipo Marcadores replicarnos como instancias
  marcadores: Marcador[] = [];
  // coordnedas fijas para iniciar la app con 1 marcador fijo
  lat = 51.678418;
  lng = 7.809007;

  constructor( public snackBar: MatSnackBar, // ventana de notificacion
               public dialog: MatDialog ) { // ventana emergente para editar marcadores

    // si existe la llave marcadores en local storage es que tengo marcadores guardados
    if ( localStorage.getItem('marcadores') ) {
      // cargar como objeto JSON los parcadores que estan guadadod como string
      this.marcadores = JSON.parse(localStorage.getItem('marcadores'));
    }

  }

  ngOnInit() {
  }


  agregarMarcador( evento ) {
    // las coordenas llegan como parametro que es el eveneto capturado en html
    const coords: { lat: number, lng: number } = evento.coords;
    // crea nueva instacia de la clase marcador con las coordenadas recibidas
    const nuevoMarcador = new Marcador( coords.lat, coords.lng );
    // meter el nuevo marcador en el array que contiene la coleccion
    this.marcadores.push( nuevoMarcador );
    // actualizar localstorage
    this.guardarStorage();
    // anunciar accion realizada con pop up snackbar de angular material
    this.snackBar.open('Marcador agregado', 'Cerrar', { duration: 3000 });

  }
  // borrar un marcador seleccionado en html
  borrarMarcador( i: number ) {
    // borrar con .splice() el elemento recibido en parametro
    this.marcadores.splice(i, 1);
    this.guardarStorage(); //  actualizar el storage
    // activar ventana de notificacion en parte inferior
    this.snackBar.open('Marcador borrado', 'Cerrar', { duration: 3000 });
  }

  // editar marcador
  editarMarcador( marcador: Marcador ) {

    const dialogRef = this.dialog.open( MapaEditarComponent , {
      width: '250px',
      data: { titulo: marcador.titulo, desc: marcador.desc }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

      if ( !result ) {
        return;
      }

      marcador.titulo = result.titulo;
      marcador.desc = result.desc;

      this.guardarStorage();
      this.snackBar.open('Marcador actualizado', 'Cerrar', { duration: 3000 });

    });

  }

  // guardar marcadores en localstorage
  guardarStorage() {
    // convertirlos en string ( texo ) usando JSON.stringify() para guardarlos con la llamve 'marcadores'
    localStorage.setItem('marcadores', JSON.stringify( this.marcadores ) );

  }

}
