import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateSellerDTO } from './dto/create-seller.dto';

@Injectable()
export class UserService {
  private readonly User: UpdateUserDto[] | CreateUserDto[] = [];
  create(createUserDto: CreateUserDto) {
    this.User.push(createUserDto);
  }

  findAll() {
    return this.User;
  }

  findById(id: number) {
    const resault = this.User.map((el: CreateUserDto) => {
      if (!(id === el.userId)) {
        return 'not found user with this id';
      }
      return el;
    });
    return resault;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const result = this.User.forEach((item, index, store) => {
      if (id === item.userId) {
        store[index] = updateUserDto;
      }
    });
    return result;
  }

  remove(id: number) {
    const result = this.User.forEach((value, index, array) => {
      if (value.userId === id) {
        array.splice(index, 1);
        return true;
      }
      return `not found`;
    });
    return result;
  }

  findOne(email: string) {
    const user: User[] = this.User.map((el: User) => {
      if (el.email === email) {
        return el;
      }
    });
    return user;
  }

  createSeller(seller: CreateSellerDTO) {
    try {
      this.User.push(seller);
      return this.User;
    } catch (error) {
      console.log(error.message);
    }
  }
}
