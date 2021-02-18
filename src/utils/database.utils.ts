import {connect, connectSP} from "../configs/database.configs";
import moment from "moment";

export async function query(query:string,outputType:string = 'l',params?:any):Promise<Array<any> | number | string | any> 
{
  try{
    const conn = await connect();
    const [rows] = await conn.query(query,params);
    return parseQueryOutput(rows,outputType);
  }catch(err){
    console.log(err.message);
    console.log(query);
    console.log(params);
    //PENDIENTE GUARDAR EN LOG EN DB;
    return null;
  }
}
export async function bulkInsert(table:string,lst:Array<any>):Promise<number>{
  try{
    console.log(lst);
    let conn = await connect();
    let names = [];
    for(let p in lst[0]) names.push(p.replace(/ /g,''));//replace to avoid sql injection
    let query = `INSERT INTO ${table} (`;
    for(let name of names) query += `${name},`;
    query = query.slice(0,-1); //remove the last comma
    query += `) VALUES ?`; 
    lst = lst.map(obj => Object.values(obj));
    console.log(query);

    const [rows] = await <any>conn.query(query,[lst]);
    return +rows.affectedRows;
  }catch(err:any){
    console.log(err.message);
    //PENDIENTE GUARDAR EN LOG EN DB;
    throw err;
  }
}
export async function call(procedure:string,outputType:string = "l",params?:any){
  try{
    const conn = await connectSP();
    const [rows] = await conn.query(`CALL ${procedure}`,params);

    return parseCallOutput(rows,outputType);
  }catch(err){
    console.log(err.message);
    console.log(procedure);
    console.log(params);
    //PENDIENTE GUARDAR EN LOG EN DB;
    throw {message:"Error al llamar a procedimiento."};
  }
}

function parseCallOutput(rows:any,type:string){
  switch(type){
    case "l": //list
      return rows[0];
    case "o"://object
      return rows[0][0];
    case "s"://scalar
      return rows[0][0][Object.keys(rows[0][0])[0]];
    case "ar":
      return rows[1].affectedRows;
    case "iid":
      return rows[1].insertId;
    case "m"://multiple
      return rows.splice(0 , rows.length - 1);
  }
}

function parseQueryOutput(rows:any,type:string){
  switch(type){
    case "l": //list
      return rows;
    case "o"://object
      return rows[0];
    case "s"://scalar
      return rows[0][Object.keys(rows[0])[0]];
  }
}
