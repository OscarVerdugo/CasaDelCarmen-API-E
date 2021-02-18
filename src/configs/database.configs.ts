import {createPool} from "mysql2/promise";
import mysql from "mysql2";

export async function connect(){

  let connection = await createPool({
    host:"localhost",
    user:"osc",
    password:"1234",
    database:"casa-carmen",
    connectionLimit:10,
    typeCast: function (field, next) {
      //parse TINYINT values to boolean
      if (field.type === 'TINY' && field.length === 1) {
        return (field.string() === '1');
      } else {
        return next();
      }
    }
  });
  
  return connection;
}


export async function connectSP(){
  let connection = await createPool({
    host:"localhost",
    user:"osc",
    password:"1234",
    database:"casa-carmen",
    connectionLimit:10,
    typeCast: function (field, next) {
      //parse TINYINT values to boolean
      if (field.type === 'TINY' && field.length === 1) {
        return (field.string() === '1');
      } else {
        return next();
      }
    },
    queryFormat : function (query, values) {
      if (!values) return query;
      return query.replace(/\:(\w+)/g, function (txt:string, key:string) {
        if (values.hasOwnProperty(key)) {
          return mysql.escape(values[key]);
        }
        return txt;
      }.bind(this));
    }
  });
  return connection;
}