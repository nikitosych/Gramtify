import fs from "fs";
import updateBio from "./updateBio.js";

export default async function restoreBio(client, session) {
    const data = fs.readFileSync("./src/scripts/Telegram/old_bio.txt", "utf-8");

    if (data.length > 140)
        throw new Error(
            "Error: old_bio.txt cannot contain more than 140 characters"
        );
    return updateBio(data, client, session);
}
