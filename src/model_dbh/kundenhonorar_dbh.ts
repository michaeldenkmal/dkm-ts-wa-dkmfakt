import { TRow } from "../libdkmdb/dkmdb_types";
import {IDbConf} from "../libdkmdb/idbconf";
import { buildPGDeleteSNP } from "../libdkmpgdb/pg_delete";
import { buildPgUpsert } from "../libdkmpgdb/pg_upsert";
import * as pg_util from "../libdkmpgdb/pg_util";
import { Kundenhonorar,DML_TABLE_INFO } from "../model/kundenhonorar_m";



export async function getRowByNr(conf:IDbConf, nr:number):Promise<Kundenhonorar|null> {
    const sql=`select * from kundenhonorar where nr= $1`;
    const dbparams = [nr]
    const res= await conf.conn.query(sql, dbparams);
    if (res.length == 0) {
        return null;
    } else {
        return res[0];
    }
}


export async function getAll(conf:IDbConf):Promise<Kundenhonorar[]> {
    const sql=`select * from kundenhonorar order by firma1`;
    return await conf.conn.query(sql);
}






export async function save(conf:IDbConf, row:Kundenhonorar):Promise<Kundenhonorar>{

    if (!row.nr) {
        row.nr = await pg_util.getNextMaxId(conf, "kundenhonorar", "nr");
    }

    const snp = buildPgUpsert({
        row: row,
        tableInfo: DML_TABLE_INFO
    })



    // const sql=`
    //     INSERT INTO kundenhonorar(
    //         ${parFieldUpdValues.fieldsExpr})
    //     VALUES (${parFieldUpdValues.paramsPlaceHoldersExpr})
    //     ON CONFLICT (nr) Do Update 
    //         set ${parFieldUpdValues.updExpr}        
    // `;

    
    await conf.conn.execSql(snp.sql,snp.values);

    return row;          
}

export  async function deleteByNr(conf:IDbConf, row:Kundenhonorar):Promise<void> {
    const snp = buildPGDeleteSNP({
        tableInfo: DML_TABLE_INFO, row: row as any as TRow
    })    
    await conf.conn.execSql(snp.sql, snp.values);
}

