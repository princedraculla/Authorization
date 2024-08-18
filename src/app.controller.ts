import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { IProducts } from './interfaces/product.interface';

@Controller('products')
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Post('add')
  async create(@Body() createProductdto: any) {
    this.appService.create(createProductdto);
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
