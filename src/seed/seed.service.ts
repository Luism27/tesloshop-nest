import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(
    private readonly productService: ProductsService,
  ){}
  async runSeed(){
    await this.insertNewProduct()
    return 'seed executed'
  }

  private async insertNewProduct(){
    await this.productService.deleteAllProduct();
    const products = initialData.products;
    const insertProm = []
    products.forEach(p => {
      insertProm.push( this.productService.create(p) )
    })
    await Promise.all(insertProm)
    return true
  }
}
