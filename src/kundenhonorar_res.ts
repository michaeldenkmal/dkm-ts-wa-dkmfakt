// https://www.section.io/engineering-education/a-raw-nodejs-rest-api-without-frameworks-such-as-express/
// https://medium.com/@masnun/typescript-with-koa-part-2-428e82ba4ddb
import * as kundenhonorar_dbh from "./model_dbh/kundenhonorar_dbh";
import {sharedDbCfg} from "./libdkmpgdb/dbsharedconfpg";
import { TPathHandlerOpts } from "./dkm_rest_types";
import { addRoute } from "./dkm_rest_router";
import { Kundenhonorar } from "./model/kundenhonorar_m";


export async function handleListKundenhonorar(pho:TPathHandlerOpts) {

    const {res} = pho;
    const rows = await sharedDbCfg().execInTransaction(conf=> kundenhonorar_dbh.getAll(conf))
    res.writeResJson(rows)
}


export async function handleKundenhonorarByNr(pho:TPathHandlerOpts) {
    const {res, pathParams } = pho;
    if (!pathParams["nr"]) {
        throw Error("handleKundenhonorarByNr: Parameter Nr fehlt");
    }
    const nr = parseInt(pathParams["nr"]);
    const rows = await sharedDbCfg().execInTransaction(conf=> kundenhonorar_dbh.getRowByNr(conf, nr));
    res.writeResJson(rows);
}

export async function handleSave(pho:TPathHandlerOpts) {
    const {res, jsonBody} = pho;
    const row = JSON.parse(jsonBody) as any as Kundenhonorar;
    const savedRow = await sharedDbCfg().execInTransaction(conf=> kundenhonorar_dbh.save(conf, row));
    res.writeResJson(savedRow);
}

export function addRoutes() {
    addRoute("/kundenhonorar/list","GET", handleListKundenhonorar);
    addRoute("/kundenhonorar/edit/{nr}","GET", handleKundenhonorarByNr);    
    addRoute("/kundenhonorar/save", "POST", handleSave);
}




