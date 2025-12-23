import { WebhookEvent } from '@clerk/express';

/**
 * POST /auth/webhook/clerk
 */
export interface ClerkWebhookInput {
  body: WebhookEvent;
}
