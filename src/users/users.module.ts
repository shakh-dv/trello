import {forwardRef, Module} from '@nestjs/common';
import {UsersService} from './users.service';
import {UsersController} from './users.controller';
import {AuthModule} from '../auth/auth.module';
import {CommentsModule} from '../comments/comments.module';

@Module({
  imports: [forwardRef(() => AuthModule), CommentsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
