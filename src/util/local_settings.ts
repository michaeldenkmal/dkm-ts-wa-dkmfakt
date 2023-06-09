import * as path from "path";
import * as dbsharedconfpg from "../libdkmpgdb/dbsharedconfpg";

export function initDb(offhIniFilePath?:string) {
    const iniFilePath = offhIniFilePath || path.join(__dirname,"../../local_conf","offh.ini");
    dbsharedconfpg.initByOhDbIniFile(iniFilePath);
}