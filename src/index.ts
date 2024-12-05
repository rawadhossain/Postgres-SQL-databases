import express from 'express';
import { Client } from 'pg';

const app = express();
app.use(express.json());

const pgClient = new Client(
    'postgresql://neondb_owner:q6XMzT5umsGN@ep-damp-waterfall-a571x77j.us-east-2.aws.neon.tech/neondb?sslmode=require',
);

pgClient.connect();

app.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    const city = req.body.city;
    const country = req.body.country;
    const street = req.body.street;
    const pincode = req.body.pincode;

    try {
        const insertQuery = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id;`;

        const response = await pgClient.query(insertQuery, [
            username,
            email,
            password,
        ]);

        const userId = response.rows[0].id;

        const addressInsertQuery = `INSERT INTO addresses (city, country, street, pincode, user_id) VALUES ($1, $2, $3, $4, $5);`;

        const addressInsertresponse = await pgClient.query(addressInsertQuery, [
            city,
            country,
            street,
            pincode,
            userId,
        ]);

        res.json({
            message: 'You have signed up',
        });
    } catch (e) {
        console.log(e);
        res.json({
            message: 'Error while signing up',
        });
    }
});

app.listen(3000);
