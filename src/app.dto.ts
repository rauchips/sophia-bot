export class WebhookDto {
  object: string;
  entry: [
    {
      id: string;
      changes: [
        {
          value: {
            messaging_product: string;
            metadata: {
              display_phone_number: string;
              phone_number_id: string;
            };
            contacts?: [{}];
            errors?: [{}];
            messages?: [{}];
            statuses: [
              {
                status: string;
                recipient_id: string;
              },
            ];
          };
          field: string;
        },
      ];
    },
  ];
}

export enum MessageCategory {
  MESSAGE = 'message',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
}
