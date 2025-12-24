import { clerkClient, WebhookEvent } from '@clerk/express';
import { UserModel } from '../user/user.model.js';
import { logger } from '#src/middlewares/logger.js';

export const authService = {
  getOrCreateMe: async (clerkUserId: string) => {
    let user = await UserModel.findOne({ clerkId: clerkUserId });
    if (user) return user;

    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    const primaryEmail = clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress;

    user = await UserModel.create({
      clerkId: clerkUser.id,

      username: clerkUser.username ?? undefined,
      email: primaryEmail,

      firstName: clerkUser.firstName ?? undefined,
      lastName: clerkUser.lastName ?? undefined,

      avatar: clerkUser.imageUrl,
      role: 'user',

      status: 'active',
      isVerified: false,

      counts: {
        projects: 0,
        workExps: 0,
        educations: 0,
        achievements: 0,
      },
    });

    return user;
  },

  handleClerkWebhook: async (evt: WebhookEvent) => {
    switch (evt.type) {
      case 'user.created': {
        const u = evt.data;

        const email = u.email_addresses?.find((e) => e.id === u.primary_email_address_id)?.email_address;

        await UserModel.updateOne(
          { clerkId: u.id },
          {
            $setOnInsert: {
              clerkId: u.id,
              username: u.username ?? undefined,
              email,
              firstName: u.first_name ?? undefined,
              lastName: u.last_name ?? undefined,
              avatar: u.image_url ?? undefined,
              role: 'user',
              status: 'active',
              isVerified: false,
            },
          },
          { upsert: true },
        );
        break;
      }

      case 'user.updated': {
        const u = evt.data;
        await UserModel.findOneAndUpdate(
          { clerkId: u.id },
          {
            username: u.username ?? u.id,
            email: u.email_addresses?.[0]?.email_address,
            firstName: u.first_name,
            lastName: u.last_name,
            avatar: u.image_url ?? '',
            updatedAt: new Date(),
          },
          { new: true },
        );
        break;
      }

      case 'user.deleted': {
        const u = evt.data;
        await UserModel.findOneAndDelete({ clerkId: u.id });
        break;
      }

      default:
        logger.info(`Unhandled Clerk webhook event: ${evt.type}`);
    }
  },
};
