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
  public findById(id: number): IProducts[] {
    const result: IProducts[] = this.products.map((el) => {
      if (id === el.id) {
        return el;
      }
    });
    return result;
  }
}
