// export interface IDbTransExecProc{
//     public void execinTrans(IDbConf conf);
//
// }

import {IDbConf} from "./idbconf";

export interface IDbSharedConf {
//public interface IDbSharedConf
//  {
//     public int getBin();
    bin:number;
    bin_fakt:number;
    getLoginName:()=>String;
//     public void setLoginName(String loginName);
    setLoginName:(loginName:string)=>void;
    //     double getLoginNr();
    //     public void execInTransaction(IDbTransExecProc actions);
    execInTransaction:<T>(action:(conf:IDbConf)=>Promise<T>)=>Promise<T>;
//     public void execInTransWithRaise(IDbTransExecProcRaise actions) throws EdkmDbError;
// }
}
