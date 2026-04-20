import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  node: process.env.ELASTICSEARCH_URL,
  auth: {
    username: process.env.ES_USERNAME,
    password: process.env.ES_PASSWORD,
  },
});

// Test the connection on startup
client
  .ping()
  .then(() => console.log("Elasticsearch connected"))
  .catch((err) => console.error("ES connection failed", err));

module.exports = client;
