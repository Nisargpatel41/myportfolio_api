const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {
  const cvName = "nisarg_new_resume.pdf";
  const cvPath = path.join("CV", cvName);
  //   console.log(cvPath);
  fs.readFile(cvPath, (err, data) => {
    if (err) {
      return console.log(err);
    }
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment;filename=Nisarg_Resume.pdf"
    );
    res.status(200).send(data);
  });
});

module.exports = router;
