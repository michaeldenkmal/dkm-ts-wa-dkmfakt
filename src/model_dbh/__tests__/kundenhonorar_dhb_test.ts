import { initDb } from "../../util/local_settings";
import * as kundenhonorar from "../../model/kundenhonorar_m";
import exp from "constants";
import { sharedDbCfg } from "../../libdkmpgdb/dbsharedconfpg";
import { save,deleteByNr } from "../kundenhonorar_dbh";
import { classicNameResolver } from "typescript";
import { createSelectFieldsAndFromExpr } from "../../libdkmpgdb/pg_select";
import { IDbConf } from "../../libdkmdb/idbconf";
import { promises } from "dns";

initDb("D:\\projekte\\ts\\dkm-ts-wa-dkmfakt\\local_conf\\offh.ini");


describe("kundenhonorar_dhb",()=> {

    it("save",(fnDone)=> {
        const row = kundenhonorar.createEmpty();
        row.firma1 = "test";
        expect(row.nr).toBeFalsy();
        (async() => {
            try {
                const savedRow =  await sharedDbCfg().execInTransaction(conf=>save(conf,row));
                expect(row.nr).toBeTruthy();
                expect(savedRow.nr).toBeTruthy();    
            } 
            catch(e){
                console.log(e.stack);
                throw new Error(e);
            }
            fnDone();
        })()
    });
    it("delete", fnDone=> {
        const sql=`${createSelectFieldsAndFromExpr(kundenhonorar.DML_TABLE_INFO)}
            where firma1 ilike 'test';
        `
        async function dbAction(conf:IDbConf) {
            const rows= await conf.conn.query(sql);
            expect(rows.length).toBeGreaterThan(0);
            const proms = rows.map(r=> deleteByNr(conf, r));
            await Promise.all(proms)
            const rowsafterdelete = await conf.conn.query(sql);
            expect(rowsafterdelete.length).toBe(0);
        }
        async function afn() {
            await sharedDbCfg().execInTransaction(dbAction);                                         
        
            fnDone();
        }
        afn();
    });
});