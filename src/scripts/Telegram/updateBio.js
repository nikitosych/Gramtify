import { Api } from "telegram/tl/index.js";
import { StringSession } from "telegram/sessions/index.js";

export default async function updateBio(bio, client, session) {
    if (bio.length > 70) {
        throw new Error(
            "Error: new bio cannot contain more than 70 characters"
        );
    }

    new StringSession(session);

    await client.connect();

    const result = await client.invoke(
        new Api.account.UpdateProfile({
            about: bio,
        })
    );

    console.log(result);
}
