import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import input from "input";
import config from "../../../config.json" assert { type: "json" };

const { API_ID, API_HASH } = config.telegram;

export default async function startClient() {
    return new Promise(async (res, rej) => {
        const stringSession = new StringSession();

        const client = new TelegramClient(stringSession, API_ID, API_HASH, {
            connectionRetries: 10,
        });
        console.log(
            "\x1b[33m\x1b[1m%s\x1b[0m",
            `\x1b[32m?${reset} ${boldWhite}Your phone number${reset} ${cyan}+48123456789${reset}`
        );

        if (!(await input.confirm("Confirm?"))) rej("incorrect_phone");

        await client.start({
            phoneNumber: config.telegram.phone,
            password: async () =>
                await input.text("Please enter your password: "),
            phoneCode: async () =>
                await input.text("Please enter the code you received: "),
            onError: (err) => rej(err),
        });
        console.log("You should now be connected.");
        await client.sendMessage("me", { message: "Hello!" });
        res({
            client: client,
            savedSession: client.session.save(),
            username: config.telegram.username,
        });
    });
}
