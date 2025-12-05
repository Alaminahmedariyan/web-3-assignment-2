import e from "express";
import express, { Request, Response } from "express";
const app = express();
const port = 5000;

// parser 
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
    res.send("Hello this is a simple server created by a TypeScript Developer");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});