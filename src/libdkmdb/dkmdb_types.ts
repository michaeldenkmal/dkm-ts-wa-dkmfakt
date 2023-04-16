export interface SqlAndParams {
    sql:string
    values:any[]
}

export type TPkInfo = string|string[]|undefined


export interface DmlTableInfo {
    tableName:string
    pkInfo:TPkInfo
    fieldNames:string[]
}

export type TRow = Record<string, string|number|boolean|Date|null|undefined>;

export function buildPkFieldSetFromPkInfo(pkInfo:TPkInfo, fieldNames:string[]=[]):Set<string> {
    let setFields = new Set<string>();
    if (typeof pkInfo=="undefined") {
        if (fieldNames.indexOf("id")>-1){
            setFields.add("id");
        } else if (fieldNames.indexOf("nr")>-1){
            setFields.add("nr")
        } else {
            throw new Error("weder id noch nr field gefunden");
        }
    } else if (typeof pkInfo == "string"){
        setFields.add(pkInfo);            
    } else if ((typeof pkInfo=="object") && pkInfo.length) {
        setFields = new Set<string>(pkInfo);
    }
    return setFields;
}