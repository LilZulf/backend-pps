import SuratMasuk from "../models/SuratMasukModel.js";
import path from "path";
import fs from "fs";

export const getSuratMasuk = async (req, res) => {
    try {
        const response = await SuratMasuk.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const getSuratMasukById = async (req, res) => {
    try {
        const response = await SuratMasuk.findOne({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}
export const createSuratMasuk = (req, res) => {
    if (req.files === null) return res.status(400).json({ msg: "No File Uploaded" });
    const judul = req.body.judul;
    const tanggal_surat = req.body.tanggal_surat;
    const tanggal_upload = req.body.tanggal_upload;
    const status = req.body.status;
    // const jenis_surat = req.body.jenis_surat;
    const no_surat = req.body.no_surat;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/files/${fileName}`;
    const allowedType = ['.png', '.jpg', '.jpeg', '.pdf', '.doc', '.docx'];

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Files" });
    if (fileSize > 10000000) return res.status(422).json({ msg: "File must be less than 10 MB" });
    // file.mv(`./public/files/${fileName}`, async (err) => {
    file.mv(`./dist/public/files/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });
        try {
            await SuratMasuk.create({
                no_surat: no_surat, judul: judul, tanggal_surat: tanggal_surat,
                tanggal_upload: tanggal_upload, status: status, jenis_surat: jenis_surat
                , file: url, fileName: fileName
            });
            res.status(201).json({ msg: "SM Created Successfuly" });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ msg: "Something went wrong" });
        }
    })

}
export const updateSuratMasuk = async (req, res) => {
    const suratMasuk = await SuratMasuk.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!suratMasuk) return res.status(404).json({ msg: "No Data Found" });

    let fileName = "";
    if (req.fileName === null) {
        fileName = suratMasuk.fileName;
    } else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const url = `${req.protocol}://${req.get("host")}/files/${fileName}`;
        const allowedType = ['.png', '.jpg', '.jpeg', '.pdf', '.doc', '.docx'];

        if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
        if (fileSize > 10000000) return res.status(422).json({ msg: "Image must be less than 10 MB" });

        const filepath = `./public/files/${suratMasuk.fileName}`;
        

        file.mv(`./public/files/${fileName}`, (err) => {
            if (err) return res.status(500).json({ msg: err.message });
        });
        fs.unlinkSync(filepath);
    }
    const judul = req.body.judul;
    const tanggal_surat = req.body.tanggal_surat;
    const tanggal_upload = req.body.tanggal_upload;
    const status = req.body.status;
    const jenis_surat = req.body.jenis_surat;
    const no_surat = req.body.no_surat;
    const url = `${req.protocol}://${req.get("host")}/files/${fileName}`;

    try {
        await SuratMasuk.update({
            no_surat: no_surat, judul: judul, tanggal_surat: tanggal_surat,
            tanggal_upload: tanggal_upload, status: status, jenis_surat: jenis_surat, file: url, fileName: fileName
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

export const deleteSuratMasuk = async (req, res) => {
    const suratMasuk = await SuratMasuk.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!suratMasuk) return res.status(404).json({ msg: "No Data Found" });

    try {
        const filepath = `./public/files/${suratMasuk.fileName}`;
        fs.unlinkSync(filepath);
        await SuratMasuk.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({ msg: "SuratMasuk Deleted Successfuly" });
    } catch (error) {
        console.log(error.message);
    }
}