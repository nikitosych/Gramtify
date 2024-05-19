import axios from "axios";
import { URLSearchParams } from "url";
import requestRefreshToken from "./requestRefreshToken.js";

export async function requestPlayback(token) {
    if (!token) {
        throw new Error("Wrong initial token, value is ", token);
    }

    return new Promise(async (resolve) => {
        try {
            const response = await axios.get(
                "https://api.spotify.com/v1/me/player/",
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );

            resolve(response.data || "");
        } catch (err) {
            // Error: {"error":{"status":401,"message":"Invalid access token"}}

            if (err.response.data.message == "Invalid access token") {
                token = await requestRefreshToken(authData.refresh_token)
                    .access_token;

                try {
                    const response = await axios.get(
                        "https://api.spotify.com/v1/me/player/",
                        {
                            headers: {
                                Authorization: "Bearer " + token,
                            },
                        }
                    );
                    resolve(response.data || "");
                } catch (error) {
                    console.error(error);
                    throw error;
                }
            } else {
                throw new Error(JSON.stringify(err.response.data));
            }
        }
    });
}
