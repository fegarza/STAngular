export class Usuario{
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
    personalId:number;  
    estudiante: Estudiante;
    personal: Personal; 
}
export class Estudiante{
    id:number;
    usuarioId: number;
    grupoId: number;
    carreraId: number;
    numeroDeControl: string;
    sesionesIniciales: number;
    sesiones: number;
    semestre: number;
    carrera: Carrera;
    grupo: Grupo;
    usuario: Usuario = new Usuario();
    estudianteDatos: EstudianteDatos;
    canalizaciones: number;
    canalizacionesLista: Array<Canalizacion> = new Array<Canalizacion>();
    curp: string;
    creditos: number;
    presente: boolean = false;
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
    cve: string;
    tituloId: number;
    titulo: Titulo;
}
export class Titulo{
    id: number;
    titulo: string;
}
export class Departamento{
    id: number;
    titulo : string;
}
export class Cargo{
    tipo: string;
    titulo: string;
}


export class Sesion{
    id: number;
    accionTutorialId: number;
    departamentoId: number;
    fecha: string;
    asistencia: Array<Estudiante>;
    accionTutorial: Accion = new Accion();
    departamento: Departamento = new Departamento();
}

export class Grupo{
    id: number;
    salon: string;
    personalId: number;
    personal: Personal = new Personal();
    estudiantes: Array<Estudiante>;
    sesiones: Array<Sesion>;
}

export class Accion{
    id: number;
    personalId:number;
    titulo: string;
    contenido: string;
    fecha: string;
    obligatorio: boolean;
    tipo: string;
}

export class Atencion{
    id: number;
    areaId: number;
    titulo: string;
}

export class Canalizacion{
    id: number;
    personalId: number;
    estudianteId: number;
    atencionId: number;
    descripcion: string;
    fecha: string;
    estado: string;
    personal: Personal;
    atencion: Atencion;
    estudiante: Estudiante;
}
/*
    CREDITOS
*/
export class Credito{
    estadoDeLaActividad: string;
    estadoDeLaFirma: string;
    fechaDeOficio: string;
}
export class Actividad{
    titulo: string;

}
export class Carrera{
    id: number;
    nombre:string = "";
    clave:string = ""; 
}
export class Archivo{
    id: number;
    titulo: string;
    tipo: string;
    descripcion: string;
    link: string;
    fecha: string;
}
export class EstudianteDatos{
    //Parents
    madreVive: boolean;
    madreTrabajo: string;
    madreTelefono: string;
    padreVive: boolean;
    padreTrabajo: string;
    padreTelefono: string;
    //Personales
    fechaNacimiento: string;
    estadoCivil: string;
    trabaja: boolean;
    tieneBeca: boolean;
    ciudadNacimiento: string;
    estadoNacimiento: string;
    numeroDeHijos: number;
    maximoGradoDeEstudios: string;
    tipoBeca: string;
    telefonoMovil: string;
    dependenciaEconomica: string;
    seguroSocial: string;
    //Familia
    familiaTrabajo: string;
    familiaTrabajoNumero: string;
    calleDomicilio: string;
    numeroDomicilio: string;
    colonia: string;
    nombreEmpresa: string;
    horarioEmpresa: string;
    telefonoDomicilio: string;
    //Deficiencias
    dVista: boolean;
    dOido: boolean;
    dLenguaje: boolean;
    dMotriz: boolean;
    dNerviosa: boolean;
    dCirculatorio: boolean;
    dDigestivo: boolean;
    dRespiratorio: boolean;
    dOseo: boolean;
    dOtro: boolean;
    //Tratamiento
    tTratamiento: boolean;
    tCausa: string;
    //Estado psicofisiologico
    eHinchados: number;
    eVientre: number;
    eCabeza: number;
    eEquilibrio: number;
    eFatiga: number;
    eVista: number;
    eDormir: number;
    ePesadilla: number;
    ePesadillaCont: string;
    eIncontinencia: number;
    eTartamuedo: number;
    eMiedo: number;
}