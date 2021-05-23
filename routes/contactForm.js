const express = require("express");
const config = require("config");
const Joi = require("joi");
const nodemailer = require("nodemailer");

const { User } = require("../models/user");

const router = express.Router();

router.get("/", (req, res) => {
  User.find({ isDeleted: false })
    .then((result) => {
      // console.log(result);
      res.status(200).send(result);
    })
    .catch((err) => {
      // console.log(err);
      res.status(503).send("something failed");
    });
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const d = new Date();
  const utc_offset = d.getTimezoneOffset();
  d.setMinutes(d.getMinutes() + utc_offset);

  const mumbai_offset = 5.5 * 60;
  d.setMinutes(d.getMinutes() + mumbai_offset);

  // d.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  // const timeString = `${d.getDate()}-${d.getMonth()}-${d.getFullYear()} || ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  const timeString = `${d.toLocaleString("en-IN")}`;
  // console.log(timeString);

  const user = new User({
    userName: req.body.userName,
    userEmail: req.body.userEmail,
    userMessage: req.body.userMessage,
    createdAt: timeString,
  });

  const result = await user.save();

  const updatedUserName = result.userName;
  // console.log("username:", updatedUserName);
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.get("mygmail"), // generated ethereal user
      // pass: "", // generated ethereal password
      pass: config.get("mypw"),
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // <h3><b>Hello ${updatedUserName},</b><br></h3>
  let mailOptions = {
    from: `"Nisarg H Patel" <${config.get("mygmail")}>`, // sender address
    to: result.userEmail, // list of receivers
    subject: `Hi ${updatedUserName}`, // Subject line
    // text: "", // plain text body
    html: `
    <div style="text-align:left;">
    
      <h4>Thank you for filling out your information!
        <br> It really means a lot to me 😊
      </h4>

      <p style="font-size:1.2em;">I have received your message and would like to thank you for writing to me. If your inquiry is urgent, please use the mobile number +917069766147 to talk to me. Otherwise, I will reply by email as soon as possible.</p>
    </div>
    
    
    `, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    }
    // console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    res.status(200).send(result);
  });
});

router.put("/:msgId", (req, res) => {
  const messageId = req.params.msgId;
  const time = req.body.time;
  console.log(messageId);

  User.findOneAndUpdate(
    { _id: messageId },
    { isDeleted: true, updatedTime: time }
  )
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
      // console.log(err);
    });
});

function validateUser(user) {
  const schema = {
    userName: Joi.string()
      .trim()
      .regex(/^[A-Za-z ]+$/)
      .required()
      .error(() => {
        return {
          message: "Please enter a valid Full Name",
        };
      }),
    userEmail: Joi.string()
      .trim()
      .email()
      .regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
      .required()
      .error(() => {
        return {
          message: "Please enter a valid Email",
        };
      }),
    userMessage: Joi.string()
      .trim()
      .required()
      .error(() => {
        return {
          message: "Please enter a valid Message",
        };
      }),
  };

  return Joi.validate(user, schema);
}

module.exports = router;
