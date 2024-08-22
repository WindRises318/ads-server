import crypto from "node:crypto";

import HyperExpress from 'hyper-express'
import cors from 'cors'

const API_TOKEN = process.env.API_TOKEN || '7130260995:AAG-4a14xsAfU6sKomjE9ky-hYL1PcZ4oR4'

const app = new HyperExpress.Server()


// app.use(cors({
//     origin: "https://windrises318.github.io"
// }))

app.get("/", (req, res) => {
    res.json({ code: 200, data: "hello world" })
})

app.post("/api/login", async (req, resp) => {
    const params = await req.json()
    const initData = new URLSearchParams(params.initData);
    const hash = initData.get("hash");
    const dataToCheck: string[] = [];
    initData.sort();
    initData.forEach((val, key) => key !== "hash" && dataToCheck.push(`${key}=${val}`));
    const secret = crypto
        .createHmac("sha256", "WebAppData")
        .update(API_TOKEN)
        .digest();

    const _hash = crypto
        .createHmac("sha256", secret)
        .update(dataToCheck.join("\n"))
        .digest("hex");

    resp.json({ message: { validate: hash === _hash }, code: 200 })
})


app.listen(3001)