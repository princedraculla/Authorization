import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateSellerDTO } from './dto/create-seller.dto';
import { AuthGuard } from '../gaurds/auth.guard';
import { PermissionsGuard } from 'src/gaurds/permission.guard';
import { CheckPolicies } from 'src/decorators/policies.decorator';
import { AppAbility } from 'src/ability/casl-ability.factory/casl-ability.factory';
import { Action } from 'src/enums/action.enum';
import { Subject } from 'src/enums/subject.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('add')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @Get('list')
  @UseGuards(AuthGuard, PermissionsGuard)
  @CheckPolicies((ability: AppAbility) => {
    console.log('checking policy for read user');
    return ability.can(Action.Read, Subject.User);
  })
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  @UseGuards(AuthGuard)
  @Post('create-seller')
  createSeller(@Request() req, @Body() sellerObject: CreateSellerDTO) {
    console.log(req);

    const resualt = this.userService.createSeller(sellerObject);
    return resualt;
  }
}
