import express from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";

import {
    getSuratKeluar,
    getSuratKeluarById,
    createSuratKeluar,
    updateSuratKeluar,
    deleteSuratKeluar
} from "../controllers/SuratKeluarControllers.js";

import {
    getSuratMasuk,
    getSuratMasukById,
    createSuratMasuk,
    updateSuratMasuk,
    deleteSuratMasuk
} from "../controllers/SuratMasukControllers.js";

import {
    getUsers,
    getUsersById,
    loginUser,
    registerUser
} from "../controllers/UsersControllers.js";

const router = express.Router();


router.get('/', (req, res) => {
    res.send('Server is active');
  });
router.get('/suratkeluar', authenticateToken, getSuratKeluar);
router.get('/suratkeluar/:id', authenticateToken, getSuratKeluarById);
router.post('/suratkeluar', authenticateToken, createSuratKeluar);
router.patch('/suratkeluar/:id', authenticateToken, updateSuratKeluar);
router.delete('/suratkeluar/:id', authenticateToken, deleteSuratKeluar);
router.get('/suratmasuk', authenticateToken, getSuratMasuk);
router.get('/suratmasuk/:id', authenticateToken, getSuratMasukById);
router.post('/suratmasuk', authenticateToken, createSuratMasuk);
router.patch('/suratmasuk/:id', authenticateToken, updateSuratMasuk);
router.delete('/suratmasuk/:id', authenticateToken, deleteSuratMasuk);
router.get('/users', authenticateToken, getUsers);
router.get('/user/:id', authenticateToken, getUsersById);
router.post('/user/login', loginUser);
router.post('/user/register', registerUser);


export default router;