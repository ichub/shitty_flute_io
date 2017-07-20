/**
 * Created by bgu on 7/14/17.
 */

export const tokenLength = 20;

export function generateToken(): string {
    let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let ret = "";
    for (let i = 0; i < tokenLength; i++) {
        ret += chars[Math.floor(Math.random() * chars.length)];
    }
    return ret;
}