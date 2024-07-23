# Gramtify

Gramtify is a simple Node JS app that lets your friends on Telegram see what you're listening to right now on Spotify!

Uses the [Spotify Web API](https://developer.spotify.com/documentation/web-api) for the authorization flow and getting data from the player, and [GramJS](https://gram.js.org/) to publish that data to the user's Telegram profile.

## Pre-requisites:

-   [Node JS](https://nodejs.org/en/download/prebuilt-installer) version 17.5.0 or higher

## How to use?

1. [Clone](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) this repository to your device
2. Run terminal in the directory of the cloned repository
3. Run the command `npm i` (assuming that NPM is present in the PATH variable)
4. Configure the config.json file
5. Run the application using "npm start" while in the repository directory

But you will need some data to work with the API, which should be entered in the config file.

### To work with the [Spotify Web API](https://developer.spotify.com/documentation/web-api), you will need to complete following steps:

1. Go to [your Dashboard](https://developer.spotify.com/dashboard) and register a new app by clicking on "Create App" and enter the following information:

-   App Name: "My App"
-   App description: anything
-   Redirect URI: `http://localhost:54832/callback`

2. Go to your Dashboard again and click on the name of the app you just created. Next, click on the "Settings" button. CLIENT_ID and CLIENT_SECRET can be found there.
3. Copy the CLIENT_ID and CLIENT_SECRET below and enter them into config.json

### Next, you will need data to work with the Telegram API. Here's how you can get them:

1. Go to https://my.telegram.org/apps, login and create a new app, enter any name and description.
2. API_ID and API_HASH will appear on the page immediately after the first step. Copy them and paste them into the appropriate fields in config.json.

### Finally, just enter your credentials into `"phone"` and `"username"` fields. Ensure that your 

# Troubleshooting

This is my first Node JS app and my first repository on GitHub at all. I would be very happy to receive any edits, contributions, comments, ideas, as well as collaboratively fixing issues of Gramtify.
