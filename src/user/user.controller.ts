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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateSellerDTO } from './dto/create-seller.dto';
import { AuthGuard } from 'src/gaurds/auth.guard';
import { PermissionGuard } from 'src/gaurds/permission.guard';
import { RequirePermissions } from 'src/decorators/require-permissions.decorator';
import { Action } from 'src/enums/action.enum';
import { Subject } from 'src/enums/subject.enum';
import { Permissions } from 'src/decorators/permissions.decorator';
import { Permission } from 'src/ability/casl-ability.factory/casl-ability.factory';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('add')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @Get('list')
  @UseGuards(AuthGuard, PermissionGuard)
  @RequirePermissions({ action: Action.Read, subject: Subject.User })
  findAll(@Permissions() permissions: Permission[]) {
    console.log(permissions);
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  @UseGuards(AuthGuard)
  @Post('create-seller')
  createSeller(
    //@User('permission') permission,
    @Request() req,
    @Body() sellerObject: CreateSellerDTO,
  ) {
    console.log(req);

    const resualt = this.userService.createSeller(sellerObject);
    return resualt;
  }
}
