import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    private readonly productService: ProductsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

  ){}
  async runSeed(){
    await this.deleteTable()
    const adminUser = await this.insertUser()
    await this.insertNewProduct(adminUser)
    return 'seed executed'
  }

  private async deleteTable(){

    await this.productService.deleteAllProduct();

    const queryBuilder = this.userRepository.createQueryBuilder()
    await queryBuilder
      .delete()
      .where({})
      .execute();
  }

  private async insertUser(){
    const seedUser = initialData.users;
    const users: User[] = [];
    seedUser.forEach(user => {
      users.push(this.userRepository.create({...user, password: bcrypt.hashSync(user.password, 10)}));
    })

    await this.userRepository.save(users)
    return users[0]

  }

  private async insertNewProduct(user: User){
    await this.productService.deleteAllProduct();
    const products = initialData.products;
    const insertProm = []
    products.forEach(p => {
      insertProm.push( this.productService.create(p,user) )
    })
    await Promise.all(insertProm)
    return true
  }
}
