import { Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import moment from 'moment-timezone';
import db from '../config/Database.js';

const { DataTypes } = Sequelize;

const Users = db.define('tb_users', {
  nama: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  verified: DataTypes.INTEGER,
  jabatan: DataTypes.INTEGER,
  terakhir_masuk: DataTypes.DATE,
}, {
  freezeTableName: true
});

// Method to compare password entered by user and the hash stored in the database
Users.prototype.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate and sign JWT token
Users.prototype.generateAuthToken = function () {
  const expirationTime = moment().add(2, 'hour').tz('Asia/Jakarta').toDate();
  const expirationInSeconds = Math.floor(expirationTime.getTime() / 1000);
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: expirationInSeconds
  });
};

export default Users;

(async () => {
  await db.sync();
})();


