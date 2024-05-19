import updateBio from "./updateBio.js";
import getFullUser from "./getFullUser.js";
import config from "../../../config.json" assert { type: "json" };

export default async function appendBio(bio, client, session) {
    const newBio = (
        await getFullUser(config.telegram.username, client, session)
    ).fullUser.about
        ? (await getFullUser(config.telegram.username, client, session))
              .fullUser.about + `\n${bio}`
        : bio;

    return updateBio(newBio, client, session);
}
