// https://node-postgres.com/
import {IDbSharedConf} from "../libdkmdb/dbsharedconf";
import {TOhIniDBFile} from "../libdkmdb/oh_ini_dbfile";
import {IDbConf} from "../libdkmdb/idbconf";
import {IDbBaseActions} from "../libdkmdb/Idbutil";


//const { Pool } = require('pg');
import * as pg from "pg";
import {PoolClient, PoolConfig} from "pg";
import {resolve} from "url";
import * as oh_ini_dbfile from "../libdkmdb/oh_ini_dbfile";

export class TDbSharedConfPg implements IDbSharedConf{

    constructor (public ohIniDBFile:TOhIniDBFile) {
        this.bin = ohIniDBFile.bin;
        this.bin_fakt = ohIniDBFile.bin_fakt;
        this.pool = new pg.Pool(createPoolCfg(ohIniDBFile))
    }
    private pool:pg.Pool=undefined;

    public bin:number;

    public bin_fakt:number;

    private loginName:string;

    getLoginName:()=>string =()=>{
        return this.loginName;
    };
//     public void setLoginName(String loginName);
    setLoginName:(loginName:string)=>void= loginName => {
        this.loginName = loginName;
    };
    //     double getLoginNr();
    //     public void execInTransaction(IDbTransExecProc actions);
    execInTransaction:<T>(action:(conf:IDbConf)=>Promise<T>)=>Promise<T> = action => {
        const conf:IDbConf = {
            bin:this.bin,
            bin_fakt:this.bin_fakt,
            conn:null,
            login_name:this.loginName
        };
        return _execInTransaction(this.pool,conf,action)
    }


}

export interface AnalyzeOhDbIniPGHostRes {
    hostName:string
    port:number
}

export const PG_DEFAULT_PORT=5432;

export function analyzeOhDbIniPGHost(pghost:string): AnalyzeOhDbIniPGHostRes {
    const parts = pghost.split(":")
    if (parts.length ==1) {
        return {
            hostName: pghost,
            port: PG_DEFAULT_PORT
        }
    } else {
        return {
            hostName: parts[0],
            port: parseInt(parts[1])
        }
    }
}

function createPoolCfg(ohIniDBFile:TOhIniDBFile):PoolConfig {

    const hostAndPort = analyzeOhDbIniPGHost(ohIniDBFile.host);

    return {
        //    userName:string
        user: ohIniDBFile.userName,
        //     password:string
        password: ohIniDBFile.password,
        //     database:string
        database:ohIniDBFile.database,
        //     password_enc:string
        //     host:string
        host: hostAndPort.hostName,
        port: hostAndPort.port,
    }
}


function createBaseAction(client:PoolClient):IDbBaseActions {
    return {
        query:/*(sql:string, dbparams?:any[])=>Promise<Rows<T>>=*/ (sql, dbparams)=> {

            async function afn() {
                try {
                    const res = await client.query(sql, dbparams);
                    return res.rows;
                }
                catch (e) {
                    throw new Error(`${e}: query: sql=${sql}, dbparams=${JSON.stringify(dbparams)}`)
                }
            }
            return afn()
        },
        execSql:/* (sql:string, dbparams?:any[])=>Promise<number> */ (sql,dbparams)=> {
            async function afn() {
                const res = await client.query(sql, dbparams);
                return res.rowCount;
            }
            return afn();
        }
    }
}

async function _execInTransaction<T>(pool:pg.Pool,conf:IDbConf,action:(conf:IDbConf)=>Promise<T>):Promise<T> {
    const errors :string[] =[];

    // the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        errors.push(`execInTransaction:${err}`)
    });
    return (async () => {
        const client:PoolClient = await pool.connect();
        try {
            //const res = await client.query('SELECT * FROM users WHERE id = $1', [1])
            //console.log(res.rows[0])
            conf.conn = createBaseAction(client);
            return await action(conf);
        } catch (err) {
            console.log(err.stack);
            errors.push(err.stack);
            throw new Error(errors.join("\n"))
        } finally {
            client.release()
        }
    })()
}

let g_dbSharedConfPg:TDbSharedConfPg = null;

export function initByOhDbIniFile(filePath:string) {
    if (g_dbSharedConfPg){
        return;
    }
    const ohini = oh_ini_dbfile.loadOhIniDBFile(filePath);
    g_dbSharedConfPg= new TDbSharedConfPg(ohini);
}

export function sharedDbCfg():TDbSharedConfPg {
    if (!g_dbSharedConfPg) {
        throw new Error("init nicht aufgerufen");
    }
    return g_dbSharedConfPg;
}
