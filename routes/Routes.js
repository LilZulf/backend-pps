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
    getUsers,
    getUsersById,
    loginUser,
    registerUser
} from "../controllers/UsersControllers.js";

const router = express.Router();

router.get('/suratkeluar', authenticateToken,getSuratKeluar);
router.get('/suratkeluar/:id', getSuratKeluarById);
router.post('/suratkeluar', createSuratKeluar);
router.patch('/suratkeluar/:id', updateSuratKeluar);
router.delete('/suratkeluar/:id', deleteSuratKeluar);
router.get('/users', getUsers);
router.get('/user/:id', getUsersById);
router.post('/user/login', loginUser);
router.post('/user/register', registerUser);


export default router;