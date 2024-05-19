import Koa from "koa";
import Router from "koa-router";
import cors from "@koa/cors";
import axios from "axios";
import { URLSearchParams } from "url";
import nocache from "koajs-nocache";
import child_process from "child_process";
import config from "../../../config.json" assert { type: "json" };

const PORT = 54832;
const { CLIENT_ID, CLIENT_SECRET } = config.spotify;
const REDIRECT_URI = `http://localhost:${PORT}/callback`;
const SCOPE = "user-read-playback-state";

async function requestToken(code) {
    const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: REDIRECT_URI,
        }).toString(),
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization:
                    "Basic " +
                    new Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString(
                        "base64"
                    ),
            },
        }
    );

    return response.data;
}

export default async function requestAuth() {
    return new Promise((resolve) => {
        const app = new Koa();
        const router = new Router();

        app.use(cors());
        app.use(nocache());

        router.get("/login", (ctx) => {
            const redirect_uri =
                "https://accounts.spotify.com/authorize?" +
                new URLSearchParams({
                    response_type: "code",
                    client_id: CLIENT_ID,
                    scope: SCOPE,
                    redirect_uri: REDIRECT_URI,
                }).toString();

            ctx.redirect(redirect_uri);
        });

        router.get("/callback", async (ctx) => {
            const code = ctx.query.code || null;
            const error = ctx.query.error || null;

            if (error) {
                console.error(error);
                throw error;
            } else if (code) {
                try {
                    const accessReqResponse = await requestToken(code);
                    // console.log(token);

                    await server.close(() => resolve(accessReqResponse));
                } catch (err) {
                    console.error(err);
                    throw err;
                }
            }
        });

        app.use(router.routes());

        const server = app.listen(PORT, () => {
            console.log(
                `Local auth server started listening on http://localhost:${PORT}`
            );
            child_process.execSync(`start http://localhost:${PORT}/login`);
        });
    });
}
