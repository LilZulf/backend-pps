import {Sequelize} from "sequelize";
 
const db = new Sequelize('db_pps','root','',{
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false
      },
});
 
export default db;