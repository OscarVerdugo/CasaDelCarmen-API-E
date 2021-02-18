//dependencies
import express, {Application} from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";

//settings
import {corsConfigs} from "./configs/cors.configs";

//Routes
import indexRoutes from "./routes/index.routes";


export class App{

  private app:Application;

  constructor(private port?:number | string){
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
  }

  settings(){
    this.app.set('port',this.port || process.env.PORT ||3000);
  }
  middlewares(){
    this.app.use(cors(corsConfigs));//**this line must be at the beginning
    this.app.use(morgan('dev'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }
  routes(){
    this.app.use("/",indexRoutes);  
  }

  async listen(){
    await this.app.listen(this.app.get('port'));
    console.log('Server on port',this.app.get('port'));
  }
}