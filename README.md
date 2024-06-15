# LinkProtection Bot

LinkProtection is a Discord bot designed to automatically deletes Scam links and Discord invite links from messages, unless the user has administrator privileges. This helps keep your server safe from potential phishing and unwanted advertisements.

## Features

- Automatically deletes known scam links from a predefined database.
- Deletes Discord invite links unless posted by an administrator.
- Customizable embed message for deleted links.
- Implements a 3-warning system: users receive warnings for each infraction, and after 3 warnings, they are kicked from the server.

## Installation

Follow these steps to set up and run the bot:
Or you can invite our bot: https://discord.com/oauth2/authorize?client_id=1251479549166751867

### Clone the repository

1. Clone the repo
   ```sh
   git clone https://github.com/2cbs/LinkProtection.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Enter your bot token in `config.json`
   ```json
   { "token": "token here" }
   ```
4. Please customise your embed in `index.js`
   ```
   const embedColor = 'fe4e62';
   ```
5. Start the bot
   ```sh
   npm start
   ```

## Usage

Once the bot is up and running, it will automatically monitor messages for scam links and Discord invite links. If it detects any, it will delete the message and send an embed notification, unless the user has administrator privileges.

The bot also implements a 3-warning system:

First and Second Infraction: The user receives a warning.
Third Infraction: The user is kicked from the server.

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue if you have any suggestions or find a bug.

## License

This project is licensed under the AGPL License. See the `LICENSE.txt` file for details.

## Contact
If you have any questions or need further assistance, feel free to open an issue or reach out to the project maintainer.
