// 1. Получаем данные от API (токен), аутентифицируемся spotify
// 2. Аутентифицируемся в аккаунт Telegram
// 3. Асинхронно проверяем каждые 5 секунд, играет ли песня в плейбаке. Если да - записываем данные в био аккаунта, нет - очистить био аккаунта.
// 4. По прошествии 3500 секунд обновить токен API

import fs from "fs";
import requestAuth from "../src/scripts/Spotify/requestAuth.js";
import { requestPlayback } from "../src/scripts/Spotify/requestPlayback.js";
import getFullUser from "../src/scripts/Telegram/getFullUser.js";
import startClient from "../src/scripts/Telegram/startClient.js";
import config from "../config.json" assert { type: "json" };
import restoreBio from "../src/scripts/Telegram/restoreBio.js";
import updateBio from "../src/scripts/Telegram/updateBio.js";
import getFormattedTime from "../src/scripts/common/getFormattedTime.js";

if (config.options.PlaybackCheckInterval < 5000)
    console.warn(
        "You specified a playback status check interval of less than 5 seconds. The script may malfunction."
    );

(async () => {
    const { client, savedSession } = await startClient();

    if (fs.statSync("./src/scripts/Telegram/old_bio.txt").size <= 0) {
        fs.writeFileSync(
            "./src/scripts/Telegram/old_bio.txt",
            (await getFullUser(config.telegram.username, client, savedSession))
                .fullUser.about,
            "utf-8"
        ); // Creating backup of the old bio
    }

    if (config.options.TryRestoreOldBio) {
        process.on("SIGINT", async () => {
            clearInterval(loop);
            await restoreBio(client, savedSession);
            process.exit();
        });
    }

    let authData = await requestAuth();

    // console.log(`Initial token: [${authData.access_token}]`);

    const loop = setInterval(async () => {
        let current = await requestPlayback(authData.access_token);

        if (current === "") {
            if (config.options.LogPlaybackState) {
                await updateBio("🎵: Playback is empty", client, savedSession);
            } else if (config.options.TryRestoreOldBio) {
                await restoreBio(client, savedSession);
            }
            console.log(`[${getFormattedTime()}] Playback is empty`);
        } else if (current.error) {
            await restoreBio(client, savedSession);
            console.error(current);
            throw new Error("Spotify API error: ", current);
        } else {
            let name = current.item.name;
            let artists = current.item.artists.slice(0);
            let songName = "";
            for (let artist of artists) {
                songName += `${artist.name},`;
            }
            songName = "🎵: " + songName.slice(0, -1) + " - " + name;

            if (songName.length > 70) songName = songName.slice(0, 67) + "...";

            await updateBio(songName, client, savedSession);

            console.log(`[${getFormattedTime()}] now playing: ${songName}`);
        }
    }, config.options.PlaybackCheckInterval);
})();
