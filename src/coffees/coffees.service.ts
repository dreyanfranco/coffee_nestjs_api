import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectModel(Coffee.name) private readonly coffeeModel: Model<Coffee>, // @InjectConnection() private readonly connection: Connection, // @InjectModel(Event.name) private readonly eventModel: Model<Event>,
  ) {}

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.coffeeModel.find().skip(offset).limit(limit).exec();
  }

  async findOne(id: string) {
    const coffee = await this.coffeeModel.findById(id);
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  create(createCoffeeDto: CreateCoffeeDto) {
    const coffee = new this.coffeeModel(createCoffeeDto);
    return coffee.save();
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const existingCoffee = await this.coffeeModel.findByIdAndUpdate(
      id,
      updateCoffeeDto,
      { new: true },
    );

    // if (existingCoffee) {
    //   throw new NotFoundException(`Coffee #${id} not found`);
    // }
    return existingCoffee;
  }

  async remove(id: string) {
    const coffee = await this.coffeeModel.findByIdAndDelete(id);
    return coffee;
  }

  // async recommendCoffee(coffee: Coffee) {
  //   const session = await this.connection.startSession();
  //   session.startTransaction();

  //   try {
  //     coffee.recommendations++;

  //     const recommendEvent = new this.eventModel({
  //       name: 'recommend_coffee',
  //       type: 'coffee',
  //       payload: { coffeeId: coffee.id },
  //     });
  //     await recommendEvent.save({ session });
  //     await coffee.save({ session });

  //     await session.commitTransaction();
  //   } catch (err) {
  //     await session.abortTransaction();
  //   } finally {
  //     session.endSession();
  //   }
  // }
}
