import memoizeOne from 'memoize-one';
import { DmlTableInfo, SqlAndParams, TPkInfo, TRow, buildPkFieldSetFromPkInfo } from '../libdkmdb/dkmdb_types';


export interface BuildUpsertExprsRes {
    paramsPlaceHoldersExpr:string
    fieldsExpr:string
    updExpr:string
}

export interface CreatePGUpsertRes extends BuildUpsertExprsRes{
    fieldValues:Array<string|number|boolean>
}

export interface CreatePGUpsertPars{
    row:TRow
    excludeInUpdFields?:Set<string>
    fieldnames:string[]
}

export interface BuildGpUpsertPars {
    row:Record<string, any>
    tableInfo:DmlTableInfo
    excludeInUpdFields?:Set<string>
}



function _buildUpsertExprs(pars:CreatePGUpsertPars): BuildUpsertExprsRes{
    const paramsPlaceHolders:string[] = [];
    const updFieldNames:string[]=[];

    let i=1;
    pars.fieldnames.forEach(fieldName=>{
        paramsPlaceHolders.push("$" + i.toString());
        const value= pars.row[fieldName];
        if (!(pars.excludeInUpdFields.has(fieldName))) {
            updFieldNames.push(fieldName)
        }
        i++;
    })

    const updExpr = updFieldNames.map(fn=> `${fn}= EXCLUDED.${fn}`).join(", \n")

    return {
        paramsPlaceHoldersExpr: paramsPlaceHolders.join(","),
        fieldsExpr: pars.fieldnames.join(","),
        updExpr
    }

}

const buildUpsertExprs = memoizeOne(_buildUpsertExprs);

interface BuildPGValuesPars{
    fieldNames:string[] 
    row:TRow
}
function buildPGValues(pars:BuildPGValuesPars): any[]{

    const values:any[] =[];


    pars.fieldNames.forEach(fieldName=>{
        const value= pars.row[fieldName];
        values.push(value);
    })

    return values;
}

export function buildPgUpsert(pars:BuildGpUpsertPars):SqlAndParams {
    

    const {pkInfo, fieldNames, tableName } = pars.tableInfo;

    const setFields = buildPkFieldSetFromPkInfo(pkInfo, fieldNames);

    const upsertPars : CreatePGUpsertPars = {
        ...pars,
        fieldnames: pars.tableInfo.fieldNames,
        excludeInUpdFields: pars.excludeInUpdFields || setFields,
    }
    
    const upsertExpr:BuildUpsertExprsRes = buildUpsertExprs(upsertPars);

    const fieldUpdValuesPars:BuildPGValuesPars ={
        row: pars.row,
        fieldNames:pars.tableInfo.fieldNames
    }
    const dbparamValues =buildPGValues(fieldUpdValuesPars) ;

    const conflPkExpr = Array.from(setFields).join(", ")
    

    const sql=`
        INSERT INTO ${tableName}(
            ${upsertExpr.fieldsExpr})
        VALUES (${upsertExpr.paramsPlaceHoldersExpr})
        ON CONFLICT (${conflPkExpr}) Do Update 
            set ${upsertExpr.updExpr}        
    `;
    return {
        sql,
        values: dbparamValues
    }
}
