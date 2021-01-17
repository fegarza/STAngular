import { Component, OnInit, ViewChild } from '@angular/core';
import { Departamento, Usuario, ReporteSemestralCoordinacion, Canalizacion } from '../../../../models/models';
import { PageEvent, MatSort, MatTableDataSource } from '@angular/material';
import { DepartamentoService } from '../../../../services/departamento.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { ReporteService } from 'src/app/services/reporte.service';
import * as jsPDF from 'jspdf';


@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.sass']
})
export class DepartamentosComponent implements OnInit {
  
  public loading: boolean = false;

  departamentos: Array<Departamento> = new Array<Departamento>();
  dataSource = new MatTableDataSource(this.departamentos);
  displayedColumns: string[] = ['titulo', 'tutores', 'tutorados'];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  // MatPaginator Inputs
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 20, 30, 40, 50];

  // MatPaginator Output
  pageEvent: PageEvent;

  miUsuario: Usuario;
  constructor(private departamentoService: DepartamentoService, private authService: AuthService, private reporteService: ReporteService) {
    this.departamentoService.showAll().subscribe(r => {
      if (r.code == 200) {
        this.departamentos = r.data as Array<Departamento>;
        this.dataSource = new MatTableDataSource(this.departamentos);
        this.dataSource.sort = this.sort;
      }
    });
    this.miUsuario = this.authService.traerUsuario();

  }

  ngOnInit() {
  }

  mostrarDepartamentos(event?: PageEvent) {
    /*this.personalService.getPage(event.pageSize, (event.pageIndex+1)).subscribe(r=>{
      if(r.code == 200){
        this.personales = r.data as Array<Personal>;
        this.dataSource = new MatTableDataSource(this.personales);
      }
    });
    return event;*/
  }
  generarReporteSemestral() {
    this.loading =true;
    var temporal: ReporteSemestralCoordinacion;


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






    this.reporteService.getReporteSemestralInstitucional(periodo, year).subscribe(s => {
      //reporte departamentos general
      

     
      temporal = s.data as ReporteSemestralCoordinacion;
      var doc = new jsPDF('landscape')
      var totalPagesExp = '{total_pages_count_string}'
      var areasStr = "";

      var departamentosLista = [];
       temporal.departamentos.forEach(e => {
        
        var totalIndividual: number = 0;
        var totalGrupal: number = 0;
        var estudiantesTotal: number = 0;
        var estudiantesH1 : number = 0;
        var estudiantesM1 : number = 0;
        var estudiantesH : number = 0;
        var estudiantesM : number = 0;

        var seen: Array<Canalizacion> = new Array<Canalizacion>();

        e.canalizacionesLista.forEach(u =>{
          u.canalizaciones.forEach(c =>{
            var encontrado = false;
          seen.forEach(g =>{
             if(g.area == c.area){
               encontrado = true;
               g.area += c.count;
             }
           })
           if(!encontrado){
            seen.push(c);
           }
          })
        })





        var  x: number=0;
        console.log(seen);
        seen.forEach(t=>{
          if (x == 0) {
            areasStr += t.area + "(" + t.count+") ";
          } else {
            areasStr += ", " + t.area + "(" + t.count+") ";
          }
          x++;
        })





        e.personales.forEach(p => {
          totalIndividual += p.estudiantesAtendidosIndividual;
          totalGrupal += p.estudiantesAtendidos;
          estudiantesTotal += p.estudiantes;
          estudiantesH1 += p.estudiantesH1;
          estudiantesM1 += p.estudiantesM1;
          estudiantesH += p.estudiantesH;
          estudiantesH += p.estudiantesH;
        });
        



        /*var areasStr: string = "";
        var  x: number=0;
        
        
        
       

        e.CAreas.forEach(c =>{
          if (x == 0) {
            areasStr += c.area + "(" + c.count+") ";
          } else {
            areasStr += ", " + c.area + "(" + c.count+") ";
          }
          x++;

        });
        */
        if(e.jefeDepartamentoStr == null || e.jefeDepartamentoStr == undefined){
          e.jefeDepartamentoStr = "";
        }

        var n = [
          e.titulo.toUpperCase(),
          e.jefeDepartamentoStr.toUpperCase(),
          totalIndividual,
          totalGrupal,
          estudiantesTotal,
          estudiantesM1,
          estudiantesH1,
          estudiantesM,
          estudiantesH,
          areasStr.toUpperCase()
        ];
        departamentosLista.push(n);



       })
      
      
      doc.autoTable({
        head: [['Departamento', 'Nombre del Responsable', 'Tutoría Ind.', 'Tutoría Grup.', 'Total', '1ro y 2do semestre M', '1ro y 2do semestre H', '+3er semestre M', '+3er semestre H', 'Áreas de canalización']],
        body: departamentosLista,
        theme: 'grid',
        styles: {
          halign: 'center',
          fillColor: [0, 79, 122]
        },
        stylesDef: { fontSize: 8 },
        columnStyles: {
          0: { fillColor: [255, 255, 255], cellWidth: 30 }, //columna de departamento
          1: { fillColor: [255, 255, 255], cellWidth: 40 }, //columna de nombre del responsable
          2: { fillColor: [255, 255, 255], cellWidth: 15 }, //columna de tutoria ind
          3: { fillColor: [255, 255, 255], cellWidth: 15 }, //columna de tutoria grupal
          4: { fillColor: [255, 255, 255], cellWidth: 15 }, //columna de total tutorias
          5: { fillColor: [255, 255, 255], cellWidth: 20 }, //columna de 1 y 2 semestre mujeres
          6: { fillColor: [255, 255, 255], cellWidth: 20 }, //columna de " " hombres
          7: { fillColor: [255, 255, 255], cellWidth: 20 }, //columna de +3ro semestre mujeres
          8: { fillColor: [255, 255, 255], cellWidth: 20 }, //columna de " " hombres
          9: { fillColor: [255, 255, 255] }, //columna de areas de canalizacion
        },
        didDrawPage: function (data) {
          //header
          doc.text("INSTITUTO TECNOLÓGICO DE NUEVO LAREDO", doc.internal.pageSize.width / 2, 20, null, null, 'center');
          doc.text("REPORTE DEPARTAMENTAL DEL SEMESTRE", doc.internal.pageSize.width / 2, 28, null, null, 'center');
          doc.text("PERIODO: " + periodoStr, doc.internal.pageSize.width / 2, 35, null, null, 'center');
          //footer
          var str = 'Página ' + doc.internal.getNumberOfPages() + ' de ' + totalPagesExp //esto dibuja la página actual + el total de páginas
          var pageSize = doc.internal.pageSize
          var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
          doc.setFontSize(10)
          doc.text(str, data.settings.margin.left, pageHeight - 10)
        },
        margin: { top: 40 },
        rowPageBreak: 'avoid',
      })
      //esto saca el total de las hojas del pdf
      doc.putTotalPages(totalPagesExp)
      doc.setFontSize(12)
      let finalY = doc.lastAutoTable.finalY;
      if (finalY >= (doc.internal.pageSize.height - 40)) {
        doc.addPage()
        doc.putTotalPages(totalPagesExp)
        doc.text("__________________________________", 34, 30)
        doc.text("Firma del Coordinador Institucional de Tutorías", 50, 35)
        doc.text(temporal.coordinador.titulo.titulo.toUpperCase()+" "+temporal.coordinador.usuario.nombreCompleto.toUpperCase(), 38, 40)
        doc.text("__________________________________", 179, 30)
        doc.text("Firma del Subdirector Académico", 188, 35)
        doc.text(temporal.nombreSubdirector.toUpperCase(), 180, 40)
        var str = 'Página ' + doc.internal.getNumberOfPages() //esto dibuja la página actual + el total de páginas
        doc.text(str, 30, doc.internal.pageSize.height - 10)
      } else {
        doc.text("__________________________________", 34, finalY + 15)
        doc.text("Firma del Coordinador Institucional de Tutorías", 30, finalY + 22)
        doc.text(temporal.coordinador.titulo.titulo.toUpperCase()+" "+temporal.coordinador.usuario.nombreCompleto.toUpperCase(), 38, finalY + 28)
        doc.text("__________________________________", 179, finalY + 15)
        doc.text("Firma del Subdirector Académico", 188, finalY + 22)
        doc.text(temporal.nombreSubdirector.toUpperCase(), 188, finalY + 28)
        doc.putTotalPages(totalPagesExp)
      }
      this.loading = false;
      doc.save('ReporteSemestralDepartamentos.pdf')
    });

  }
}


/*
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
              e.canalizacionesLista.length,
              areasStr.toUpperCase()
            ];
            estudiantesLista.push(n);
          });



          doc.autoTable({
            head: [['Núm. Control', 'Nombre', 'Sem.', 'Ses.', 'Ses. Indiv.', 'Ses. Inicial', 'Can.', 'Áreas de canalización']],
            theme: 'grid',
            body: estudiantesLista,
            styles: {
              halign: 'center',
              fillColor: [0, 79, 122]
            },
            stylesDef: { fontSize: 7 },
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
              doc.text("NÚMERO DE TUTORADOS: " + temporal.estudiantes.length, ruleRight, 58, null, null, 'right');
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
            doc.putTotalPages(totalPagesExp)
          }
          doc.save('ReporteSemestralTutor.pdf')


        }
      }
    );




*/