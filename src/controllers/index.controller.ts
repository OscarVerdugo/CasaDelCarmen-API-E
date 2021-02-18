import {Request,Response} from  "express";
import { c_check_email_already_exists } from "../utils/calls.utils";

import {query,call,bulkInsert} from "../utils/database.utils";

export async function index(req:Request,res:Response):Promise<Response>{
  let dummy: Array<any> = [
    {user_id:1,profile_id:2},
    {user_id:1,profile_id:2},
    {user_id:1,profile_id:2},
    {user_id:1,profile_id:2},
    {user_id:1,profile_id:2}
  ]
 let resss = await bulkInsert("user_profiles",dummy);
  // let resss = await query("INSERT INTO user(email,password) VALUES ?","l",{email:"oeverdugo@GMAIL.COM"});
  // let resss = await call(c_check_email_already_exists,'l',{email:"oscareduardover@gmail.com"});
  return res.json(resss);
}