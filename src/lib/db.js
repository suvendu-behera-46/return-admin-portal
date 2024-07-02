// lib/db.js
import { Client } from "pg";

const client = new Client({
  connectionString:
    "postgresql://postgres:mysecretpassword@localhost:5000/postgres",
});

client.connect().catch((err) => console.error("Connection error", err.stack));

export default client;
