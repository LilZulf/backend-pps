import {Sequelize} from "sequelize";
import db from "../config/Database.js";
 
const {DataTypes} = Sequelize;
 
const SuratMasuk = db.define('tb_surat_masuk',{
    no_surat: DataTypes.STRING,
    judul: DataTypes.STRING,
    tanggal_surat: DataTypes.STRING,
    tanggal_upload : DataTypes.STRING,
    status : DataTypes.INTEGER,
    // jenis_surat : DataTypes.INTEGER,
    file : DataTypes.STRING,
    fileName : DataTypes.STRING
},{
    freezeTableName:true
});
 
export default SuratMasuk;
 
(async()=>{
    await db.sync();
})();