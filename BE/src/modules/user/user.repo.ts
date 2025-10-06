import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "src/common/base/base.repository";
import { Users } from "src/database/entities/Users";
import { Repository } from "typeorm";

@Injectable()

export class UserRepository extends BaseRepository<Users> {
    constructor(@InjectRepository(Users) private readonly userRepo: Repository<Users>) {
        super(userRepo);
    }

    async uploadProfile(userId: number, avatarPath: string | null, body: any) {
        const updateData = avatarPath ? { avatar: avatarPath, ...body } : { ...body };
        await this.userRepo.update(userId, updateData);
        return this.userRepo.findOne({ where: { id: userId } });
    }
}