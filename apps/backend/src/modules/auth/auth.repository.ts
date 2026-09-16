import { prisma } from "@kanban/db";
import { createHash, randomBytes } from "crypto";
import type { OAuthProviderType, SessionWithUser } from "./auth.types";


export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}


export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export class AuthRepository {

  async findOAuthAccount(provider: OAuthProviderType, providerAccountId: string) {
    return prisma.oAuthAccount.findUnique({
      where: {
        provider_providerAccountId: { provider, providerAccountId },
      },
      include: { user: true },
    });
  }


  async findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }


  async findUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }


  async createUserWithOAuth(data: {
    email: string;
    name: string;
    avatarUrl: string | null;
    provider: OAuthProviderType;
    providerAccountId: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          name: data.name,
          avatarUrl: data.avatarUrl,
        },
      });

      await tx.oAuthAccount.create({
        data: {
          userId: user.id,
          provider: data.provider,
          providerAccountId: data.providerAccountId,
        },
      });

      // Create default personal workspace
      const slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 80);

      const uniqueSlug = `${slug}-${randomBytes(3).toString("hex")}`;

      await tx.workspace.create({
        data: {
          name: `${data.name}'s Workspace`,
          slug: uniqueSlug,
          ownerId: user.id,
          members: {
            create: {
              userId: user.id,
              role: "OWNER",
            },
          },
        },
      });

      return user;
    });
  }

  async linkOAuthAccount(userId: string, provider: OAuthProviderType, providerAccountId: string) {
    return prisma.oAuthAccount.create({
      data: { userId, provider, providerAccountId },
    });
  }

  async createSession(userId: string, rawToken: string): Promise<{ id: string; expiresAt: Date }> {
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14); // 14 days

    const session = await prisma.session.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });

    return { id: session.id, expiresAt: session.expiresAt };
  }

  async validateSession(rawToken: string): Promise<SessionWithUser | null> {
    const tokenHash = hashToken(rawToken);

    const session = await prisma.session.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!session) return null;
    if (session.expiresAt < new Date()) {
      // Expired — clean up
      await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
      return null;
    }

    return { session, user: session.user };
  }

  async deleteSession(rawToken: string): Promise<void> {
    const tokenHash = hashToken(rawToken);
    await prisma.session.deleteMany({ where: { tokenHash } });
  }

  async deleteAllUserSessions(userId: string): Promise<void> {
    await prisma.session.deleteMany({ where: { userId } });
  }
}

export const authRepository = new AuthRepository();
