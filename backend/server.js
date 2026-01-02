const express = require("express");
const cors = require("cors");
const multer = require("multer");

const getEmails = require("./excelreader");
const sendMail = require("./mailer");
const sendWithLimit = require("./rateLimiter");

const app = express();
app.use(cors());

let results = [];


const storage = multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });


app.post(
    "/send-emails",
    upload.fields([
        { name: "excel", maxCount: 1 },
        { name: "pdf", maxCount: 1 }
    ]),
    async (req, res) => {

        const excelPath = req.files.excel[0].path;
        const pdfPath = req.files.pdf[0].path;

        const emails = getEmails(excelPath);

        results = emails.map(email => ({
            email,
            status: "pending"
        }));

        
        sendWithLimit(emails, async (email) => {

            const item = results.find(r => r.email === email);
            if (item) item.status = "sending";

            try {
                await sendMail(email, pdfPath);
                if (item) item.status = "sent";
            } catch (err) {
                console.error(`ERROR sending to ${email}`);
                console.error(err.message);
                if (item) item.status = "failed";
            }
        });

        res.json({ message: "Email sending started" });
    }
);


app.get("/status", (req, res) => {
    res.json(results);
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
