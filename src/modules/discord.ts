import Websocket from 'ws';
import jsonfile from 'jsonfile';
import fetch, { Response } from 'node-fetch';
import {
  Channel, Guild, WebhookConfig,
} from '../interfaces/interfaces';
import { discordToken, serverId, headers } from '../util/env';

export const createWebhook = async (channelId: string): Promise<string> => fetch(`https://discord.com/api/v8/channels/${channelId}/webhooks`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    name: channelId,
  }),
}).then((res) => res.json())
  .then((json) => `https://discord.com/api/v8/webhooks/${json.id}/${json.token}`);

export const executeWebhook = async ({
  content, embeds, username, url, avatar,
}: WebhookConfig): Promise<Response> => fetch(url, {
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

export const createChannel = async (name: string, pos: number, newId: string, parentId?: string): Promise<Channel> => fetch(`https://discord.com/api/v8/guilds/${newId}/channels`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    name,
    parent_id: parentId,
    position: pos,
  }),
}).then((res) => res.json());

export const listen = async (): Promise<void> => {
  const serverMap = jsonfile.readFileSync('./map.json');
  const socket = new Websocket('wss://gateway.discord.gg/?v=6&encoding=json');
  let authenticated = false;

  socket.on('open', () => {
    console.log('Connected to Discord API');
  });
  socket.on('message', async (data: Websocket.Data) => {
    const message = JSON.parse(data.toString());

    switch (message.op) {
      case 10:
        socket.send(JSON.stringify({
          op: 1,
          d: message.s,
        }));
        setInterval(() => {
          socket.send(JSON.stringify({
            op: 1,
            d: message.s,
          }));
        }, message.d.heartbeat_interval);
        break;
      case 11:
        if (!authenticated) {
          socket.send(JSON.stringify({
            op: 2,
            d: {
              token: discordToken,
              properties: {
                $os: 'linux',
                $browser: 'test',
                $device: 'test',
              },
            },
          }));
          authenticated = true;
        }
        break;
      case 0:
        if (message.t === 'MESSAGE_CREATE' && message.d.guild_id === serverId) {
          const { content, embeds, channel_id: channelId } = message.d;
          const {
            avatar, username, id, discriminator,
          } = message.d.author;
          const avatarUrl = `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`;
          const webhookUrl = serverMap[channelId];
          const hookContent: WebhookConfig = {
            content,
            embeds,
            username: `${username}#${discriminator}`,
            url: webhookUrl,
            avatar: avatarUrl,
          };

          executeWebhook(hookContent);
        }
        break;
      default:
        break;
    }
  });
};

export const getChannels = async (): Promise<Channel[]> => fetch(`https://discord.com/api/v8/guilds/${serverId}/channels`, {
  method: 'GET',
  headers,
}).then((res) => res.json())
  .then((json: Channel[]) => json);

export const createServer = async (channels: Channel[]): Promise<void> => {
  console.log('Creating mirror server...');
  
 
  const serverMap = new Map();
  
 


  

  
};
