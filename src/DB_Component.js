import pg from "pg";
import queries from "./queries.js";

async function connect() {
    const client = new pg.Client({
        user: process.env.DB_USERNAME,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });

    await client.connect();
    return client;
}

async function createUser(username, password, email) {
    try {
        const client = await connect();

        const query = {
            text: queries.createUser,
            values: [username, password, email],
        };

        await client.query(query);

        client.end();
    } catch (err) {
        console.error("Error al crear el usuario:", err.stack);
        throw new Error("Falla al crear el usuario.");
    }
}

async function checkUser(username, password) {
    try {
        const client = await connect();

        const query = {
            text: queries.checkUser,
            values: [username, password],
        };

        const res = await client.query(query);

        if (res.rows.length > 0) {
            await updateLogin(username);
        }

        client.end();

        return res.rows.length > 0;
    } catch (err) {
        console.error("Error al ejecutar la consulta:", err.stack);
        throw new Error("Falla al comprobar usuario.");
    }
}

async function updateLogin(username) {
    try {
        const client = await connect();

        const query = {
            text: queries.updateLogin,
            values: [username],
        };

        await client.query(query);

        client.end();
    } catch (err) {
        console.error("Error al actualizar el last_login:", err.stack);
        throw new Error("Falla al actualizar el last_login.");
    }
}

export { checkUser, createUser };
