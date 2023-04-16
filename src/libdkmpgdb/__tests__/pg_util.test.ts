import {initDb} from "../../util/local_settings";
import {getNextMaxId} from "../pg_util";
import {sharedDbCfg} from "../dbsharedconfpg";
import {IDbConf} from "../../libdkmdb/idbconf";

describe("pg_util",()=> {
    it("should fetch next id",(done)=> {
        initDb();

        async function fn(conf:IDbConf) {
            return getNextMaxId(conf, "datenabtest","nr")
        }

        sharedDbCfg().execInTransaction(fn)
            .then(newId=> {
                expect(newId).toBeTruthy();
                console.log(newId);
                done();
            });

    })
});