import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import routes from "./src/routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT;
const secret = process.env.SESSION_SECRET;
const sessionName = process.env.SESSION_NAME;

const sessionOptions = {
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        name: sessionName,
        maxAge: 1000 * 60,
        secure: process.env.NODE_ENV === "production" ? true : false,
        httpOnly: true,
    },
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionOptions));
app.use(routes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Algo salió mal");
});

app.listen(port, () => {
    console.log("Server running");
});
