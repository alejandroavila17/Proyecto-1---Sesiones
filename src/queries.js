const queries = {
    createUser:
        'INSERT INTO "user" (username, password, email, created_at, last_login) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
    checkUser:
        'SELECT user_id FROM "user" WHERE username = $1 AND password = $2',
    updateLogin:
        "UPDATE \"user\" SET last_login = CURRENT_TIMESTAMP AT TIME ZONE 'UTC' WHERE username = $1",
};

export default queries;
