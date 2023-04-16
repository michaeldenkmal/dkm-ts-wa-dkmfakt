type Rows<T> = T[]

export interface IDbBaseActions {

    query:(sql:string, dbparams?:any[])=>Promise<any[]>
    execSql:(sql:string, dbparams?:any[])=>Promise<number>

}