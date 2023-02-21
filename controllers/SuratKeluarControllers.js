import SuratKeluar from "../models/SuratKeluarModel.js";
import path from "path";
import fs from "fs";

export const getSuratKeluar = async (req, res) => {
    try {
        const response = await SuratKeluar.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const getSuratKeluarById = async (req, res) => {
    try {
        const response = await SuratKeluar.findOne({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}
export const createSuratKeluar = (req, res) => {
    if (req.files === null) return res.status(400).json({ msg: "No File Uploaded" });
    const judul = req.body.judul;
    const tanggal_surat = req.body.tanggal_surat;
    const tanggal_upload = req.body.tanggal_upload;
    const status = req.body.status;
    const jenis_surat = req.body.jenis_surat;
    const no_surat = req.body.no_surat;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/files/${fileName}`;
    const allowedType = ['.png', '.jpg', '.jpeg', '.pdf', '.doc', '.docx'];

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Files" });
    if (fileSize > 10000000) return res.status(422).json({ msg: "File must be less than 10 MB" });

    file.mv(`./public/files/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });
        try {
            await SuratKeluar.create({
                no_surat: no_surat, judul: judul, tanggal_surat: tanggal_surat,
                tanggal_upload: tanggal_upload, status: status, jenis_surat: jenis_surat
                , file: url, fileName: fileName
            });
            res.status(201).json({ msg: "SK Created Successfuly" });
        } catch (error) {
            console.log(error.message);
        }
    })

}
export const updateSuratKeluar = async (req, res) => {
    const suratKeluar = await SuratKeluar.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!suratKeluar) return res.status(404).json({ msg: "No Data Found" });

    let fileName = "";
    if (req.fileName === null) {
        fileName = suratKeluar.fileName;
    } else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const url = `${req.protocol}://${req.get("host")}/files/${fileName}`;
        const allowedType = ['.png', '.jpg', '.jpeg', '.pdf', '.doc', '.docx'];

        if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
        if (fileSize > 10000000) return res.status(422).json({ msg: "Image must be less than 10 MB" });

        const filepath = `./public/files/${suratKeluar.fileName}`;
        fs.unlinkSync(filepath);

        file.mv(`./public/images/${fileName}`, (err) => {
            if (err) return res.status(500).json({ msg: err.message });
        });
    }
    const judul = req.body.judul;
    const tanggal_surat = req.body.tanggal_surat;
    const tanggal_upload = req.body.tanggal_upload;
    const status = req.body.status;
    const jenis_surat = req.body.jenis_surat;
    const no_surat = req.body.no_surat;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

    try {
        await SuratKeluar.update({
            no_surat: no_surat, judul: judul, tanggal_surat: tanggal_surat,
            tanggal_upload: tanggal_upload, status: status,jenis_surat: jenis_surat ,file: url, fileName: fileName
        }, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({ msg: "Surat Keluar Updated Successfuly" });
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteSuratKeluar = async (req, res) => {
    const suratKeluar = await SuratKeluar.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!suratKeluar) return res.status(404).json({ msg: "No Data Found" });

    try {
        const filepath = `./public/images/${suratKeluar.image}`;
        fs.unlinkSync(filepath);
        await SuratKeluar.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({ msg: "SuratKeluar Deleted Successfuly" });
    } catch (error) {
        console.log(error.message);
    }
}