import {IDbConf} from "../libdkmdb/idbconf";

export async function getNextMaxId(conf:IDbConf, tableName:string, fieldName:string="id"):Promise<number> {
    const sql = `select max(${fieldName}) as  nid from ${tableName}`;

    const rows = await conf.conn.query(sql)

    if (rows && rows.length) {
        const curId = rows[0]["nid"];
        return curId +1;
    } else {
        return 1;
    }
    

}