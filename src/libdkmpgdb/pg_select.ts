import { DmlTableInfo } from "../libdkmdb/dkmdb_types";

export function createSelectFieldsAndFromExpr (tableInfo:DmlTableInfo):string {
    const fieldExprs = tableInfo.fieldNames.join(",")
    return `SELECT ${fieldExprs} from ${tableInfo.tableName}`
}