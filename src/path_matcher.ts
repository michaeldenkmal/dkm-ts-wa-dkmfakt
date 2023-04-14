import { TPathParams } from "./dkm_rest_types";
import * as exu from "./test_export_util";


export const FILE_NAME ="path_matcher";



function extractPathParamPart(pathParam:string):string |null {
    if (pathParam && pathParam.length>2 && pathParam.startsWith("{") && pathParam.endsWith("}")) {
        return pathParam.substring(1, pathParam.length-1);
    }
    return null
}

interface ExtractFixedPartsRes {
    fixedParts:string[]
    pathParams:string[]
}


function extractFixedParts(pathTemplate:string):ExtractFixedPartsRes {
    const path_parts = pathTemplate.split("/");
    const fixedParts:string[]=[];
    const pathParams:string[]=[];
    for (let i=0; i< path_parts.length;i++) {
        const path_part = path_parts[i];
        const mayBeParamPart = extractPathParamPart(path_part);
        if (mayBeParamPart) {
            pathParams.push(mayBeParamPart);
        } else{
            if (path_part){
                fixedParts.push(path_part);
            }
        }
    }
    return {
        fixedParts, pathParams
    }
}

function areStrArraysEqual(a1:string[], a2:string[]):boolean {
    if (!a1 || !a2) {
        return false;
    }
    if (a1.length != a2.length) {
        return false;
    }
    for (let i=0; i<a1.length; i++) {
        if (a1[i]!=a2[i]) {
            return false;
        }
    }
    return true;
}


export function matchAndExtractParams(pathTemplate:string, realPath:string):TPathParams {

    if (!(pathTemplate) || !(realPath)){
        return null;
    }

    const templParts = pathTemplate.split("/");
    const realParts = realPath.split("/");

    if (templParts.length !== realParts.length) {
        return null;
    }

    const ret ={};
    

    for (let i=0; i<templParts.length;i++  ) {
        // wenn einträge gleich sind, 
        const templPart = templParts[i] || "";
        const realPart = realParts[i]||"";
        if (templPart == realPart) {
            continue;                
        } else {
            const pathParamPart = extractPathParamPart(templPart);
            if (pathParamPart) {
                ret[pathParamPart]= realPart;
            } else {
                // pfad unterscheiden sich hier, und der templpart ist keine Platz halter
                return null;
            }
        }
    }
    return ret;

}
export interface PrivateTestFunc {
    extractPathParamPart:(pathParam:string)=>string |null
    extractFixedParts:(pathTemplate:string)=>ExtractFixedPartsRes
    areStrArraysEqual:(a1:string[], a2:string[])=>boolean
}
if (exu.isUnitTest()) {
    const exp:PrivateTestFunc= {
        extractPathParamPart,
        extractFixedParts,
        areStrArraysEqual
    };
    exu.exportFunc4UnitTest(FILE_NAME,exp);
}