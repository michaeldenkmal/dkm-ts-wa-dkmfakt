import { DmlTableInfo, SqlAndParams, TRow, buildPkFieldSetFromPkInfo } from "../libdkmdb/dkmdb_types";

export interface BuildPGDeleteSNPPars {
    tableInfo:DmlTableInfo
    row:TRow
}


export function buildPGDeleteSNP(pars:BuildPGDeleteSNPPars):SqlAndParams {
    const setPkFields = buildPkFieldSetFromPkInfo(pars.tableInfo.pkInfo, pars.tableInfo.fieldNames);

    const pkFields = Array.from(setPkFields);
    const values :any[] =[];

    const whereExprs:string[]=[];
    for (let i=0; i<pkFields.length; i++) {
        const fld = pkFields[i];
        whereExprs.push(`${fld} =$${i +1}`);
        const value = pars.row[fld];
        if (!value){
            throw new Error(`pk Fields ist falsy:${fld} bei row ${JSON.stringify(pars.row)}`)
        }
        values.push(value);
    }

    const whereSqlExpr = whereExprs.join(" \n    AND ");

    const sql=`delete from ${pars.tableInfo.tableName} where ${whereSqlExpr}`

    return {
        sql, values
    }
}