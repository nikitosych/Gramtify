import { Api } from "telegram/tl/index.js";
import { StringSession } from "telegram/sessions/index.js";

export default async function getFullUser(username, client, session) {
    new StringSession(session);

    await client.connect();

    return await client.invoke(new Api.users.GetFullUser({ id: username }));
}
