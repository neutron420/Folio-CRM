import type { User, Session, OAuthAccount } from "@kanban/db";

export type OAuthProviderType = "GOOGLE" | "GITHUB";

export interface OAuthUserProfile {
  provider: OAuthProviderType;
  providerAccountId: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}

export interface SessionWithUser {
  session: Session;
  user: User;
}

export interface AuthResult {
  sessionToken: string;
  user: User;
}

export interface GoogleTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  id_token?: string;
}

export interface GoogleUserInfo {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
}

export interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

export interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  email: string | null;
}

export interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
}
