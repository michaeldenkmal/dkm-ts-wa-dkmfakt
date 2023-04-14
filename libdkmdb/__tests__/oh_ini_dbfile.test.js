"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const oh_ini_dbfile = __importStar(require("../oh_ini_dbfile"));
const path = __importStar(require("path"));
describe("oh_ini_dbfile", () => {
    it("should read ini File", () => {
        const iniFilePath = path.join(__dirname, "files", "offh.ini");
        const ohIniFile = oh_ini_dbfile.loadOhIniDBFile(iniFilePath);
        const expected = {
            // USER NAME=ohuser
            userName: "ohuser",
            // PASSWORD=xxx
            password: "xxx",
            // DATABASE NAME=dkmfakt
            database: "dkmfakt",
            // SERVER NAME=localhost:1234
            host: "localhost:1234",
            // [ID]
            // MTGL_BIN=3101
            bin: 3101,
            // BINFAKT=10000
            bin_fakt: 10000
        };
        const ohIniFileJson = JSON.stringify(ohIniFile);
        expect(ohIniFile).toStrictEqual(expected);
    });
});
