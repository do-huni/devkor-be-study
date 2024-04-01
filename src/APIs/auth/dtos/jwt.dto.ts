import { PickType } from '@nestjs/swagger';
import { User } from 'src/APIs/users/entities/user.entity';

export class JwtDto extends PickType(User, ['email', 'password', 'username']) {}
