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
const shareddb = __importStar(require("../dbsharedconfpg"));
const local_settings = __importStar(require("../../util/local_settings"));
const ohIniDbFile = {
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
        function doQuery(conf) {
            return __awaiter(this, void 0, void 0, function* () {
                const rows = yield conf.conn.query(sql, dbparams);
                console.log(JSON.stringify(rows));
                done();
            });
        }
        shareddb.sharedDbCfg().execInTransaction(doQuery);
    });
});
