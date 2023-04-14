import { rejects } from "assert";
import { promises } from "dns";
import { IncomingMessage, ServerResponse } from "http";

export type TPathParams = Record<string, string>;

export type HTTP_METHOD = "GET" | "POST"

export interface TPathHandlerOpts {
    path:string
    req:DkmRestRequest
    res:DkmRestResponse
    pathParams?:TPathParams
}

export type TPathHandler =(pho:TPathHandlerOpts)=>Promise<void>


export interface DkmRestRequest {
    url:string
    method: string
}

export interface DkmRestResponse {
    writeResJson:(data:any)=>Promise<void>
    endWith404:(msg?:string)=>Promise<void>
}

function writeResJsonHeader(res:ServerResponse) {
    res.writeHead(200, { "Content-Type": "application/json" });
}

async function writeResJson(res:ServerResponse,data:any):Promise<void> {
    writeResJsonHeader(res);
    await res.end(JSON.stringify(data));
    return
}


async function writeResEnd404(res:ServerResponse, msg?:string):Promise<void> {
    res.writeHead(404, { "Content-Type": "application/json" });
    return new Promise<void>( (resolve, reject)=> {
        res.end(JSON.stringify({ message: msg || "Route not found" },()=> {
            resolve();
        }));    

    })
}


export function createDkmReq(req:IncomingMessage) :DkmRestRequest {
    return {
        url:req.url,
        method: req.method
    }
}

export function createDkmResp(res:ServerResponse): DkmRestResponse {
    return {
        writeResJson : data=> writeResJson(res, data),
        endWith404: msg => writeResEnd404(res, msg)
    }
}