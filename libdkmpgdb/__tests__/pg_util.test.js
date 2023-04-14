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
const local_settings_1 = require("../../util/local_settings");
const pg_util_1 = require("../pg_util");
const dbsharedconfpg_1 = require("../dbsharedconfpg");
describe("pg_util", () => {
    it("should fetch next id", (done) => {
        local_settings_1.initDb();
        function fn(conf) {
            return __awaiter(this, void 0, void 0, function* () {
                return pg_util_1.getNextMaxId(conf, "datenabtest", "nr");
            });
        }
        dbsharedconfpg_1.sharedDbCfg().execInTransaction(fn)
            .then(newId => {
            expect(newId).toBeTruthy();
            console.log(newId);
            done();
        });
    });
});
