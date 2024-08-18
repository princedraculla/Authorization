import { Action } from 'src/enums/action.enum';
import { Subject } from 'src/enums/subject.enum';
export class User {
  userId: number;
  username: string;
  email: string;
  isAdmin?: boolean = false;
  isSeller?: boolean = false;
  permissions?: Array<{
    action: Action | Action[];
    subject: Subject | Subject[];
    condition?: object;
  }>;
}
