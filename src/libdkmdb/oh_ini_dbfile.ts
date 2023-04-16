// https://github.com/npm/ini#readme
import * as ini from "ini"
import * as fs from "fs"

export interface TOhIniDBFile{
    userName:string
    password:string
    database:string
    host:string
    bin:number
    bin_fakt:number
}

export function loadOhIniDBFile(filePath:string):TOhIniDBFile {

    function getIniValue(sect:string, valueName:string):string {
        return config[sect][valueName]
    }

    var config = ini.parse(fs.readFileSync(filePath, 'utf-8'));
    const SECT_DB="DATABASEPARAMS";
    //[DATABASEPARAMS]
    // DRIVERNAME=MSSQL
    // USER NAME=sa
    const user = getIniValue(SECT_DB,"USER NAME");
    // PASSWORD=yyyyy
    const password = getIniValue(SECT_DB, "PASSWORD");
    // DATABASE NAME=OHEMM
    const database = getIniValue(SECT_DB,"DATABASE NAME");
    // SERVER NAME=localhost\offhlp17
    const host = getIniValue(SECT_DB,"SERVER NAME");
    // PERSISTENCE_UNITNAME=libGaDataPU
    // SQL_LOGIN_PROC=galogin.ga_p_login
    // [willco]
    // excelpfad=c:\off43\excel\excel.exe
    // kundenname=emm FOEGEB
    // rootdir=d:\kunden\emmpdb
    // KALKExportDir=d:\kunden\emmpdb
    // FAKTExportDir=d:\kunden\emmpdb
    // FaktAusgabeArt=wurst
    // serBrVersion=TXT
    // [ID]
    // MTGL_BIN=3101
    const SECT_ID ="ID";
    // LG_BIN=3000
    const bin = parseInt(getIniValue(SECT_ID,"MTGL_BIN"));
    // BINFAKT=10000
    const bin_fakt = parseInt(getIniValue(SECT_ID,"BINFAKT"));
    // EUROFAKTOR=13,12
    // LG_ARGE_ZONE=3
    // ARGE_ZONE=3100
    // LISLG=YES
    return {
        userName:user,
        password:password,
        database:database,
        host,
        bin,
        bin_fakt
    }
}



