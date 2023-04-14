// https://www.section.io/engineering-education/a-raw-nodejs-rest-api-without-frameworks-such-as-express/
// https://medium.com/@masnun/typescript-with-koa-part-2-428e82ba4ddb
import * as http from "http";
import {initDb} from "../util/local_settings";
import { readPostFromRequest, realHandleRequest } from "./dkm_rest_router";
import * as kundenhonorar_res from "./kundenhonorar_res";

const PORT = process.env.PORT || 5000;





initDb();

kundenhonorar_res.addRoutes();

const server = http.createServer(async (req, res) => {

    // Test code
    if (req.method =="POST") {
        readPostFromRequest(req).then(body=> console.log(body));
        res.end();
    }else{
        realHandleRequest(req, res);
    }

});


server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});