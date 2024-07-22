export class User {
  userId: number;
  username: string;
  email: string;
  isAdmin: boolean;
  isSeller: boolean;
  permissions: {
    action: [string];
    subject: string;
    condition?: object;
  };
}
