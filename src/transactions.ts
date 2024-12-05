// This would require transactions  in SQL to ensure either both the user information and address goes in, or neither does

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

        const addressInsertQuery = `INSERT INTO addresses (city, country, street, pincode, user_id) VALUES ($1, $2, $3, $4, $5);`;

        await pgClient.query('BEGIN');

        const response = await pgClient.query(insertQuery, [
            username,
            email,
            password,
        ]);

        const userId = response.rows[0].id;

        await new Promise((x) => setTimeout(x, 10 * 1000)); //stop the control on this line for 10s before executing addressInsertresponse

        const addressInsertresponse = await pgClient.query(addressInsertQuery, [
            city,
            country,
            street,
            pincode,
            userId,
        ]);

        await pgClient.query('COMMIT');
        //ensures that both the user information and address goes in, if either doesnt then the transaction is rolled back i.e nothing is inserted

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
