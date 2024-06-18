const resumeModel = require("../models/resumeModel");
const path = require('path');
const XLSX = require('xlsx');
const XLSXStyle = require('xlsx-style');
const dirName = path.join(__dirname, '..', 'excelFiles');

const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
};

const validateMobileNo = (Number) => {
    return /^[6789][0-9]{9}$/g.test(Number);
};

exports.resumeInfo = async (req, res) => {
    try {
        console.log("some")
        let userData = req.body;
        userData = { ...req.body, ...req.files };
        console.log("userData", userData)

        let { fname, lname, email, phone, currentPosition, desiredPosition, resumeDoc } = userData;

        if (Object.keys(userData).length == 0)
            return res.status(400).send({ status: false, message: "please provide required fields" });

        //============ fname====================

        if (!fname)
            return res.status(400).send({ status: false, message: "first name is mandatory" });

        if (typeof fname != "string")
            return res.status(400).send({ status: false, message: "first name should be in string" });

        fname = userData.fname = fname.trim();

        if (fname == "")
            return res.status(400).send({ status: false, message: "Please Enter first name value" });

        // ========================= lname ==================

        if (!lname)
            return res.status(400).send({ status: false, message: "last name is mandatory" });

        if (typeof lname != "string")
            return res.status(400).send({ status: false, message: "last name should be in string" });

        lname = userData.lname = lname.trim();
        if (lname == "")
            return res.status(400).send({ status: false, message: "Please enter last name value" });

        //================================ email ======

        if (!email)
            return res.status(400).send({ status: false, message: "email is mandatory" });

        if (typeof email != "string")
            return res.status(400).send({ status: false, message: "email id  should be in string" });

        //=========== email =======

        email = userData.email = email.trim().toLowerCase();
        if (email == "")
            return res.status(400).send({ status: false, message: "Please enter email value" });

        if (!validateEmail(email))
            return res.status(400).send({ status: false, message: "Please provide valid email id" });


        //======= phone =============
        if (!phone)
            return res.status(400).send({ status: false, message: "phone is mandatory" });

        if (typeof phone != "string")
            return res.status(400).send({ status: false, message: "phone should be in string" });

        phone = userData.phone = phone.trim();
        if (phone == "")
            return res.status(400).send({ status: false, message: "Please enter phone value" });

        const phoneInteger = parseInt(phone, 10);
        if (isNaN(phoneInteger))
            return res.status(400).send({ status: false, message: "Invalid number format" });

        if (!validateMobileNo(phone))
            return res.status(400).send({ status: false, message: "please provide valid 10 digit Phone Number" });

        //------------currentPosition---------
        if (!currentPosition)
            return res.status(400).send({ status: false, message: "Current Position is mandatory" });

        if (typeof currentPosition != "string")
            return res.status(400).send({ status: false, message: "Current Position should be in string" });

        currentPosition = userData.currentPosition = currentPosition.trim();
        if (currentPosition == "")
            return res.status(400).send({ status: false, message: "Please enter Current Position value" });

        //------------desiredPosition---------
        if (!desiredPosition)
            return res.status(400).send({ status: false, message: "Desired Position is mandatory" });

        if (typeof desiredPosition != "string")
            return res.status(400).send({ status: false, message: "Desired Position should be in string" });

        desiredPosition = userData.desiredPosition = desiredPosition.trim();
        if (desiredPosition == "")
            return res.status(400).send({ status: false, message: "Please enter Desired Position value" });


        //----------------------------------

        if (!req.files[0])
            return res.status(400).send({ status: false, message: "ResumeDoc Position is mandatory" });
            const resumeFile = req.files[0];
            const resumeFilePath = resumeFile.path;
            console.log("File path:", resumeFile.filename);
             resumeDoc = userData.resumeDoc = `api/download/${resumeFile.filename}`;
            console.log("Stored Resume Path:", resumeDoc); 

        const userCreated = await resumeModel.create(userData);

        return res.status(201).send({ status: true, message: "Resume and Data Stored successfully", data: userCreated });
    } catch (error) {
        console.log("erorrrrrrrrr", error.message);
        return res.status(500).send({ status: false, message: error.message });
    }
};

exports.getResumeInfo = async (req, res) => {
    try {
        let resumeData = await resumeModel.find()
        if (!resumeData) { return res.status(404).send({ status: false, message: "User is not found" }) }
        return res.status(200).send({ status: true, message: "Fetched details", data: resumeData })
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ status: false, message: error.message });
    }
}

exports.downloadExcel = async (req, res) => {
    try {
        const rootDir = path.join(__dirname, '..');
        const getResumeData = await resumeModel.find({}, '-_id -createdAt -updatedAt -__v -resumeDoc').lean();

        console.log("get resume", getResumeData); 

        const mappedData = getResumeData.map(item => ({
            'First Name': item.fname,
            'Last Name': item.lname,
            'Email': item.email,
            'Phone': item.phone,
            'Current Position': item.currentPosition,
            'Desired Position': item.desiredPosition
        }));

        const worksheet = XLSX.utils.json_to_sheet(mappedData);
        worksheet['!cols'] = [
            { wch: 20 }, // "First Name" width
            { wch: 20 }, // "Last Name" width
            { wch: 30 }, // "Email" width
            { wch: 15 }, // "Phone" width
            { wch: 25 }, // "Current Position" width
            { wch: 25 }  // "Desired Position" width
        ];
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

        const styledWorkbook = XLSXStyle.read(buffer, { type: 'buffer' });
        const styledWorksheet = styledWorkbook.Sheets['Sheet1'];

        const range = XLSX.utils.decode_range(styledWorksheet['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cell = styledWorksheet[XLSX.utils.encode_cell({ r: 0, c: C })];
            if (!cell.s) cell.s = {};
            cell.s = {
                font: { bold: true },
                border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" }
                }
            };
        }

        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cell = styledWorksheet[XLSX.utils.encode_cell({ r: R, c: C })];
                if (!cell.s) cell.s = {};
                cell.s.border = {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" }
                };
            }
        }

        const fileName = `Resume-${Date.now()}.xlsx`;
        const outputPath = path.join(dirName, fileName);

        XLSXStyle.writeFile(styledWorkbook, outputPath);
        console.log(`Excel file saved as: ${outputPath}`);
        const relativePath = path.relative(rootDir, outputPath);

        return res.status(200).send({ status: true, message: "File created successfully", data: relativePath });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ status: false, message: error.message });
    }
};