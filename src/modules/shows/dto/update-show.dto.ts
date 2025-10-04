import { PartialType } from '@nestjs/mapped-types';
import { CreateShowWithTicketsDto } from './create-show.dto';

export class UpdateShowDto extends PartialType(CreateShowWithTicketsDto) {}
