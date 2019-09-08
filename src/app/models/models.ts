export class Grupo{
    id: number;
    salon: string;
    tutor: Personal;
    estudiantes: Array<Estudiante>;
}

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
}
export class Estudiante{
    id:number;
    usuario: Usuario;
    numeroDeControl: string;
    curp: string;
    datosClinicos: DatoClinico;
    datosGenerales: DatoGeneral;
    grupo: Grupo;
    sesiones: number;
    creditos: number;
    canalizaciones: number;
    semestre: number;
    //Modificaciones
    grupoId: number;
}


export class Accion{
    id: number;
    personalId:number;
    titulo: string;
    contenido: string;
    fecha: string;
}

export class Departamento{
    id: number;
    titulo : string;
}
export class Cargo{
    tipo: string;
    titulo: string;
}

export class Personal {
    usuario: Usuario;
    departamentoId: number;
    cargo: string;
    tutorados: number;
    canalizaciones: number;
    posts: number;
    grupoId: number;
   cve: string;
}

export class Carrera{
    id: number;
    nombre:string = "";
    clave:string = ""; 
}


export class Sesion{
    id: number;
    accionTutorialId: number;
    departamentoId: number;
    fecha: string;
}







//FORMULARIO DE CONFIG

class Persona{
    nombre: string;
    apellidos: string;
}
class Parent extends Persona{
    vive: boolean;
    trabajo: string;
    telefono: string;
}
class DatoGeneral{
    //Parents
    Madre: Parent;
    Padre: Parent;

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
    
}

class DatoClinico{
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
