export class User {
  userId: number;
  username: string;
  email: string;
  role: {
    isAdmin: 'admin';
    isSeller: 'seller';
    regularUser: 'user';
  };
}
