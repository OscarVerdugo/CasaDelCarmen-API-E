export default interface Admission{
  id?:number;
  area_id:number;
  area_name?:string;
  status:number;
  active:boolean;
  patient_id:number;
  patient_name?:string;
  creation_user_id:number;
  creation_user_email?:string;
  update_user_id?:number;
  update_user_email?:string;
  created_at:Date;
  updated_at?:Date;
}