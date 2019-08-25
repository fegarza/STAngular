export interface IRespuesta{
    code : number;
    data: object;
    mensaje : string;
}
export class Respuesta implements IRespuesta{
    code : number;
    data: object;
    mensaje : string;
}