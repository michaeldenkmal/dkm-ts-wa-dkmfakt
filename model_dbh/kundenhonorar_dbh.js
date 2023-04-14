"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function getRowByNr(conf, nr) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = `select * from kundenhonorar where nr= $1`;
        const dbparams = [nr];
        const res = yield conf.conn.query(sql, dbparams);
        if (res.length == 0) {
            return null;
        }
        else {
            return res[0];
        }
    });
}
exports.getRowByNr = getRowByNr;
function getAll(conf) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = `select * from kundenhonorar order by firma1`;
        return yield conf.conn.query(sql);
    });
}
exports.getAll = getAll;
