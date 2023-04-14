import * as oh_ini_dbfile from "../oh_ini_dbfile";
import * as path from "path";

describe("oh_ini_dbfile", () => {
    it("should read ini File", () => {
        const iniFilePath = path.join(__dirname,"files","offh.ini");
        const ohIniFile = oh_ini_dbfile.loadOhIniDBFile(iniFilePath);
        const expected :oh_ini_dbfile.TOhIniDBFile = {
            // USER NAME=ohuser
            userName: "ohuser",
            // PASSWORD=xxx
            password:"xxx",
            // DATABASE NAME=dkmfakt
            database: "dkmfakt",
            // SERVER NAME=localhost:1234
            host:"localhost:1234",
            // [ID]
            // MTGL_BIN=3101
            bin: 3101,
            // BINFAKT=10000
            bin_fakt: 10000
        };
        const ohIniFileJson = JSON.stringify(ohIniFile);
        expect(ohIniFile).toStrictEqual(expected);
    })
});