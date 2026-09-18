export interface WebSocketClientData {
  userId: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatarUrl: string | null;
  };
  subscriptions: Set<string>;
}

export type ClientAction =
  | { action: "subscribe"; channel: string }
  | { action: "unsubscribe"; channel: string }
  | { action: "ping" };

export interface ServerEvent<T = any> {
  event: string;
  channel?: string;
  timestamp: string;
  data: T;
}
