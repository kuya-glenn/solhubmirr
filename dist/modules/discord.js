"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = exports.getChannels = exports.listen = exports.createChannel = exports.executeWebhook = exports.createWebhook = void 0;
const ws_1 = __importDefault(require("ws"));
const jsonfile_1 = __importDefault(require("jsonfile"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const env_1 = require("../util/env");
const createWebhook = async (channelId) => node_fetch_1.default(`https://discord.com/api/v8/channels/${channelId}/webhooks`, {
    method: 'POST',
    headers: env_1.headers,
    body: JSON.stringify({
        name: channelId,
    }),
}).then((res) => res.json())
    .then((json) => `https://discord.com/api/v8/webhooks/${json.id}/${json.token}`);
exports.createWebhook = createWebhook;
const executeWebhook = async ({ content, embeds, username, url, avatar, }) => node_fetch_1.default(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        content,
        embeds,
        username,
        avatar_url: avatar,
    }),
});
exports.executeWebhook = executeWebhook;
const createChannel = async (name, pos, newId, parentId) => node_fetch_1.default(`https://discord.com/api/v8/guilds/${newId}/channels`, {
    method: 'POST',
    headers: env_1.headers,
    body: JSON.stringify({
        name,
        parent_id: parentId,
        position: pos,
    }),
}).then((res) => res.json());
exports.createChannel = createChannel;

exports.listen = listen;
const getChannels = async () => node_fetch_1.default(`https://discord.com/api/v8/guilds/${env_1.serverId}/channels`, {
    method: 'GET',
    headers: env_1.headers,
}).then((res) => res.json())
    .then((json) => json);
exports.getChannels = getChannels;

exports.createServer = createServer;
//# sourceMappingURL=discord.js.map