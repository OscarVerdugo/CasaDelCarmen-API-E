//dependencies
import jwt from "jsonwebtoken";
import { authConfigs } from "../configs/auth.config";
import { NextFunction }  from "express";
//models
import { Payload, Res, Req } from "../interfaces/extra";
//utils
////queries
import { q_profiles_by_user } from "../utils/queries.utils";
////database
import { query } from "../utils/database.utils";

export function Auth(req:Req,res:Res,next:NextFunction){
  const token : string = req.headers['x-access-token'] as string;
  if(!token){
    return res.status(403).json({
      error:true,
      message:"Token no proveído."
    } as Payload);
  }

  jwt.verify(token,authConfigs.secret,(err,decoded:any)=>{
    if(err){
      return res.status(401).json({
        error:true,
        message:"No tienes permisos de acceso.",
        extra:err
      } as Payload);
    }
    req.user_id = decoded.user_id;
    next();
  })
}


export function hasProfile(profile:string){
  return async function(req:Req,res:Res,next:NextFunction){
    const profiles: Array<any> = await query(q_profiles_by_user,"l",{user_id:req.user_id});
    if(profiles){
      const i : number   = profiles.findIndex((x:any) => x.name.toLocaleLowerCase() == profile.toLocaleLowerCase());
      if(i >= 0){
        next();
        return;
      }
    }
    res.status(401).json({
      error:true,
      message:`No autorizado, requiere permisos de ${profile.toUpperCase()}`
    } as Payload) 
  }
}