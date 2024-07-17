import { Injectable } from '@nestjs/common';
import { IProducts } from './interfaces/product.interface';

@Injectable()
export class AppService {
  private readonly products: IProducts[] = [];
  public create(product: IProducts): void {
    this.products.push(product);
  }
  public findAll(): IProducts[] {
    return this.products;
  }
}
