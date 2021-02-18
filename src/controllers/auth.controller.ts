//dependencies
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs"; 
//configs
import {authConfigs} from "../configs/auth.config";
//models
import {Res,Req,Payload} from "../interfaces/extra";
import User from "../interfaces/Auth/user.model";
import Profile from "../interfaces/Auth/profile.model";

//utils
import {bulkInsert, call,query} from "../utils/database.utils";
////queries
import { q_profiles_by_user } from "../utils/queries.utils";
import {c_check_email_already_exists,c_check_employee_has_user, c_create_user, c_login_user, c_user_profiles} from "../utils/calls.utils";


export async function signup(req:Req,res:Res){ //##PENDIENTE asignar creation_user_id
  try{
    const user : User = req.body.user;
    const profiles : Array<Profile> = req.body.profiles;
    //validations
    if(!profiles || !profiles.length) throw {message:"Es necesario asignar al menos un perfil al usuario."};
    const email_exists : Array<any> = await call(c_check_email_already_exists,'l',{email:user.email}); 
    if(email_exists.length) throw {message:"Ya existe un usuario registrado con ese email, pruebe con otro."};
    const employee_has_user : Array<any> = await call(c_check_employee_has_user,"l",{employee_id:user.employee_id});
    if(employee_has_user.length) throw {message:"El empleado ya cuenta con un usuario."};
    //create user
    user.password = bcryptjs.hashSync(user.password, 8);
    const user_id = await call(c_create_user,"s",user);
    //assign profiles
    const countInserted = await bulkInsert("user_profiles",profiles.map(p => { return {profile_id:p.id,user_id}}));
    
  return res.status(200).json({
    error:false,
    message:"Usuario creado con éxito!"
  } as Payload);    

  }catch(err){
    console.log(err);
    return res.status(200).json({
      error: true,
      message:err.message
    } as Payload);
  }
}

export async function signin(req:Req,res:Res){
  try{
    const user : User = req.body.user;
    const storedUser:User = await call(c_login_user,"o",{email:user.email});
    if(!storedUser) throw {message:"Usuario o contraseña incorrecta."};
    const passwordIsValid = bcryptjs.compareSync(user.password,storedUser.password);
    if(!passwordIsValid) throw {message:"Usuario o contraseña incorrecta."};
    const token = jwt.sign({ user_id: storedUser.id }, authConfigs.secret, {
      expiresIn: 604800 // 7 days
    });
    let profiles : Array<any> = await call(c_user_profiles,"l",{user_id:storedUser.id,platform:"web"});
    if(!profiles || !profiles.length) throw {message:"El usuario no posee ningun perfil, contactar con administrador."};
    
    const outputUser = {
      email: user.email,
      id: user.id,
      name: user.name
    } as User;
    return res.status(200).json({
      user:outputUser,
      profiles,
      token
    });
  }catch(err){
    console.log(err);
    return res.status(200).json({
      error: true,
      message:err.message
    } as Payload);
  }
}

export async function is(req:Req,res:Res){
  try{
    const profile = req.params.profile;
    if(profile) {
      const profiles: Array<any> = await query(q_profiles_by_user,"l",{user_id:req.user_id});
      if(profiles){
        const i : number   = profiles.findIndex((x:any) => x.name.toLocaleLowerCase() == profile.toLocaleLowerCase());
        if(i >= 0){
          return res.status(200).json({
            error:false,
            message:"Autorizado"
          } as Payload);
        }
      }
    }
    return res.status(401).json({
      error:true,
      message:"No estás autorizado para realizar esta acción."
    } as Payload);
  }catch(err){
    console.log(err);
    return res.status(500).json({
      error: true,
      message:err.message
    } as Payload);
  }
}