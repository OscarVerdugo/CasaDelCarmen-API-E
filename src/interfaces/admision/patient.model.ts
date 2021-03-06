export default interface Patient{
  id?:number,
  first_name:string,
  paternal_surname:string,
  maternal_surname:string,
  birthday:Date,
  gender:string,
  marital_status:string,
  sons:number,
  brothers:number,
  all_agree:boolean,
  native_city_id:number,
  native_city_name?:string,
  mobile_phone?:string,
  home_phone?:string,
  employment_id:number,
  employment_name?:string,
  ssn:string,
  health_institution:string,
  social_program:string,
  scholarship_id:number,
  scholarship_name?:string,
  religion_id:number,
  religion_name?:string,
  street:string,
  house_number:string,
  suburb:string,
  city_id:number,
  city_name?:string,
  state_id:number,
  state_name?:string,
  comments?:string,
  active:boolean,
  creation_user_id:number,
  creation_user_email?:string,
  update_user_id:number,
  update_user_email?:string,
  created_at:Date,
  updated_at:Date
}