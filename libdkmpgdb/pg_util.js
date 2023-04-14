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
function getNextMaxId(conf, tableName, fieldName = "id") {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = `select max(${fieldName}) as  nid from ${tableName}`;
        const rows = yield conf.conn.query(sql);
        if (rows && rows.length) {
            const curId = rows[0]["nid"];
            return curId + 1;
        }
        else {
            return 1;
        }
    });
}
exports.getNextMaxId = getNextMaxId;
