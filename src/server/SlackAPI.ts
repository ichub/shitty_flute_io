import * as https from "https";
import {IS_PROD} from "./Env";

/**
 * Use this class to send messages to slack.
 */
export class SlackAPI {
    private static shittyFluteChannelName = "shitty-flute";
    private static defaultUsername = "floot.io";
    private static defaultIcon = ":japanese_goblin:";

    public static sendMessage(text, channel, username, icon): Promise<any> {
        console.log(`sending message: ${text}`);

        if (!IS_PROD) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const request = https.request(
                {
                    "hostname": "hooks.slack.com",
                    "path": "/services/T64GHTYH0/B71EBKP7D/1EsIoiAKytPcvc4qyzgT51Rs",
                    "method": "POST",
                    "headers": {"Content-Type": "application/x-www-form-urlencoded"},
                },
                function (response) {
                    resolve();
                });

            request.write(
                'payload={"text":"' + text + '","channel":"' +
                channel + '","username":"' + username + '","icon_emoji":"' + icon + '"}');
            request.end();
        });
    }

    public static async sendMessageToShittyFluteChannel(text): Promise<any> {
        console.log("sending message with slack API");
        return SlackAPI.sendMessage( 
            text,
            SlackAPI.shittyFluteChannelName,
            SlackAPI.generateDefaultUsername(),
            SlackAPI.defaultIcon);
    }

    private static generateDefaultUsername(): string {
        return `${SlackAPI.defaultUsername}`;
    }
}