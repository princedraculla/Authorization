import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ProductDTO } from './dto/product.dto';
import { IProducts } from './interfaces/product.interface';
import { RolesGuard } from './gaurds/auth.gaurd';
import { Roles } from './decorators/role.decorator';
import { Role as UserRoles } from './enums/role.enum';

@Controller('products')
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Post('add')
  @Roles(UserRoles.Admin)
  @UseGuards(RolesGuard)
  async create(
    @Body() createProductdto: ProductDTO,
    @Body('roles') roles: UserRoles,
  ) {
    if (roles === UserRoles.Admin) {
      this.appService.create(createProductdto);
      throw new HttpException('Created', HttpStatus.CREATED);
    } else {
      throw new HttpException('forbidden', HttpStatus.FORBIDDEN);
    }
  }

  @Get('all')
  async findAll(): Promise<IProducts[]> {
    return this.appService.findAll();
  }

  @Get('one')
  async findOne(@Body('id') id: number) {
    return this.appService.findById(id);
  }
}
