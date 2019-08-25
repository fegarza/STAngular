 export class Usuario{
    id: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    correo: string;
    genero: string;
    token: string;
    tipo: string;
}

class Persona{
    nombre: string;
    apellidos: string;
}

class Parent extends Persona{
    vive: boolean;
    trabajo: string;
    telefono: string;
}

export class Personal {
    id: number;
    clave: "";
    rango: number;
}

export class Estudiante {
    id: number;
    numeroDeControl: string =  "";
    correo: string = "";
    datosClinicos: DatoClinico;
    datosGenerales: DatoGeneral;
    usuario : Usuario;
    ObtenerSemestre(){
        return "Quinto semestre";
    }
}

export class Carrera{
    id: number;
    nombre:string = "";
    clave:string = ""; 
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