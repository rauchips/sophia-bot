export class WebhookDto {
    object: string;
    entry: [{
        id: string;
        changes: [{
            value: {
                messaging_product: string;
                metadata: {
                    display_phone_number: string;
                    phone_number_id: string;
                }
                contacts?: [{}];
                errors?: [{}];
                messages?: [{}];
                statuses?: [{}];
            };
            field: string;
        }]
    }];
}

export enum MessageCategory {
    MESSAGE = 0,
    SENT = 1,
    DELIVERED = 2,
    READ = 3,
  }