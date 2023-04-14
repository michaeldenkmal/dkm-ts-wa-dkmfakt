if (process.env.NODE_ENV !== 'production') { 
    Error.stackTraceLimit = Infinity 
  } 
import { DkmRestRequest, DkmRestResponse } from "../dkm_rest_types";
import { initDb } from "../../util/local_settings";
import * as drr from "../dkm_rest_router"
describe("app",()=> {
    initDb("D:\\projekte\\ts\\dkm-ts-wa-dkmfakt\\local_conf\\offh.ini");
    it("kundenhonorar/edit",fnDone=> {
        const loglines:string[]=[];
        function log(msg:string) {
            loglines.push(msg);
        }
        const req:DkmRestRequest = {
            url: "/kundenhonorar/edit/1",
            method: "GET"
        }
        const res:DkmRestResponse = {
            writeResJson: function (data: any): Promise<void> {
                return (async ()=> {
                    log(JSON.stringify(data));
                }) ()
            },
            endWith404: function (msg?: string): Promise<void> {
                //throw new Error("Function not implemented.");
                return (async()=> {
                    log(msg);
                    throw new Error("sollte nicht aufgerufen werden");
                })()
            }
        };
        (async() =>{
            try {
                await drr.handleRequest(req, res);

            }
            catch(e) {
                throw new Error(e.stack);
            }
            expect(loglines.length).toBe(1);
            fnDone();
        })();
    })

});