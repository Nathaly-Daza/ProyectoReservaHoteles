import { createPool } from "mysql2/promise";
 const pool = createPool({
    host:'localhost',
    port:'3306',
    user:'root',
    driver: "MySQL",
    name: "Prueba01",
    password:'root',
    database:'Prueba01',
    password: ""
 });
 export default pool;
 /*{
   "mysqlOptions": {
     "authProtocol": "default",
     "enableSsl": "Disabled"
   },
   "previewLimit": 50,
   "server": "localhost",
   "port": 3306,
   "driver": "MySQL",
   "name": "Prueba01",
   "database": "Prueba01",
   "username": "root",
   "password": ""
 }*/