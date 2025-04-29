import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Entry } from 'src/entities/entry.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Entry)
    private entryRepository: Repository<Entry>,
  ) {}

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findUserById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id: id } });
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async getAllImageUrls(): Promise<{ entryId: number; imageUrl: string }[]> {
    const entries = await this.entryRepository.find({
      where: {
        image_url: Not(IsNull()),
      },
      select: ['id', 'image_url'],
      order: { id: 'DESC' },
    });

    return entries.map((entry) => ({
      entryId: entry.id,
      imageUrl: entry.image_url,
    }));
  }
}
