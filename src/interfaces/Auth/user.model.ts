export default interface User{
  id?:number;
  employee_id:number;
  email:string;
  name?:string;
  password:string;
  active:boolean;
  creation_user_id:number;
  update_user_id?:number;
  created_at:Date;
  updated_at?:Date;
}
export function isUser(user:any){//##PENDIENTE


}