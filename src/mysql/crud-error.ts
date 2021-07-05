
export enum StatusCode {
   BadRequest = 400,
   NotFound = 404,
   InternalServerError = 500,
}

export class CrudError extends Error {
   constructor(private _status: StatusCode, msg: string) {
      super(msg);
   }
   
   public getStatus(): StatusCode {
      return this._status;
   }
}

export function getMysqlStatus(code: string) {
   switch (code) {
      default:
         return StatusCode.BadRequest;
   }
}