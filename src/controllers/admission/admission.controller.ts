//models
import {Res,Req,Payload} from "../../interfaces/extra";
import  Patient  from "../../interfaces/admision/patient.model";
import Contact from "../../interfaces/admision/contact.model";
import Admission from "../../interfaces/admision/admission.model";

//utils
import {bulkInsert, call} from "../../utils/database.utils";
////queries - calls
import {c_show_index_admission_application, c_store_admission } from "../../utils/calls.utils";


export async function storeAdmission(req:Req,res:Res){
  try{
    let contactsBackup : string;
    let patient: Patient = req.body.patient;
    let contacts : Array<Contact> = req.body.contacts;
    const area_id : number = req.body.area_id;
    if(!patient || !contacts || !contacts.length || !area_id) throw({message:"Datos incompletos."});
    patient.creation_user_id = req.user_id as number;
    //create patient - admission application - medical appointment
    const patient_id = await call(c_store_admission,"s",{...patient,area_id});

    //create emergency contacts
    contacts.forEach((contact)=>{
      contact.patient_id = patient_id;
      contact.created_at = new Date();
      contact.creation_user_id = req.user_id as number;
    });
    let inserted : number = await bulkInsert("emergency_contacts",contacts);
    if(!inserted)  contactsBackup = JSON.stringify(contacts); //log

    return res.status(200).json(
      {
        error:false,
        message:"Admisión creada con éxito!"
      } as Payload
    );
    
  }catch(err){
    console.log(err);
    return res.status(200).json({
      error: true,
      message:err.message
    } as Payload);
  }
}

export async function showAdmission(req:Req,res:Res){
  try{
    const admission_id = +req.params.admission_id;
    if(!admission_id || typeof admission_id != 'number') throw ({message:"Admisión inválida"});
    const admission : Admission = await call(c_show_index_admission_application,"o",{admission_id,take:null,offset:null});
    if(!admission) throw({message:"Admisión no encontrada."});
    
    return res.status(200).json({
      message:"Admisión encontrada",
      error:false,
      data:{admission}
    } as Payload);

  }catch(err){
    console.log(err);
    return res.status(200).json({
      error: true,
      message:err.message
    } as Payload);
  }
}

export async function indexAdmission(req:Req,res:Res){
  try{
    const take = req.query.take ? req.query.take : null;
    const offset = req.query.offset ? req.query.offset : null;
    const admissions: Array<Admission> = await call(c_show_index_admission_application,"l",{admission_id:null,take,offset});
    return res.status(200).json({
      message:"Listado de admisiones",
      error:false,
      data:{admissions}
    } as Payload)

  }catch(err){
    console.log(err);
    return res.status(200).json({
      error: true,
      message:err.message
    } as Payload);
  }
}

export async function updateAdmission(req:Req,res:Res){
  try{
    const admission_id : number = +req.params.admission_id;
    const admission : Admission = req.body.admission;
    if(!admission_id || typeof admission_id != 'number' || !admission) throw ({message:"Datos de admisión incorrectos"});
    
  }catch(err){
    console.log(err);
    return res.status(200).json({
      error: true,
      message:err.message
    } as Payload);
  }
}