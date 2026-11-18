import { ChromaClient } from "chromadb";

const client = new ChromaClient({
    ssl: false,
    host: "127.0.0.1",
    port: 8080
});

export default client;
