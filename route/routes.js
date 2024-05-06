const express = require('express');
const router = express.Router();
// const userController = require("../controller/controller");
const { resumeInfo, getResumeInfo } = require("../controller/resumeController")


router.post("/api/resumeInfo",resumeInfo);
router.get("/api/getResumeInfo", getResumeInfo);

router.all("/*", function(req,res){
    res.status(400).send({status:false, message:"invalid http request"});
})

module.exports = router;