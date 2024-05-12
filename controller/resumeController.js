const resumeModel = require("../models/resumeModel");
const path = require('path');

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

