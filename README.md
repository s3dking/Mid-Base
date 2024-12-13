# Mid Base V5

## Folder Info

* ### Commands
  - **Slash**: The folder to store your slash commands.
  - **Prefix**: The folder to store your prefix commands.
  - **Context**: The folder to store your context commands.

* ### Components
  - **Buttons**: The folder to store all of your Discord button response code.
  - **Menus**: The folder to store all of your Discord dropdown menu response code.
  - **Modals**: The folder to store all of your Discord modal response code.

* ### Events
  - The folder to store all of your events that do different things based on the event you are using. **(DO NOT TOUCH INTERACTIONS FOLDER)**

* ### Utils
  - The folder with utilities to make your coding life easier, like logs, etc.

* ### Handlers
  - The folder where the slash, prefix, and context commands are made possible.

## Important
- Rename `EXAMPLE.json` to `config.json`.
- Fill out the token in `config.json` or run `npm run config` in your terminal.
- Do not share your Bot Token.
- If you have any bugs or questions, reach out to me via Discord at @s3dking.

## Config Information

|Config Name|What to put|
|-|:-:|
|token|Bot token from discord developer portal|
|devguildID|The guild id for your bots dev server ( for the dev property )|
|cmdLogChannel|The channel id of where you want to log when commands are used|
|blacklistedUserIds|The people that are not allowed to use your bot|
|prefix|the prefix of your bot e.g. !ping|