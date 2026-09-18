import type { ServerWebSocket } from "bun";
import { logger } from "@kanban/logger";
import type { ServerEvent, WebSocketClientData } from "./realtime.types";

export class RealtimeBroker {
  private channels = new Map<string, Set<ServerWebSocket<WebSocketClientData>>>();
  private userSockets = new Map<string, Set<ServerWebSocket<WebSocketClientData>>>();

  registerClient(ws: ServerWebSocket<WebSocketClientData>) {
    const userId = ws.data.userId;
    let sockets = this.userSockets.get(userId);
    if (!sockets) {
      sockets = new Set();
      this.userSockets.set(userId, sockets);
    }
    sockets.add(ws);

    this.subscribe(ws, `user:${userId}`);
  }

  unregisterClient(ws: ServerWebSocket<WebSocketClientData>) {
    const userId = ws.data.userId;
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.delete(ws);
      if (sockets.size === 0) {
        this.userSockets.delete(userId);
      }
    }

    for (const channel of ws.data.subscriptions) {
      this.unsubscribe(ws, channel);
    }
  }

  subscribe(ws: ServerWebSocket<WebSocketClientData>, channel: string) {
    let members = this.channels.get(channel);
    if (!members) {
      members = new Set();
      this.channels.set(channel, members);
    }
    members.add(ws);
    ws.data.subscriptions.add(channel);

    try {
      ws.subscribe(channel);
    } catch {
      
    }
  }

  unsubscribe(ws: ServerWebSocket<WebSocketClientData>, channel: string) {
    const members = this.channels.get(channel);
    if (members) {
      members.delete(ws);
      if (members.size === 0) {
        this.channels.delete(channel);
      }
    }
    ws.data.subscriptions.delete(channel);

    try {
      ws.unsubscribe(channel);
    } catch {
      
    }
  }

  broadcastToChannel<T>(channel: string, event: string, data: T) {
    const payload: ServerEvent<T> = {
      event,
      channel,
      timestamp: new Date().toISOString(),
      data,
    };
    const message = JSON.stringify(payload);

    const members = this.channels.get(channel);
    if (members) {
      for (const ws of members) {
        try {
          ws.send(message);
        } catch (err) {
          logger.error("Failed to send WS message", { error: String(err) });
        }
      }
    }
  }

  broadcastToBoard<T>(boardId: string, event: string, data: T) {
    this.broadcastToChannel(`board:${boardId}`, event, data);
  }

  broadcastToWorkspace<T>(workspaceId: string, event: string, data: T) {
    this.broadcastToChannel(`workspace:${workspaceId}`, event, data);
  }

  sendToUser<T>(userId: string, event: string, data: T) {
    this.broadcastToChannel(`user:${userId}`, event, data);
  }
}

export const realtimeBroker = new RealtimeBroker();
