import { Component, OnInit, ViewChild } from '@angular/core';
import { GrupoService } from 'src/app/services/grupo.service';
import { Grupo, Sesion, Estudiante, Usuario, Canalizacion, SesionIndividual, ReporteSemestralGrupo } from 'src/app/models/models';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PersonalService } from 'src/app/services/personal.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { ReporteService } from 'src/app/services/reporte.service';
import { CanalizacionService } from 'src/app/services/canalizacion.service';
import { PageEvent } from '@angular/material';
import { formatDate } from '@angular/common';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.sass']
})
export class GrupoComponent implements OnInit {

  //Traer el ID del  url
  public id: number;
  private sub: any;
  pageEvent: PageEvent;
  canalizacionesPageSize = 10;
  canalizacionesPageSizeOptions: number[] = [10, 20, 30, 40, 50];
  //Variables publicas
  public loading: boolean = false;
  public miGrupo: Grupo = new Grupo();
  public sesionesIndividuales: Array<SesionIndividual> = new Array<SesionIndividual>();
  public sesionIndividualSeleccionada: number = 0;
  public asistenciaIndividual: Array<Estudiante> = new Array<Estudiante>();

  public sesiones: Array<Sesion> = new Array<Sesion>();
  public seleccionado: boolean = false;
  public asistencia: Array<Estudiante> = new Array<Estudiante>();
  public sesionSeleccionada: number = 0;
  public usuario: Usuario = new Usuario();
  public canalizaciones: Array<Canalizacion>;
  public formAlert: string = "";
  //Tabla de canalizaciones
  canalizacionesSource = new MatTableDataSource(this.canalizaciones);
  canalizacionesColumns: string[] = ['fecha', 'estudiante', 'atencion', 'estatus', 'editar', 'eliminar',];
  //Tabla
  dataSource = new MatTableDataSource(this.miGrupo.estudiantes);
  displayedColumns: string[] = ['nombre', 'numeroDeControl', 'semestre', 'creditos', 'sesiones', 'sesionesIniciales', 'estatus'];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  asistenciaSource = new MatTableDataSource(this.asistencia);
  asistenciaIndividualSource = new MatTableDataSource(this.asistencia);
  asistenciaColumns: string[] = ['presente', 'nombre', 'numeroDeControl'];
  asistenciaIndividualColumns: string[] = ['presente', 'nombre', 'numeroDeControl'];

  //Formularios
  sesionesForm: FormGroup;
  sesionesIndividualesForm: FormGroup;
  canalizacionForm: FormGroup;

  canalizacionSeleccionada: Canalizacion;
  establecerCanalizacion(id: number) {

    this.canalizaciones.forEach(f => {
      if (f.id == id) {
        this.canalizacionSeleccionada = f;
        this.canalizacionForm.controls.descripcion.setValue(f.descripcion);
        this.canalizacionForm.controls.estatus.setValue(f.estado);
        var date = new Date(new Date(f.fecha).getTime())
        this.canalizacionForm.controls.fecha.setValue(date);
      }
    });
    this.formAlert = "editarCanalizacion";
  }

  constructor(
    private datePipe: DatePipe,
    private estudianteService: EstudianteService,
    private canalizacionService: CanalizacionService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private grupoService: GrupoService,
    private personalService: PersonalService,
    private reporteService: ReporteService) {
    this.sesionesForm = new FormGroup({
      sesion: new FormControl('', [Validators.required]),
    });
    this.sesionesIndividualesForm = new FormGroup({
      sesion: new FormControl('', [Validators.required]),
    });
    this.canalizacionForm = new FormGroup({
      estatus: new FormControl('', [Validators.required]),
      descripcion: new FormControl(''),
      fecha: new FormControl('', [Validators.required]),
    });

  }
  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    this.usuario = this.authService.traerUsuario();


    if (this.usuario.personal.cargo == "T") {
      if (this.usuario.personal.id != parseInt(this.id.toString())) {
        this.router.navigate(['/panel']);
      } else {

        this.personalService.get(this.id.toString()).subscribe(
          r => {
            if (r.code == 202) {
              this.personalService.showGrupo(this.id.toString()).subscribe(
                r => {
                  this.miGrupo = r.data as Grupo;

                  this.dataSource = new MatTableDataSource(this.miGrupo.estudiantes);
                  this.grupoService.showSesiones(this.miGrupo.id.toString()).subscribe(r => {
                    if (r.code == 200) {
                      this.sesiones = r.data as Array<Sesion>;
                    } else {
                      console.log("error: ", r.data)
                    }
                  });
                  this.grupoService.showSesionesIndividuales(this.miGrupo.id.toString()).subscribe(r => {
                    if (r.code == 200) {
                      this.sesionesIndividuales = r.data as Array<SesionIndividual>;
                    } else {
                      console.log("error: ", r.data)
                    }
                  });
                  this.grupoService.showCanalizaciones(this.miGrupo.id.toString()).subscribe(r => {
                    console.log("Se ejecuta canalizacion");
                    if (r.code == 200) {
                      this.canalizaciones = r.data as Array<Canalizacion>;
                      this.canalizacionesSource = new MatTableDataSource(this.canalizaciones);
                    }
                  });
                });
            } else {
              this.router.navigate(['/404']);
            }

          });

      }


    } else {
      this.personalService.get(this.id.toString()).subscribe(
        r => {
          if (r.code == 202) {
            this.personalService.showGrupo(this.id.toString()).subscribe(
              r => {
                this.miGrupo = r.data as Grupo;

                this.dataSource = new MatTableDataSource(this.miGrupo.estudiantes);
                this.grupoService.showSesiones(this.miGrupo.id.toString()).subscribe(r => {
                  if (r.code == 200) {
                    this.sesiones = r.data as Array<Sesion>;
                  } else {
                    console.log("error: ", r.data)
                  }
                });
                this.grupoService.showSesionesIndividuales(this.miGrupo.id.toString()).subscribe(r => {
                  if (r.code == 200) {
                    this.sesionesIndividuales = r.data as Array<SesionIndividual>;
                  } else {
                    console.log("error: ", r.data)
                  }
                });
                this.grupoService.showCanalizaciones(this.miGrupo.id.toString()).subscribe(r => {
                  if (r.code == 200) {
                    this.canalizaciones = r.data as Array<Canalizacion>;
                    this.canalizacionesSource = new MatTableDataSource(this.canalizaciones);
                  }
                });

              });
          } else {
            this.router.navigate(['/404']);
          }

        });
    }






  }
  AsignarAsistencia(values: any, id: any) {
    if (values.checked) {
      console.log("-> se ha agregado asistencia a estudiante con el ID: " + id);
      this.asistencia.find(x => x.id == id).presente = true;
    } else {
      console.log("-> se ha quitado asistencia a estudiante con el ID: " + id);
      this.asistencia.find(x => x.id == id).presente = false;
    }
  }
  AsignarAsistenciaIndividual(values: any, id: any) {
    if (values.checked) {
      console.log("-> se ha agregado asistencia a estudiante con el ID: " + id);
      this.asistenciaIndividual.find(x => x.id == id).presente = true;
    } else {
      console.log("-> se ha quitado asistencia a estudiante con el ID: " + id);
      this.asistenciaIndividual.find(x => x.id == id).presente = false;
    }
  }
  cargarAsistencias(value) {
    this.sesionSeleccionada = value;
    this.grupoService.showAsistencias(this.miGrupo.id.toString(), value).subscribe(
      r => {
        if (r.code == 200) {
          this.asistencia = r.data as Array<Estudiante>;
          this.asistenciaSource = new MatTableDataSource(this.asistencia);
        }
      }
    );
  }
  cargarAsistenciasIndividuales(value) {
    this.sesionIndividualSeleccionada = value;
    this.grupoService.showAsistenciasIndividuales(this.miGrupo.id.toString(), value).subscribe(
      r => {
        if (r.code == 200) {
          this.asistenciaIndividual = r.data as Array<Estudiante>;
          this.asistenciaIndividualSource = new MatTableDataSource(this.asistenciaIndividual);
        }
      }
    );
  }



  generarReporte() {


    var doc = new jsPDF();

    var estudiantesLista = [];
    this.miGrupo.estudiantes.forEach(e => {
      var n = [e.numeroDeControl, e.usuario.nombreCompleto, e.semestre, '________________', e.sesiones];
      estudiantesLista.push(n);
    });


    doc.autoTable({
      head: [['Numero de control', 'Nombre', 'Semestre', 'Firma', 'Sesiones']],
      body: estudiantesLista,
      theme: 'grid'
    })
    doc.save('a4.pdf');
  }
  generarLista() {
    var doc = new jsPDF()
    var s = this.sesiones.find(x => x.id == this.sesionSeleccionada);
    var estudiantesLista = [];
    this.miGrupo.estudiantes.forEach(e => {
      var estado: string = "";
      if (e.estado == "A") {
        estado = "Activo";
      } else if (e.estado == "T") {
        estado = "Liberado"
      }
      var n = [e.numeroDeControl, e.usuario.nombreCompleto.toUpperCase(), e.semestre, e.sesiones, e.estado];
      estudiantesLista.push(n);
    });
    var pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(18);
    doc.text('INSTITUTO TECNOLÓGICO DE NUEVO LAREDO', doc.internal.pageSize.width / 2, 20, null, null, 'center');
    doc.setFontSize(16);
    doc.text(('DEPARTAMENTO DE ' + this.miGrupo.personal.departamento.titulo.toUpperCase()), doc.internal.pageSize.width / 2, 30, null, null, 'center');
    doc.setFontSize(12);
    doc.text(('GRUPO DE TUTORÍAS: ' + this.miGrupo.personal.usuario.nombreCompleto.toUpperCase()), doc.internal.pageSize.width / 2, 40, null, null, 'center');
    doc.setFontSize(10);
    doc.text(20, 50, "Fecha: " + this.datePipe.transform(s.fecha, "d/M/yyyy") + "  Hora: " + this.datePipe.transform(s.fecha, "h:mm a") + "  Aula: " + this.miGrupo.salon);
    doc.autoTable({
      head: [['Núm. Control', 'Nombre', 'Sem.', 'Asis.', 'Est.', 'Firma']],
      body: estudiantesLista,
      theme: 'grid',
      styles: { fillColor: [0, 79, 122] },
      stylesDef: { fontSize: 8 },
      columnStyles: {
        0: { fillColor: [255, 255, 255], columnWidth: 27 },
        1: { fillColor: [255, 255, 255], columnWidth: 80 },
        2: { fillColor: [255, 255, 255], columnWidth: 12 },
        3: { fillColor: [255, 255, 255], columnWidth: 12 },
        4: { fillColor: [255, 255, 255], columnWidth: 12 },
        5: { fillColor: [255, 255, 255] },
      },
      startY: 55,
    })
    let finalY = doc.lastAutoTable.finalY;
    var dimen = doc.getTextDimensions(s.accionTutorial.contenido);

    if (finalY >= (doc.internal.pageSize.height / 2)) {
      doc.addPage();
      doc.text(20, 35, "ACTIVIDADES DE LA SESIÓN: ");
      var split = doc.splitTextToSize(s.accionTutorial.contenido, 180)
      doc.text(20, 45, split);
      var heightActividad = (doc.getTextDimensions(split).h) + 10;
      console.log('holaxd', heightActividad);
      doc.text("Si algún estudiante no aparece en la lista, repórtelo para revisar su situación", doc.internal.pageSize.width / 2, heightActividad + 35, null, null, 'center');
      doc.text("________________________________________________", doc.internal.pageSize.width / 2, heightActividad + 40, null, null, 'center');
      doc.text(this.miGrupo.personal.usuario.nombreCompleto.toUpperCase(), doc.internal.pageSize.width / 2, heightActividad + 45, null, null, 'center');
    }
    else {
      doc.text(20, finalY + 15, "ACTIVIDADES DE LA SESIÓN: ");
      var split = doc.splitTextToSize(s.accionTutorial.contenido, 180)
      doc.text(20, finalY + 20, split);
      var heightActividad = finalY + (doc.getTextDimensions(split).h);

      doc.text("Si algún estudiante no aparece en la lista, repórtelo para revisar su situación", doc.internal.pageSize.width / 2, heightActividad + 25, null, null, 'center');
      doc.text("________________________________________________", doc.internal.pageSize.width / 2, heightActividad + 40, null, null, 'center');
      doc.text(this.miGrupo.personal.usuario.nombreCompleto.toUpperCase(), doc.internal.pageSize.width / 2, heightActividad + 45, null, null, 'center');
    }
    var split = doc.splitTextToSize(s.accionTutorial.contenido, 180)

    doc.save('Lista.pdf');

  }
  generarListaIndividual() {
    var doc = new jsPDF()
    var s = this.sesionesIndividuales.find(x => x.id == this.sesionIndividualSeleccionada);
    var estudiantesLista = [];
    this.miGrupo.estudiantes.forEach(e => {
      var estado: string = "";
      if (e.estado == "A") {
        estado = "Activo";
      } else if (e.estado == "T") {
        estado = "Liberado"
      }
      var n = [e.numeroDeControl, e.usuario.nombreCompleto.toUpperCase(), e.semestre, e.sesiones, e.estado];
      estudiantesLista.push(n);
    });
    var pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(18);
    doc.text('INSTITUTO TECNOLÓGICO DE NUEVO LAREDO', doc.internal.pageSize.width / 2, 20, null, null, 'center');
    doc.setFontSize(16);
    doc.text(('DEPARTAMENTO DE ' + this.miGrupo.personal.departamento.titulo.toUpperCase()), doc.internal.pageSize.width / 2, 30, null, null, 'center');
    doc.setFontSize(12);
    doc.text(('GRUPO DE TUTORÍAS: ' + this.miGrupo.personal.usuario.nombreCompleto.toUpperCase()), doc.internal.pageSize.width / 2, 40, null, null, 'center');
    doc.setFontSize(10);
    doc.text(20, 50, "Fecha: " + this.datePipe.transform(s.fecha, "M/d/yyyy") + "  Hora: " + this.datePipe.transform(s.fecha, "h:mm a") + "  Aula: " + this.miGrupo.salon);
    doc.autoTable({
      head: [['Núm. Control', 'Nombre', 'Sem.', 'Asis.', 'Est.', 'Firma']],
      body: estudiantesLista,
      theme: 'grid',
      styles: { fillColor: [0, 79, 122] },
      stylesDef: { fontSize: 8 },
      columnStyles: {
        0: { fillColor: [255, 255, 255], columnWidth: 27 },
        1: { fillColor: [255, 255, 255], columnWidth: 80 },
        2: { fillColor: [255, 255, 255], columnWidth: 12 },
        3: { fillColor: [255, 255, 255], columnWidth: 12 },
        4: { fillColor: [255, 255, 255], columnWidth: 12 },
        5: { fillColor: [255, 255, 255] },
      },
      startY: 55,
    })
    let finalY = doc.lastAutoTable.finalY;
    var dimen = doc.getTextDimensions(s.accionTutorial.contenido);

    if (finalY >= (doc.internal.pageSize.height / 2)) {
      doc.addPage();
      doc.text(20, 35, "ACTIVIDADES DE LA SESIÓN: ");
      var split = doc.splitTextToSize(s.accionTutorial.contenido, 180)
      doc.text(20, 45, split);
      var heightActividad = (doc.getTextDimensions(split).h) + 10;
      console.log('holaxd', heightActividad);
      doc.text("Si algún estudiante no aparece en la lista, repórtelo para revisar su situación", doc.internal.pageSize.width / 2, heightActividad + 35, null, null, 'center');
      doc.text("________________________________________________", doc.internal.pageSize.width / 2, heightActividad + 40, null, null, 'center');
      doc.text(this.miGrupo.personal.usuario.nombreCompleto.toUpperCase(), doc.internal.pageSize.width / 2, heightActividad + 45, null, null, 'center');
    }
    else {
      doc.text(20, finalY + 15, "ACTIVIDADES DE LA SESIÓN: ");
      var split = doc.splitTextToSize(s.accionTutorial.contenido, 180)
      doc.text(20, finalY + 20, split);
      var heightActividad = finalY + (doc.getTextDimensions(split).h);

      doc.text("Si algún estudiante no aparece en la lista, repórtelo para revisar su situación", doc.internal.pageSize.width / 2, heightActividad + 25, null, null, 'center');
      doc.text("________________________________________________", doc.internal.pageSize.width / 2, heightActividad + 40, null, null, 'center');
      doc.text(this.miGrupo.personal.usuario.nombreCompleto.toUpperCase(), doc.internal.pageSize.width / 2, heightActividad + 45, null, null, 'center');
    }
    var split = doc.splitTextToSize(s.accionTutorial.contenido, 180)

    doc.save('Lista.pdf');

  }

  generarReporteSemestral() {
    var temporal: ReporteSemestralGrupo;


    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1;
    var year = dateObj.getUTCFullYear();
    var periodo: number = 2;
    var periodoStr: string = "";

    if (month >= 1 && month <= 7) {
      periodo = 1;
      periodoStr = "ENE-JUN ";
    } else {
      periodoStr = "AGO-DIC "
    }
    periodoStr += year;
    this.reporteService.getReporteSemestralGrupal(this.miGrupo.id.toString(), periodo, year).subscribe(
      r => {
        if (r.code == 200) {

          temporal = r.data as ReporteSemestralGrupo;

          var doc = new jsPDF('landscape');
          var totalPagesExp = '{total_pages_count_string}';
          
          var ruleRight: number = (doc.internal.pageSize.width - 14);
          var ruleLeft: number = 14;
          var middle: number = doc.internal.pageSize.width / 2;

          var estudiantesLista = [];
          temporal.estudiantes.forEach(e => {
            var estado: string = "";
            if (e.estado == "A") {
              estado = "Activo";
            } else if (e.estado == "T") {
              estado = "Liberado"
            }
            else if (e.estado == "E") {
              estado = "Egresado"
            }
            else if (e.estado == "B") {
              estado = "Baja"
            }
            else if (e.estado == "V") {
              estado = "Baja temporal"
            }

            var areasStr = "";
            var x: number = 0;
            e.canalizacionesLista.forEach(c => {
              if (x == 0) {
                areasStr += c.area + " ";
              } else {
                areasStr += ", " + c.area;
              }
              x++;
            });

            var n = [
              e.numeroDeControl,
              e.usuario.nombreCompleto.toUpperCase(),
              e.semestre,
              e.sesiones,
              e.sesionesIndividuales,
              e.sesionesIniciales,
              e.canalizaciones,
              areasStr.toUpperCase()
            ];
            
              estudiantesLista.push(n);
         
          });



          doc.autoTable({
            head: [['Núm. Control', 'Nombre', 'Sem.', 'Ses.', 'Ses. Indiv.', 'Ses. Inicial', 'Can.', 'Áreas de canalización']],
            theme: 'grid',
            body: estudiantesLista,
            styles: {
              halign: 'left',
              fillColor: [0, 79, 122],
            },
            stylesDef: { fontSize: 7 },
            columnStyles: {
              0: { fillColor: [255, 255, 255],  fontSize: 8 },
              1: { fillColor: [255, 255, 255], fontSize: 8  },
              2: { fillColor: [255, 255, 255], fontSize: 8  },
              3: { fillColor: [255, 255, 255],fontSize: 8  },
              4: { fillColor: [255, 255, 255],fontSize: 8  },
              5: { fillColor: [255, 255, 255] ,fontSize: 8 },
              6: { fillColor: [255, 255, 255] ,fontSize: 8 },
              7: { fillColor: [255, 255, 255], cellWidth: 90, fontSize: 8  },
            },
            didDrawPage: function (data) {
              //header



              


              doc.setFontSize(14);
              doc.text("INSTITUTO TECNOLÓGICO DE NUEVO LAREDO",middle, 18, null, null, 'center');
              doc.text("REPORTE DEL SEMESTRAL DEL TUTOR", middle, 26, null, null, 'center');
              doc.line(ruleLeft, 28, ruleRight, 28);
              doc.setFontSize(9);
              doc.text("DEPARTAMENTO DE " + temporal.nombreDepartamento.toUpperCase(), ruleLeft, 38);
              doc.text("PERIODO: " + periodoStr, ruleRight, 38, null, null, 'right');
              doc.text("NOMBRE DEL TUTOR: " + temporal.tutorNombre.toUpperCase(), ruleLeft, 48);
              doc.text("FECHA: " + (formatDate(new Date(), 'dd/MM/yyyy', 'en')), ruleRight, 48,  null, null, 'right');
              doc.text("PROGRAMA ACADÉMICO: " + temporal.nombreDepartamento.toUpperCase(), ruleLeft, 58);
             
              //footer
              var str = 'Página ' + doc.internal.getNumberOfPages() + ' de ' + totalPagesExp //esto dibuja la página actual + el total de páginas
              var pageSize = doc.internal.pageSize
              var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
              doc.setFontSize(10)
              doc.text(str, data.settings.margin.left, pageHeight - 10)
            },
            margin: { top: 66 },
            rowPageBreak: 'avoid',
          })
          doc.setFontSize(12)
          let finalY = doc.lastAutoTable.finalY;
          if (finalY >= (doc.internal.pageSize.height - 40)) {
            doc.addPage()
            doc.putTotalPages(totalPagesExp)
            doc.text("__________________________________", (middle / 2), 30, null, null, 'center')
            doc.text("Firma del Tutor", (middle / 2), 35, null, null, 'center')
            doc.text("__________________________________", ((middle / 2) * 3), 30, null, null, 'center')
            doc.text("Firma del Jefe de Tutorías", ((middle / 2) * 3), 35, null, null, 'center')
           
            doc.text("__________________________________", middle, 50, null, null, 'center')
            doc.text("Firma del Jefe del departamento académico", middle, 55, null, null, 'center')
            
            doc.setFontSize(7)
            doc.text("Total de tutorados: " + temporal.estudiantes.length, ruleLeft,  doc.internal.pageSize.height - 45, null, null, 'left');
            doc.text("1er y 2do semestre (M) " + temporal.estudiantesM1, ruleLeft,  doc.internal.pageSize.height - 40, null, null, 'left');
            doc.text("1er y 2do semestre (H) " + temporal.estudiantesH1, ruleLeft,  doc.internal.pageSize.height - 35, null, null, 'left');
            doc.text("3ro en adelante (M) " + temporal.estudiantesM, ruleLeft,  doc.internal.pageSize.height - 30, null, null, 'left');
            doc.text("3ro en adelante (H) " + temporal.estudiantesH, ruleLeft,  doc.internal.pageSize.height - 25, null, null, 'left');
            doc.setFontSize(12)

            var str = 'Página ' + doc.internal.getNumberOfPages()
            doc.text(str, 30, doc.internal.pageSize.height - 10)
          }
          else {
            doc.text("__________________________________", (middle / 2), finalY + 15, null, null, 'center')
            doc.text("Firma del Tutor", (middle / 2), finalY + 22, null, null, 'center')
            doc.text("__________________________________", ((middle / 2) * 3), finalY + 15, null, null, 'center')
            doc.text("Firma del Jefe de Tutorías", ((middle / 2) * 3), finalY + 22, null, null, 'center')
            doc.text("__________________________________", middle, finalY + 40, null, null, 'center')
            doc.text("Firma del Jefe del departamento", middle , finalY + 47, null, null, 'center')
            doc.setFontSize(7)
            doc.text("Total de tutorados: " + temporal.estudiantes.length, ruleLeft,  doc.internal.pageSize.height - 45, null, null, 'left');
            doc.text("1er y 2do semestre (M): " + temporal.estudiantesM1, ruleLeft,  doc.internal.pageSize.height - 40, null, null, 'left');
            doc.text("1er y 2do semestre (H): " + temporal.estudiantesH1, ruleLeft,  doc.internal.pageSize.height - 35, null, null, 'left');
            doc.text("3ro en adelante (M): " + temporal.estudiantesM, ruleLeft,  doc.internal.pageSize.height - 30, null, null, 'left');
            doc.text("3ro en adelante (H): " + temporal.estudiantesH, ruleLeft,  doc.internal.pageSize.height - 25, null, null, 'left');
            doc.setFontSize(12)
            doc.putTotalPages(totalPagesExp)
          }
          doc.save('ReporteSemestralTutor.pdf')


        }
      }
    );

    

  }

  Canalizar() {
    Swal.fire({
      title: 'Canalizar',
      html:
        '<input id="swal-input1" class="swal2-input">' +
        '<input id="swal-input2" class="swal2-input">',
    });
  }
  Guardar() {
    var nuevaAsistencia: Array<Estudiante> = new Array<Estudiante>();
    this.asistencia.forEach(e => {
      if (e.presente) {
        nuevaAsistencia.push(e)
      }
    });
    if (this.sesionSeleccionada != 0) {
      this.grupoService.AgregarAsistencias(this.miGrupo.id.toString(), this.sesionSeleccionada.toString(), nuevaAsistencia)
        .subscribe(s => {
          if (s.code == 200) {
            Swal.fire(
              'Se ha pasado lista correctamente',
              'la lista de esta sesion ha sido actualizada',
              'success'
            );
          } else {

          }
        });
    }

  }
  GuardarIndividual() {
    var nuevaAsistencia: Array<Estudiante> = new Array<Estudiante>();
    this.asistenciaIndividual.forEach(e => {
      if (e.presente) {
        nuevaAsistencia.push(e)
      }
    });
    if (this.sesionIndividualSeleccionada != 0) {
      this.grupoService.AgregarAsistenciasIndividuales(this.miGrupo.id.toString(), this.sesionIndividualSeleccionada.toString(), nuevaAsistencia)
        .subscribe(s => {
          if (s.code == 200) {
            Swal.fire(
              'Se ha pasado lista correctamente',
              'la lista de esta sesion ha sido actualizada',
              'success'
            );
          } else {

          }
        });
    }

  }
  editarCanalizacion() {
    if (this.canalizacionForm.valid) {
      this.canalizacionSeleccionada.descripcion = this.canalizacionForm.controls.descripcion.value;
      this.canalizacionSeleccionada.estado = this.canalizacionForm.controls.estatus.value;
      this.canalizacionSeleccionada.fecha = this.canalizacionForm.controls.fecha.value;

      this.canalizacionService.editar(this.canalizacionSeleccionada).subscribe(r => {
        if (r.code == 200) {
          Swal.fire("Exito", "Se ha editado la canalizacion con exito", "success");
          this.formAlert = 'none';
          this.grupoService.showCanalizaciones(this.miGrupo.id.toString()).subscribe(r => {
            // console.log("Se ejecuta canalizacion");
            if (r.code == 200) {
              this.canalizaciones = r.data as Array<Canalizacion>;
              this.canalizacionesSource = new MatTableDataSource(this.canalizaciones);
            } else {
              Swal.fire("Error", "No se han completado todos los datos", "error");
            }
          });
        } else {
          Swal.fire("Error", "No se han completado todos los datos o se ha puesto una fecha que aún no existe", "error");
        }
      });
    } else {
      Swal.fire("Error", "No se han completado todos los datos", "error");
    }
  }
  eliminarCanalizacion(id: number) {
    this.canalizaciones = new Array<Canalizacion>();
    this.canalizacionesSource = new MatTableDataSource(this.canalizaciones);
    console.log(id);
    this.canalizacionService.eliminar(id).subscribe(r => {
      if (r.code == 200) {
        Swal.fire("Exito", "Se ha eliminado la canalizacion con exito", "success");
        this.grupoService.showCanalizaciones(this.miGrupo.id.toString()).subscribe(r => {
          if (r.code == 200) {
            this.canalizaciones = r.data as Array<Canalizacion>;
            this.canalizacionesSource = new MatTableDataSource(this.canalizaciones);
          }
        });
      }
    }
    );
  }
  mostrarCanalizaciones(x) { }




  public async asignarSesiones(numeroDeControl: string) {
    const { value: sesiones } = await Swal.fire({
      title: "Introduce la cantidad inicial de sesiones",
      input: "text",
      inputValue: "",
      showCancelButton: true,
      inputValidator: value => {
        if (!value) {
          return "el campo esta vacio!";
        }
      }
    });
    if (sesiones) {
      this.estudianteService
        .asignarSesiones(numeroDeControl, sesiones)
        .subscribe(r => {
          if (r.code == 200) {
            Swal.fire(
              "Se ha logrado cambiar las sesiones iniciales",
              "Exito",
              "success"
            );
            this.miGrupo.estudiantes.find(f => f.numeroDeControl == numeroDeControl).sesionesIniciales = sesiones;
          } else {
            Swal.fire("Ha ocurrido un error", r.mensaje, "error");
          }
        });
    }
  }
  public async asignarEstatus(numeroDeControl: string) {
    console.log("alo");
    var opciones: Map<string, string> = new Map();
    opciones.set("A", "Activo");
    opciones.set("E", "Egresado");
    opciones.set("T", "Terminado");
    opciones.set("B", "Baja");
    opciones.set("V", "Baja temporal");

    const { value: estado } = await Swal.fire({
      title: 'Selecciona el nuevo estado',
      input: 'select',
      inputOptions: opciones,
      inputPlaceholder: 'Estados',
      showCancelButton: true
    });

    if (estado != null && estado != undefined) {
      this.estudianteService.asignarEstado(numeroDeControl, estado).subscribe(r => {
        if (r.code == 200) {
          Swal.fire(
            "Se ha logrado cambiar el estado del alumno",
            "Exito",
            "success"
          );
          this.miGrupo.estudiantes.find(f => f.numeroDeControl == numeroDeControl).estado = estado;
        } else {
          Swal.fire("Ha ocurrido un error", r.mensaje, "error");
        }
      });
    }
  }




}


/*
          temporal = r.data as ReporteSemestralGrupo;

          var doc = new jsPDF();












          var doc = new jsPDF('landscape');
          doc.setFontSize(12);
          doc.text("INSTITUTO TECNOLÓGICO DE NUEVO LAREDO", doc.internal.pageSize.width / 2, 20, null, null, 'center');
          doc.text("REPORTE DEL SEMESTRAL DEL TUTOR", doc.internal.pageSize.width / 2, 28, null, null, 'center');
          doc.text(("DEPARTAMENTO DE " + temporal.personal.departamento.titulo.toUpperCase()), 70, 36, null, null, 'center');
          doc.text("PERIODO: " + periodoStr, 228, 36);
          doc.text(("NOMBRE DEL TUTOR: " + temporal.personal.usuario.nombreCompleto.toUpperCase()), 20, 46);
          doc.text(("FECHA: " + (formatDate(new Date(), 'yyyy/MM/dd', 'en'))), 240, 46);
          doc.text(("PROGRAMA ACADÉMICO: " + temporal.personal.departamento.titulo.toUpperCase()), 20, 54);
          doc.text(("NÚMERO DE TUTORADOS:" + temporal.estudiantes.length), 218, 54);
          doc.autoTable({
            head: [['Núm. Control', 'Nombre', 'Sem.', 'Ses.', 'Ses. Indiv.', 'Ses. Inicial', 'Can.', 'Áreas de canalización']],
            body: estudiantesLista,
            theme: 'grid',
            styles: { fillColor: [0, 79, 122] },
            stylesDef: { fontSize: 8 },
            columnStyles: {
              0: { fillColor: [255, 255, 255] },
              1: { fillColor: [255, 255, 255] },
              2: { fillColor: [255, 255, 255] },
              3: { fillColor: [255, 255, 255] },
              4: { fillColor: [255, 255, 255] },
              5: { fillColor: [255, 255, 255] },
              6: { fillColor: [255, 255, 255] },
              7: { fillColor: [255, 255, 255] },
            },
            startY: 57,
          })
          let finalY = doc.lastAutoTable.finalY;
          if (finalY >= (doc.internal.pageSize.height / 2)) {
            doc.addPage();
            doc.text("Observaciones:   1er y 2do semestre: " + (temporal.estudiantesM1 + temporal.estudiantesH1) + " Mujeres: " + temporal.estudiantesM1 + " Hombres: " + temporal.estudiantesM1 + "     3er semestre en adelante: " + (temporal.estudiantesM + temporal.estudiantesH) + " Mujeres: " + temporal.estudiantesM + " Hombres: " + temporal.estudiantesH, 35, 30);
            doc.text("____________________________________", doc.internal.pageSize.width / 3, 40);
            doc.text("NOMBRE Y FIRMA DEL TUTOR", doc.internal.pageSize.width / 3 + 15, 45);
            doc.text("____________________________________", 30, 50);
            doc.text("FIRMA DEL JEFE DE TUTORÍAS DEL DEPARTAMENTO", 20, 55);
            doc.text("DE: " + temporal.personal.departamento.titulo.toUpperCase(), 40, 60);
            doc.text("____________________________________", 180, 50);
            doc.text("FIRMA DEL JEFE DE TUTORÍAS DEL DEPARTAMENTO", 170, 55);
            doc.text("DE: " + temporal.personal.departamento.titulo.toUpperCase(), 190, 60);

          }
          else {
            doc.text("Observaciones:   1er y 2do semestre: " + (temporal.estudiantesM1 + temporal.estudiantesH1) + " Mujeres: " + temporal.estudiantesM1 + " Hombres: " + temporal.estudiantesM1 + "     3er semestre en adelante: " + (temporal.estudiantesM + temporal.estudiantesH) + " Mujeres: " + temporal.estudiantesM + " Hombres: " + temporal.estudiantesH, 35, finalY + 10);
            doc.text("____________________________________", doc.internal.pageSize.width / 3 + 5, finalY + 25);
            doc.text("NOMBRE Y FIRMA DEL TUTOR", doc.internal.pageSize.width / 3 + 15, finalY + 30);
            doc.text("____________________________________", 30, finalY + 50);
            doc.text("FIRMA DEL JEFE DE TUTORÍAS DEL DEPARTAMENTO", 17, finalY + 55);
            doc.text("DE: " + temporal.personal.departamento.titulo.toUpperCase(), 30, finalY + 60);
            doc.text("______________________________________", 190, finalY + 50);
            doc.text("FIRMA DEL JEFE DEL DEPARTAMENTO", 195, finalY + 55);
            doc.text("DE: " + temporal.personal.departamento.titulo.toUpperCase(), 200, finalY + 60);
          }
          doc.save('ReporteSemestralTutor.pdf')


*/