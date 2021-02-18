//models
import {Res,Req,Payload} from "../../interfaces/extra";
import  Patient  from "../../interfaces/admision/patient.model";
import Contact from "../../interfaces/admision/contact.model";

//utils
import {bulkInsert, call} from "../../utils/database.utils";
////queries - calls
import { c_delete_patient, c_show_index_patient, c_store_patient, c_update_patient } from "../../utils/calls.utils";

export async function storePatient(req:Req,res:Res){
  let patientBackup : string;
  try{
    let patient: Patient = req.body.patient;
    if(!patient ) throw({message:"Datos incompletos."});
    patient.creation_user_id = req.user_id as number;
    //create patient 
    const patient_id = await call(c_store_patient,"s",{...patient,patient_id:null});


    return res.status(200).json(
      {
        error:false,
        message:"Paciente registrado con éxito!",
        data:{patient_id}
      } as Payload
    );
    
  }catch(err){
    patientBackup = JSON.stringify(req.body.patient);//save 
    return res.status(200).json({
      error: true,
      message:err.message
    } as Payload);
  }
}


export async function updatePatient(req:Req,res:Res){
  let patientBackup : string;
  try{
    let patient: Patient = req.body.patient;
    let patient_id :number = +req.params.patient_id;
    console.log(patient_id);
    if(!patient || !patient_id) throw({message:"Datos incompletos."});
    patient.update_user_id = req.user_id as number;
    //update patient 
    const updated_id = await call(c_update_patient,"s",{...patient,patient_id});


    return res.status(200).json(
      {
        error:false,
        message:"Paciente actualizado con éxito!",
        data:{patient_id:updated_id}
      } as Payload
    );
    
  }catch(err){
    patientBackup = JSON.stringify(req.body.patient);//save 
    return res.status(200).json({
      error: true,
      message:err.message
    } as Payload);
  }
}

export async function deletePatient(req:Req,res:Res){
  try{
    let patient_id : number = +req.params.patient_id;
    let user_id : number = req.user_id as number;
    if(!patient_id) throw({message:"Datos incompletos."});

    let deleted : number = await call(c_delete_patient,"s",{patient_id,user_id});

    return res.status(200).json({
      error: false,
      message: "Paciente eliminado con éxito!",
      data:{patient_id:deleted}
    } as Payload);

  }catch(err){
    return res.status(200).json({
      error: true,
      message:err.message
    } as Payload);
  }
}

export async function showPatient(req:Req,res:Res){
  try{
    const patient_id = +req.params.patient_id;
    if(!patient_id || typeof patient_id != 'number') throw({message:"Datos incompletos."});
    const patient : Patient = await call(c_show_index_patient,"o",{patient_id,take:null,offset:null});
    if(!patient) throw({message:"Paciente no encontrado."});
    
    return res.status(200).json({
      message:"Paciente encontrado",
      error:false,
      data:{patient}
    } as Payload);

  }catch(err){
    console.log(err);
    return res.status(200).json({
      error: true,
      message:err.message
    } as Payload);
  }
}

export async function indexPatient(req:Req,res:Res){
  try{
    const take = req.query.take ? req.query.take : null;
    const offset = req.query.offset ? req.query.offset : null;
    const patients : Array<Patient> = await call(c_show_index_patient,"l",{patient_id:null,take,offset});
    
    return res.status(200).json({
      message:"Listado de pacientes",
      error:false,
      data:{patients}
    } as Payload);

  }catch(err){
    console.log(err);
    return res.status(200).json({
      error: true,
      message:err.message
    } as Payload);
  }
}