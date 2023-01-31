import { ProductImage } from './product-image.entity';
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany, ManyToOne } from "typeorm";
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'products'
})
export class Product {

  @ApiProperty({
    example: '60b524b3-18e0-4d11-b5d8-15f85e249cd2',
    description: 'product Id',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 't-shirt teslo',
    description: 'product title',
    uniqueItems: true
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty({
    example: 0,
    description: 'product price',
  })
  @Column('float',{
    default: 0,
  })
  price:number;

  @ApiProperty({
    example: 'Occaecat sit ad pariatur nostrud nostrud ea ipsum quis aliqua exercitation duis.',
    description: 'product description',
    default: null,
  })
  @Column({
    type: 'text',
    nullable: true
  })
  description:string;

  @ApiProperty({
    example: 't_shirt_teslo',
    description: 'product slug for SEO',
    uniqueItems: true
  })
  @Column('text',{
    unique: true,
  })
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'product stock',
    default: 0,
  })
  @Column('integer',{
    default:0,
  })
  stock:number;

  @ApiProperty({
    example: ['M', 'XL'],
    description: 'product size',
  })
  @Column('text',{
    array: true,
  })
  sizes: string[];

  @ApiProperty({
    example: 'Women',
    description: 'product gender',
  })
  @Column('text')
  gender: string;

  // tags
  @ApiProperty()
  @Column('text',{
    array: true,
    default: [],
  })
  tags: string[];

  @ApiProperty()
  // images
  @OneToMany(
    () => ProductImage,
    (productImage) => productImage.product,
    { cascade: true, eager: true }
  )
  images?: ProductImage[];

  @ManyToOne(
    () => User,
    (user) => user.product,
    {eager: true}
  )
  user: User;

  //triggers
  @BeforeInsert()
  checkSlugInsert(){
    if(!this.slug){
      this.slug = this.title
    }
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(" ", "_")
      .replaceAll("'", "")
  }

  @BeforeUpdate()
  checkSlugUpdate(){
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(" ", "_")
      .replaceAll("'", "")
  }
}
