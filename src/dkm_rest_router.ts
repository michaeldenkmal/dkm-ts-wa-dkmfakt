import { IncomingMessage, ServerResponse } from "http";
import { DkmRestRequest, DkmRestResponse, HTTP_METHOD, TPathHandler, TPathHandlerOpts, createDkmReq, createDkmResp } from "./dkm_rest_types";
import * as pm from "./path_matcher";

function build_api_path(path:string, http_method:HTTP_METHOD ):string {
    if (path.indexOf("|")>-1) {
        throw new Error(`${path} contains | : is not allowed`)
    }
    return `${http_method}|${path}`
}

const ROUTES:Record<string, TPathHandler> = {};

export function addRoute(path:string, http_methid:HTTP_METHOD,handler:TPathHandler) {
    ROUTES[build_api_path(path, http_methid)] = handler;
}

interface GetHandlerByUrlRes {
    handler?:TPathHandler
    pathParams?:Record<string, string>
}

interface TemplPathAndMethodRes{
    templPath:string
    method:HTTP_METHOD
}

function parseTemplPathKey(templatePath:string):TemplPathAndMethodRes {
    const pars = templatePath.split("|");
    if (pars.length<2) {
        throw new Error(`${templatePath} ungültiger templatePath`)
    }
    return {
        templPath:pars[1],
        method: pars[0] as any as HTTP_METHOD
    }
}

export function getHandlerByUrl(url:string, method:HTTP_METHOD):GetHandlerByUrlRes {
    const handlerKey = build_api_path(url,method as any as HTTP_METHOD);
    
    let ret = ROUTES[handlerKey];
    if (ret) {
        return {handler:ret}
    }

    const keys = Object.keys(ROUTES);

    for (let i=0; i<keys.length; i++) {
        const pnm = parseTemplPathKey(keys[i]);
        const pathTemplate = pnm.templPath;
        const pathParams = pm.matchAndExtractParams(pathTemplate,url);
        if (pathParams) {
             return {
                handler: ROUTES[keys[i]],
                pathParams
            }
        }
    }

    return {}

}


export async function realHandleRequest(req:IncomingMessage, res:ServerResponse):Promise<void> {
    return handleRequest( createDkmReq(req), createDkmResp(res));
}

export async function readPostFromRequest(req:IncomingMessage):Promise<string> {

    return new Promise<string>((resolve, reject)=>{
        if (req.method == 'POST') {
            let body = '';
    
            req.on('data', function (data) {
                body += data;
    
                // Too much POST data, kill the connection!
                // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                if (body.length > 1e6 *100)
                    req.connection.destroy();
            });
    
            req.on('end', function () {
                //var post = qs.parse(body);
                // use post['blah'], etc.
                resolve(body);
            });
        }
    })
}



export async function handleRequest(dkmreq:DkmRestRequest, dkmres:DkmRestResponse):Promise<void> {


    const handlerRes = getHandlerByUrl(dkmreq.url,dkmreq.method as any as HTTP_METHOD);

    if (handlerRes.handler) {

        const handlerOpts:TPathHandlerOpts = {
            req:dkmreq, res:dkmres, path:dkmreq.url, pathParams: handlerRes.pathParams
        }
        await handlerRes.handler(handlerOpts);
    }
    //
    // //set the request route
    // if (req.url === "/api" && req.method === "GET") {
    //     //response headers
    //     res.writeHead(200, { "Content-Type": "application/json" });
    //     //set the response
    //     res.write("Hi there, This is a Vanilla Node.js API");
    //     //end the response
    //     res.end();
    // }

    // If no route present
    else {
        return dkmres.endWith404();
        //res.writeHead(404, { "Content-Type": "application/json" });
        //res.end(JSON.stringify({ message: "Route not found" }));
    }
}
