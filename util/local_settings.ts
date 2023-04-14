import * as path from "path";
import * as oh_ini_dbfile from "../libdkmdb/oh_ini_dbfile";
import * as dbsharedconfpg from "../libdkmpgdb/dbsharedconfpg";

export function initDb(offhIniFilePath?:string) {
    const iniFilePath = offhIniFilePath || path.join(__dirname,"../local_conf","offh.ini");
    dbsharedconfpg.initByOhDbIniFile(iniFilePath);
}