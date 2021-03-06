export class Usuario {
    id: number;
    nombreCompleto: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    email: string;
    genero: string;
    token: string;
    tipo: string;
    clave: string;
    publica: string;
    estudianteId: number;
    personalId: number;
    estudiante: Estudiante;
    personal: Personal;
}
export class Estudiante {
    id: number;
    usuarioId: number;
    grupoId: number;
    carreraId: number;
    numeroDeControl: string;
    sesionesIniciales: number;
    sesionesIndividuales: number;
    sesiones: number;
    sesionesEspeciales: number;
    semestre: number;
    carrera: Carrera;
    estado: string;
    grupo: Grupo;
    usuario: Usuario = new Usuario();
    estudianteDatos: EstudianteDatos;
    canalizaciones: number;
    canalizacionesLista: Array<Canalizacion> = new Array<Canalizacion>();
    curp: string;
    creditos: number;
    presente: boolean = false;
    cantidadDeCreditos: number;
    fotoLink: string;
}
export class Personal {
    id: number;
    usuarioId: number;
    usuario: Usuario = new Usuario();
    departamentoId: number;
    departamento: Departamento;
    cargo: string;
    tutorados: number;
    canalizaciones: number;
    posts: number;
    grupoId: number;
    grupo: Grupo;
    cve: string;
    tituloId: number;
    titulo: Titulo;
    //Por parte de los reportes
    canalizacionesLista: Array<Canalizacion> = new Array<Canalizacion>();
    areasDeCanalizacion: Array<Canalizacion> = new Array<Canalizacion>();
    estudiantesAtendidos: number;
    estudiantesAtendidosIndividual: number;
    estudiantes: number;
    estudiantesH1: number;
    estudiantesM1: number;
    estudiantesM: number;
    estudiantesH: number;    
    tutor: string;
    sesionesGrupales: number;
    sesionesIndividuales: number;
    estudiantesPrimeroYSegundoHombres: number;
    estudiantesPrimeroYSegundoMujeres: number;
    estudiantesMayoresHombres: number;
    estudiantesMayoresMujeres: number;    
}
export class Titulo {
    id: number;
    titulo: string;
}
export class Departamento {
    id: number;
    titulo: string;
    jefeTutorias: Personal;
    jefeTutoriasStr: string;
    jefeDepartamento: Personal;
    jefeDepartamentoStr: string;
    personales : Array<Personal>;
    canalizacionesLista: Array<CanalizacionDepertamento> = new Array<CanalizacionDepertamento>();
    
}
export class Cargo {
    tipo: string;
    titulo: string;
}
export class Sesion {
    id: number;
    accionTutorialId: number;
    departamentoId: number;
    fecha: string;
    visible: boolean;
    asistencia: Array<Estudiante>;
    accionTutorial: Accion = new Accion();
    departamento: Departamento = new Departamento();
}
export class SesionIndividual{
    id: number;
    accionTutorialId: number;
    departamentoId: number;
    fecha: string;
    visible: boolean;
    asistencia: Array<Estudiante>;
    accionTutorial: Accion = new Accion();
    departamento: Departamento = new Departamento();
}
export class SesionEspecial {
    id: number;
    fecha: string;
    personal: Personal;
    estudiante: Estudiante;
    estudianteId: number;
    personalId: number;
    comentarios: string;
    
  
}
export class Grupo {
    id: number;
    salon: string;
    personalId: number;
    personal: Personal = new Personal();
    estudiantes: Array<Estudiante>;
    sesiones: Array<Sesion>;
}
export class Accion {
    id: number;
    personalId: number;
    titulo: string;
    contenido: string;
    fecha: Date;
    obligatorio: boolean;
    activo: boolean;
    tipo: string;
}
export class Atencion {
    id: number;
    area: string;
    areaId: number;
    titulo: string;
}
export class Canalizacion {
    id: number;
    personalId: number;
    estudianteId: number;
    atencionId: number;
    descripcion: string;
    fecha: string;
    estado: string;
    area:string
    personal: Personal;
    atencion: Atencion;
    estudiante: Estudiante;
    count: number;
}
/*
    CREDITOS
*/
export class Credito {
    estadoDeLaActividad: string;
    estadoDeLaFirma: string;
    fechaDeOficio: string;
}
export class Actividad {
    titulo: string;

}
export class Carrera {
    id: number;
    titulo: string = "";
    clave: string = "";
}
export class Archivo {
    id: number;
    titulo: string;
    tipo: string;
    descripcion: string;
    link: string;
    fecha: string;
}
export class EstudianteDatos {
    id: number;
    estudianteId: number;
    telefonoDomicilio: string;
    telefonoMovil: string;
    fechaNacimiento: string;
    ciudadNacimiento: string;
    estadoNacimiento: string;
    estadoCivil: string;
    numeroHijos: number;
    calleDomicilio: string;
    numDomicilio: string;
    coloniaDomicilio: string;
    codigoPostalDomicilio: string;
    cependenciaEconomica: string;
    trabaja: boolean;
    empresa: string;
    horario: string;
    padreVive: boolean;
    madreVive: boolean;
    estudiosPadre: string;
    estudiosMadre: string;
    lugarTrabajoPadre: string;
    lugarTrabajoMadre: string;
    lugarTrabajoFamiliar: string;
    telefonoTrabajoPadre: string;
    telefonoTrabajoMadre: string;
    telefonoTrabajoFamiliar: string;
    tieneBeca: boolean;
    becadoPor: string;
    nss: string;
    prescripcionVista: boolean;
    prescripcionOido: boolean;
    prescripcionLenguaje: boolean;
    prescripcionMotriz: boolean;
    prescripcionSistemaNervioso: boolean;
    prescripcionSistemaCirculatorio: boolean;
    prescripcionSistemaDigestivo: boolean;
    prescripcionSistemaRespiratorio: boolean;
    prescripcionSistemaOseo: boolean;
    prescripcionSistemaOtro: boolean;
    tratamientoPsicologicoPsiquiatrico: boolean;
    tratamientoPsicologicoPsiquiatricoExplicacion: boolean;
    manosPiesHinchados: number;
    doloresVientre: number;
    doloresCabezaVomito: number;
    perdidaEquilibrio: number;
    fatigaAgotamiento: number;
    perdidaVistaOido: number;
    dificultadDormir: number;
    pesadillasTerroresNocturnos: number;
    pesadillasTerroresNocturnosAque: number;
    incontinencia: number;
    tartamudeos: number;
    miedosIntensos: number;
    observacionesHigiene: string;
    fechaModificacion: string;
}
export class Count{
    count: number;
}





/*
    -> Reportes
*/

 
class CanalizacionDepertamento{
    canalizaciones : Array<Canalizacion> = new Array<Canalizacion>(); 
}

export class ReporteSemestralGrupo{
    nombreDepartamento: string = "";
    jefeDepartamento: string = "";
    jefeTutor: string = "";
    tutorNombre: string = "";
    estudiantesH1: number = 0;
    estudiantesM1: number = 0;
    estudiantesM: number = 0;
    estudiantesH: number = 0;
    estudiantes: Array<Estudiante> = new Array<Estudiante>(); 
}


export class ReporteSemestralDepartamento{
    id: number = 0;
    titulo: string = "";
    jefeTutor:string = "";
    jefeDepartamento:string = "";

    tutores: Array<Personal> = new Array<Personal>();
}

 

export class ReporteSemestralCoordinacion{
    departamentos: Array<Departamento> = new Array<Departamento>();

    coordinador: Personal =  new Personal();
    nombreSubdirector: string = "";
   
}
