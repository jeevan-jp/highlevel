require("dotenv").config({ path: ".env" });
import 'reflect-metadata';

import express from 'express';

const app = express();

app.get('/', (req, res, next) => {
	res.json({ time: Date.now() });
});

const port = process.env.PORT;
app.listen(process.env.PORT, () => { console.log(`listening on ${port}`) });
