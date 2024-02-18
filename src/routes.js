import express from "express";
import { checkUser, createUser } from "./DB_Component.js";

const router = express.Router();

router.post("/login", (req, res) => {
    if (req.session.username) {
        res.send("Ya has iniciado sesión");
        return;
    }
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).send("Ingresa el usuario y la contraseña");
        return;
    }

    checkUser(username, password)
        .then((result) => {
            if (!result) {
                res.status(401).send("Usuario o contraseña inválida");
                return;
            }

            req.session.regenerate((err) => {
                if (err) {
                    console.error("Error al regenerar la sesión:", err);
                    res.status(500).send("Internal Server Error");
                    return;
                }

                req.session.username = username;
                res.send(req.session.username + " " + "ha iniciado sesión");
            });
        })
        .catch((error) => {
            console.error("Error al chequear el usuario:", error);
            res.status(500).send("Internal Server Error");
        });
});

router.get("/logout", (req, res) => {
    if (!req.session.username) {
        res.send("No has iniciado sesión");
        return;
    }

    req.session.destroy((error) => {
        if (error) {
            console.error("Error al destruir:", error);
            res.status(500).send("Internal Server Error");
            return;
        }

        res.send("Se cerró la sesión");
    });
});

router.post("/signup", (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        res.status(400).send("Ingresa el usuario, la contraseña y el email");
        return;
    }

    checkUser(username, password)
        .then((userExists) => {
            if (userExists) {
                res.status(409).send("El usuario ya existe");
            } else {
                createUser(username, password, email)
                    .then(() => {
                        res.status(201).send("Usuario creado exitosamente");
                    })
                    .catch((error) => {
                        console.error("Error al crear el usuario:", error);
                        res.status(500).send("Internal Server Error");
                    });
            }
        })
        .catch((error) => {
            console.error("Error al verificar el usuario:", error);
            res.status(500).send("Internal Server Error");
        });
});

export default router;
