import * as exu from "../test_export_util";
import * as patch_matcher from "../path_matcher";

const privFuncs:patch_matcher.PrivateTestFunc = exu.importFunc4UnitTest(patch_matcher.FILE_NAME);


describe("path_matcher",()=> {
    describe("areStrArraysEqual",()=> {
       it("yes",()=> {
           const arr1 = ["1","2"];
           const arr2 = ["1","2"];
            expect(privFuncs.areStrArraysEqual(arr1, arr2)).toBeTruthy();
       });
       it ("no one is null",()=> {
           const arr1 = ["1","2"];
           const arr2 = null;
           expect(privFuncs.areStrArraysEqual(arr1, arr2)).toBeFalsy();

       });
       it ("no both are null",()=> {
           const arr1 = null;
           const arr2 = null;
           expect(privFuncs.areStrArraysEqual(arr1, arr2)).toBeFalsy();

       });
       it ("no same length, but not same casing",()=> {
           const arr1 = ["M","2"];
           const arr2 = ["m","2"];
           expect(privFuncs.areStrArraysEqual(arr1, arr2)).toBeFalsy();
       })
    });
    describe("extractFixedParts",()=>{
        // extractFixedParts
        it("path containts no path params",()=>{
            const path = "/kundenhonorar/list";
            const res = privFuncs.extractFixedParts(path);
            const expected = {
                fixedParts:["kundenhonorar","list"],
                pathParams:[]
            };
            expect(res).toStrictEqual(expected);
        });
        it("path containts path params",()=>{
            const path = "/kundenhonorar/edit/{nr}";
            const res = privFuncs.extractFixedParts(path);
            const expected = {
                fixedParts:["kundenhonorar","edit"],
                pathParams:["nr"]
            };
            console.log(JSON.stringify(res));
            console.log(JSON.stringify(expected));
            expect(res).toStrictEqual(expected);
        });

    });
    describe("extractPathParamPart", ()=> {
        it ("null => null",()=>{
            expect(privFuncs.extractPathParamPart(null)).toBeNull();
        }) ;
        it ("normal path=>null",()=>{
            expect(privFuncs.extractPathParamPart("kundenhononrar")).toBeNull();
        });
        it ("{nr}=>nr",()=>{
            expect(privFuncs.extractPathParamPart("{nr}")).toBe("nr");
        });
    });
    describe("matchAndExtractParams",()=>{
       it("no match=> null",()=>{
           const templatePath="/kunden/edit/[nr}";
           const realPath="/kunden/list";
           expect(patch_matcher.matchAndExtractParams(templatePath, realPath)).toBeNull();
       });
       it("match=> {nr:1}",()=>{
            const templatePath="/kunden/edit/{nr}";
            const realPath="/kunden/edit/1";
            const expected = {nr:"1"};
            const res =patch_matcher.matchAndExtractParams(templatePath, realPath);
            expect(res).toStrictEqual(expected);

       });
       it ("null -> if pathTemplate is null",()=> {
           const templatePath=null;
           const realPath="/kunden/list";
           expect(patch_matcher.matchAndExtractParams(templatePath, realPath)).toBeNull();
       });
        it ("null -> if realTemplate is null",()=> {
            const templatePath="/kunden/edit/[nr}";
            const realPath=null;
            expect(patch_matcher.matchAndExtractParams(templatePath, realPath)).toBeNull();
        });
    });
});