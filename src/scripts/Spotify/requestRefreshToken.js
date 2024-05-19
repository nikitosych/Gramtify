import axios from "axios";
import { URLSearchParams } from "url";

const CLIENT_ID = "acb83088d48649358492d6e110f692e2";
const CLIENT_SECRET = "8c4edc427c6c4b8183750e3309b6939a";

export default async function requestRefreshToken(token) {
    console.log(`Trying to send token ${token} to refresh...`);
    const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: token,
        }),
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

    if (!response.data.refresh_token) {
        response.data.refresh_token = token;
        console.log("Access token is still actual");
    } else {
        console.log(`Access token is now ${response.data.access_token}`);
    }

    return response.data;
}
