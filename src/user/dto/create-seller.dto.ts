export class CreateSellerDTO {
  userId: number;
  username: string;
  email: string;
  isAdmin?: boolean;
  isSeller?: boolean = true;
  permissions?: {
    action: [string];
    subject: string;
    condition?: object;
  };
}
