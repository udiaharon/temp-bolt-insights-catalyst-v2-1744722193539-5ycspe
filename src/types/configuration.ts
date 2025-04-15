export interface ConfigurationForm {
  frequency: "daily" | "weekdays" | "weekly" | "bi-weekly" | "monthly" | undefined;
  time: string;
  notifications: {
    email: boolean;
    sms: boolean;
  };
  emailAddress: string;
  secondaryEmailAddress: string;
  tertiaryEmailAddress: string;
  quaternaryEmailAddress: string;
  phoneNumber: string;
  secondaryPhoneNumber: string;
  tertiaryPhoneNumber: string;
  quaternaryPhoneNumber: string;
  topics: {
    consumer: boolean;
    cost: boolean;
    convenience: boolean;
    communication: boolean;
    competitive: boolean;
    media: boolean;
  };
}