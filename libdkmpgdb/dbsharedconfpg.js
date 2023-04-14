"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
//const { Pool } = require('pg');
const pg = __importStar(require("pg"));
const oh_ini_dbfile = __importStar(require("../libdkmdb/oh_ini_dbfile"));
class TDbSharedConfPg {
    constructor(ohIniDBFile) {
        this.ohIniDBFile = ohIniDBFile;
        this.pool = undefined;
        this.getLoginName = () => {
            return this.loginName;
        };
        //     public void setLoginName(String loginName);
        this.setLoginName = loginName => {
            this.loginName = loginName;
        };
        //     double getLoginNr();
        //     public void execInTransaction(IDbTransExecProc actions);
        this.execInTransaction = action => {
            const conf = {
                bin: this.bin,
                bin_fakt: this.bin_fakt,
                conn: null,
                login_name: this.loginName
            };
            return _execInTransaction(this.pool, conf, action);
        };
        this.bin = ohIniDBFile.bin;
        this.bin_fakt = ohIniDBFile.bin_fakt;
        this.pool = new pg.Pool(createPoolCfg(ohIniDBFile));
    }
}
exports.TDbSharedConfPg = TDbSharedConfPg;
exports.PG_DEFAULT_PORT = 5432;
function analyzeOhDbIniPGHost(pghost) {
    const parts = pghost.split(":");
    if (parts.length == 1) {
        return {
            hostName: pghost,
            port: exports.PG_DEFAULT_PORT
        };
    }
    else {
        return {
            hostName: parts[0],
            port: parseInt(parts[1])
        };
    }
}
exports.analyzeOhDbIniPGHost = analyzeOhDbIniPGHost;
function createPoolCfg(ohIniDBFile) {
    const hostAndPort = analyzeOhDbIniPGHost(ohIniDBFile.host);
    return {
        //    userName:string
        user: ohIniDBFile.userName,
        //     password:string
        password: ohIniDBFile.password,
        //     database:string
        database: ohIniDBFile.database,
        //     password_enc:string
        //     host:string
        host: hostAndPort.hostName,
        port: hostAndPort.port,
    };
}
function createBaseAction(client) {
    return {
        query: /*(sql:string, dbparams?:any[])=>Promise<Rows<T>>=*/ (sql, dbparams) => {
            function afn() {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const res = yield client.query(sql, dbparams);
                        return res.rows;
                    }
                    catch (e) {
                        throw new Error(`${e}: query: sql=${sql}, dbparams=${JSON.stringify(dbparams)}`);
                    }
                });
            }
            return afn();
        },
        execSql: /* (sql:string, dbparams?:any[])=>Promise<number> */ (sql, dbparams) => {
            function afn() {
                return __awaiter(this, void 0, void 0, function* () {
                    const res = yield client.query(sql, dbparams);
                    return res.rowCount;
                });
            }
            return afn();
        }
    };
}
function _execInTransaction(pool, conf, action) {
    return __awaiter(this, void 0, void 0, function* () {
        const errors = [];
        // the pool will emit an error on behalf of any idle clients
        // it contains if a backend error or network partition happens
        pool.on('error', (err, client) => {
            console.error('Unexpected error on idle client', err);
            errors.push(`execInTransaction:${err}`);
        });
        return (() => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                //const res = await client.query('SELECT * FROM users WHERE id = $1', [1])
                //console.log(res.rows[0])
                conf.conn = createBaseAction(client);
                return yield action(conf);
            }
            catch (err) {
                console.log(err.stack);
                errors.push(err.stack);
                throw new Error(errors.join("\n"));
            }
            finally {
                client.release();
            }
        }))();
    });
}
let g_dbSharedConfPg = null;
function initByOhDbIniFile(filePath) {
    if (g_dbSharedConfPg) {
        return;
    }
    const ohini = oh_ini_dbfile.loadOhIniDBFile(filePath);
    g_dbSharedConfPg = new TDbSharedConfPg(ohini);
}
exports.initByOhDbIniFile = initByOhDbIniFile;
function sharedDbCfg() {
    if (!g_dbSharedConfPg) {
        throw new Error("init nicht aufgerufen");
    }
    return g_dbSharedConfPg;
}
exports.sharedDbCfg = sharedDbCfg;
