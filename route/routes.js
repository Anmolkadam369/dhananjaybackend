const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require("path");

const { resumeInfo, getResumeInfo, createExcel, downloadResume, downloadExcel } = require("../controller/resumeController");

// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploadResume')); // Adjust this path as necessary
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.use('/uploadResume', express.static(path.join(__dirname, '../uploadResume')));

router.post("/api/resumeInfo", upload.any(), resumeInfo);
router.get("/api/getResumeInfo", getResumeInfo);
router.get('/api/createExcel', createExcel)
router.get("/api/download/:filename", downloadResume)
router.get("/api/downloadExcel/:filename", downloadExcel)

router.get("/api/test", (req, res) => {
    try { return res.status(200).send({ status: true, message: "its working fine !!!" }); }
    catch (error) { return res.status(500).send({ status: false, message: error.message }); }
});

router.all("/*", function (req, res) {
    res.status(400).send({ status: false, message: "invalid http request" });
});

module.exports = router;
