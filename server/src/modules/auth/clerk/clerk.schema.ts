import { WebhookEvent } from '@clerk/express';

export interface ClerkWebhookInput {
  body: WebhookEvent;
}
