import { createPool } from "mysql2/promise";
 const pool = createPool({
    host:'localhost',
    port:'3306',
    user:'root',
    driver: "MySQL",
    name: "hotel_reservation",
    password:'root',
    database:'hotel_reservation',
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