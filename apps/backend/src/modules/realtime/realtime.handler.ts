import type { ServerWebSocket } from "bun";
import { logger } from "@kanban/logger";
import { requireWorkspaceMember } from "../../middleware/rbac";
import { boardRepository } from "../boards/board.repository";
import { realtimeBroker } from "./realtime.broker";
import type { ClientAction, WebSocketClientData } from "./realtime.types";

export class RealtimeHandler {
  onOpen(ws: ServerWebSocket<WebSocketClientData>) {
    realtimeBroker.registerClient(ws);
    logger.info("WebSocket connection opened", { userId: ws.data.userId });
  }

  async onMessage(
    ws: ServerWebSocket<WebSocketClientData>,
    rawMessage: string | Buffer
  ): Promise<void> {
    try {
      const text = typeof rawMessage === "string" ? rawMessage : rawMessage.toString();
      const payload = JSON.parse(text) as ClientAction;

      if (payload.action === "ping") {
        ws.send(
          JSON.stringify({
            event: "pong",
            timestamp: new Date().toISOString(),
          })
        );
        return;
      }

      if (payload.action === "unsubscribe") {
        if (!payload.channel) return;
        realtimeBroker.unsubscribe(ws, payload.channel);
        ws.send(
          JSON.stringify({
            event: "unsubscribed",
            channel: payload.channel,
          })
        );
        return;
      }

      if (payload.action === "subscribe") {
        const channel = payload.channel;
        if (!channel) {
          ws.send(
            JSON.stringify({
              event: "error",
              error: { code: "INVALID_CHANNEL", message: "Channel name required" },
            })
          );
          return;
        }

        const [type, id] = channel.split(":");

        if (type === "user") {
          if (id !== ws.data.userId) {
            ws.send(
              JSON.stringify({
                event: "error",
                error: {
                  code: "UNAUTHORIZED_CHANNEL",
                  message: "Cannot subscribe to another user channel",
                },
              })
            );
            return;
          }
          realtimeBroker.subscribe(ws, channel);
          ws.send(JSON.stringify({ event: "subscribed", channel }));
          return;
        }

        if (!id) {
          ws.send(
            JSON.stringify({
              event: "error",
              error: { code: "INVALID_CHANNEL", message: "Channel identifier missing" },
            })
          );
          return;
        }

        if (type === "workspace") {
          try {
            await requireWorkspaceMember(id, ws.data.userId, "VIEWER");
            realtimeBroker.subscribe(ws, channel);
            ws.send(JSON.stringify({ event: "subscribed", channel }));
          } catch {
            ws.send(
              JSON.stringify({
                event: "error",
                error: {
                  code: "UNAUTHORIZED_CHANNEL",
                  message: "Access to workspace denied",
                },
              })
            );
          }
          return;
        }

        if (type === "board") {
          try {
            const board = await boardRepository.findById(id);
            if (!board) {
              ws.send(
                JSON.stringify({
                  event: "error",
                  error: { code: "RESOURCE_NOT_FOUND", message: "Board not found" },
                })
              );
              return;
            }

            await requireWorkspaceMember(board.project.workspaceId, ws.data.userId, "VIEWER");
            realtimeBroker.subscribe(ws, channel);
            ws.send(JSON.stringify({ event: "subscribed", channel }));
          } catch {
            ws.send(
              JSON.stringify({
                event: "error",
                error: {
                  code: "UNAUTHORIZED_CHANNEL",
                  message: "Access to board denied",
                },
              })
            );
          }
          return;
        }

        ws.send(
          JSON.stringify({
            event: "error",
            error: { code: "INVALID_CHANNEL", message: `Unsupported channel type: ${type}` },
          })
        );
      }
    } catch (err) {
      logger.error("Failed to parse WebSocket message", { error: String(err) });
      ws.send(
        JSON.stringify({
          event: "error",
          error: { code: "BAD_REQUEST", message: "Malformed JSON message" },
        })
      );
    }
  }

  onClose(ws: ServerWebSocket<WebSocketClientData>, code: number, reason: string) {
    realtimeBroker.unregisterClient(ws);
    logger.info("WebSocket connection closed", {
      userId: ws.data.userId,
      code,
      reason,
    });
  }
}

export const realtimeHandler = new RealtimeHandler();
