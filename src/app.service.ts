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
  public findById(id: number): Array<IProducts | string> {
    const result: Array<IProducts | string> = this.products.map((el) => {
      if (!(id === el.id)) {
        return 'this product not exist';
      } else {
        return el as IProducts;
      }
    });
    return result;
  }
}
