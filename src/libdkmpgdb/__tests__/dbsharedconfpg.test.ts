import * as shareddb from "../dbsharedconfpg";
import {TOhIniDBFile} from "../../libdkmdb/oh_ini_dbfile";
import * as local_settings from "../../util/local_settings";
import {IDbConf} from "../../libdkmdb/idbconf";

const ohIniDbFile: TOhIniDBFile = {
    userName: "ohuser",
    password: "dkt78",
    database: "dkmfakt",
    host: "localhost",
    bin: 3100,
    bin_fakt: 10000
};


describe('test query', () => {
    it("should list all kundendat with a", (done) => {
        local_settings.initDb();
        const sql = `
            select * from kundenhonorar
            where upper(firma1) like $1
            order by firma1        `;

        const dbparams = ["A%"];

        async function doQuery(conf:IDbConf) {
            const rows = await conf.conn.query(sql, dbparams);
            console.log(JSON.stringify(rows));
            done();
        }

        shareddb.sharedDbCfg().execInTransaction(doQuery)

    });
});