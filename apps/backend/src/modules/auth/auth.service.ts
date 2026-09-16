import { getEnv } from "@kanban/config";
import { logger } from "@kanban/logger";
import { UnauthorizedError } from "@kanban/errors";
import { randomBytes } from "crypto";
import { authRepository, generateSessionToken } from "./auth.repository";
import type {
  AuthResult,
  OAuthUserProfile,
  GoogleTokenResponse,
  GoogleUserInfo,
  GitHubTokenResponse,
  GitHubUser,
  GitHubEmail,
  SessionWithUser,
} from "./auth.types";

export class AuthService {


  generateState(): string {
    return randomBytes(32).toString("hex");
  }


  getGoogleAuthUrl(state: string): string {
    const env = getEnv();
    const params = new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      redirect_uri: env.GOOGLE_CALLBACK_URL,
      response_type: "code",
      scope: "openid email profile",
      state,
      access_type: "offline",
      prompt: "consent",
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async exchangeGoogleCode(code: string): Promise<OAuthUserProfile> {
    const env = getEnv();

    // Exchange authorization code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: env.GOOGLE_CALLBACK_URL,
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      logger.error("Google token exchange failed", { error: err });
      throw new UnauthorizedError("Failed to exchange Google authorization code");
    }

    const tokens = (await tokenRes.json()) as GoogleTokenResponse;

    // Fetch user profile
    const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userRes.ok) {
      throw new UnauthorizedError("Failed to fetch Google user profile");
    }

    const googleUser = (await userRes.json()) as GoogleUserInfo;

    if (!googleUser.email_verified) {
      throw new UnauthorizedError("Google email is not verified");
    }

    return {
      provider: "GOOGLE",
      providerAccountId: googleUser.sub,
      email: googleUser.email.toLowerCase(),
      name: googleUser.name,
      avatarUrl: googleUser.picture || null,
    };
  }


  getGitHubAuthUrl(state: string): string {
    const env = getEnv();
    const params = new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      redirect_uri: env.GITHUB_CALLBACK_URL,
      scope: "read:user user:email",
      state,
    });
    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  async exchangeGitHubCode(code: string): Promise<OAuthUserProfile> {
    const env = getEnv();

    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: env.GITHUB_CALLBACK_URL,
      }),
    });

    if (!tokenRes.ok) {
      throw new UnauthorizedError("Failed to exchange GitHub authorization code");
    }

    const tokens = (await tokenRes.json()) as GitHubTokenResponse;

    if (!tokens.access_token) {
      throw new UnauthorizedError("GitHub did not return an access token");
    }

    // Fetch user profile
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        Accept: "application/vnd.github+json",
      },
    });

    if (!userRes.ok) {
      throw new UnauthorizedError("Failed to fetch GitHub user profile");
    }

    const ghUser = (await userRes.json()) as GitHubUser;

    // Fetch verified primary email
    let email = ghUser.email;

    if (!email) {
      const emailsRes = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          Accept: "application/vnd.github+json",
        },
      });

      if (emailsRes.ok) {
        const emails = (await emailsRes.json()) as GitHubEmail[];
        const primary = emails.find((e) => e.primary && e.verified);
        if (primary) email = primary.email;
      }
    }

    if (!email) {
      throw new UnauthorizedError("No verified email found on GitHub account");
    }

    return {
      provider: "GITHUB",
      providerAccountId: String(ghUser.id),
      email: email.toLowerCase(),
      name: ghUser.name || ghUser.login,
      avatarUrl: ghUser.avatar_url || null,
    };
  }


  async resolveOAuthUser(profile: OAuthUserProfile): Promise<AuthResult> {
    // 1. Check if this OAuth account already exists
    const existingOAuth = await authRepository.findOAuthAccount(
      profile.provider,
      profile.providerAccountId
    );

    if (existingOAuth) {
      // Existing linked account — create session and return
      const sessionToken = generateSessionToken();
      await authRepository.createSession(existingOAuth.user.id, sessionToken);

      logger.info("OAuth login: existing account", {
        userId: existingOAuth.user.id,
        provider: profile.provider,
      });

      return { sessionToken, user: existingOAuth.user };
    }

    // 2. Check if a user exists with this email (link new provider)
    const existingUser = await authRepository.findUserByEmail(profile.email);

    if (existingUser) {
      // Link new OAuth provider to existing user
      await authRepository.linkOAuthAccount(
        existingUser.id,
        profile.provider,
        profile.providerAccountId
      );

      const sessionToken = generateSessionToken();
      await authRepository.createSession(existingUser.id, sessionToken);

      logger.info("OAuth login: linked new provider to existing user", {
        userId: existingUser.id,
        provider: profile.provider,
      });

      return { sessionToken, user: existingUser };
    }

    // 3. Brand new user — create user + OAuth + default workspace
    const newUser = await authRepository.createUserWithOAuth({
      email: profile.email,
      name: profile.name,
      avatarUrl: profile.avatarUrl,
      provider: profile.provider,
      providerAccountId: profile.providerAccountId,
    });

    const sessionToken = generateSessionToken();
    await authRepository.createSession(newUser.id, sessionToken);

    logger.info("OAuth login: new user created", {
      userId: newUser.id,
      provider: profile.provider,
    });

    return { sessionToken, user: newUser };
  }


  async validateSession(rawToken: string): Promise<SessionWithUser | null> {
    return authRepository.validateSession(rawToken);
  }

  async logout(rawToken: string): Promise<void> {
    await authRepository.deleteSession(rawToken);
  }
}

export const authService = new AuthService();
