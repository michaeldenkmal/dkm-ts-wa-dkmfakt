import {Kundenhonorar} from "../model/kundenhonorar";
import {IDbConf} from "../libdkmdb/idbconf";

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

