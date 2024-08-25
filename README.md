# TON_NOT_AlertsBot

## Overview

TON_NOT_AlertsBot is a Telegram bot for tracking cryptocurrency prices and receiving notifications about significant changes in their value.

## Description

TON_NOT_AlertsBot helps monitor price changes for the cryptocurrencies TON (The Open Network) and NOT (NotCoin) in rubles. The bot sends regular updates on current prices and emergency notifications if the price of either coin changes by 30% or more.

## Features

-   **Regular Updates**: The bot checks current cryptocurrency prices twice daily — at 8:00 AM and 10:00 PM. You will receive a message with up-to-date price information and the balance of your assets.
-   **Emergency Alerts**: Every 20 minutes, the bot checks if cryptocurrency prices have changed by 30% or more. In case of a significant change, the bot sends an emergency notification.
-   **Formatting and Display**: The balance is displayed in a convenient format with thousands separators, and fractional parts are removed from the message.

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/crypto-notifier.git
    cd crypto-notifier

    ```

2. **Install dependencies:**

    ```bash
    npm install

    ```

3. **Configure the `.env` file:**
   Create a `.env` file in the root directory of the project and add your sensitive data:
    ```env
    TELEGRAM_TOKEN=your_telegram_bot_token
    CHAT_ID=your_chat_id
    TON_AMOUNT=your_ton_amount
    NOT_AMOUNT=your_not_amount
    ```

-   TELEGRAM_TOKEN: Your Telegram bot token.
-   CHAT_ID: The chat ID where the bot will send messages.
-   TON_AMOUNT: The amount of TON coins you hold.
-   NOT_AMOUNT: The amount of NOT coins you hold.

## Running the Bot

To run the bot, use the following command:

    ````bash
    node index.js

## Example Messages

-   **Regular Update:**

    ```yaml
    TON: 620.72 RUB (0.00%)
    NOT: 1.094 RUB (0.00%)

    💰 Total money: 68,855 RUB (0.00%)
    ```

-   **Emergency Notification:**

    ```yaml
    ❗️Emergency Alert:
    TON: 620.72 RUB (+35.00%)
    NOT: 1.094 RUB (-25.00%)

    💰 Total money: 68,855 RUB (+20.00%)
    ```

## Notes

-   Ensure that your Telegram bot has access to your chat to send messages.
-   If you want to adjust the frequency of checks or the threshold values, edit the relevant settings in the code.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

-   **CoinGecko API** for cryptocurrency price data.
-   **node-telegram-bot-api** for Telegram bot integration.
-   **node-fetch** for making HTTP requests.
