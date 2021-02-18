import {Response,Request}  from "express";

export interface Res extends Response{
}

export interface Req extends Request{
  user_id?:string | number;
}

export interface Payload{
  error:boolean;
  message:string;
  data?:any;
}