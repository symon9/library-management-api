import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { MembersModule } from './members/members.module';
import { BorrowsModule } from './borrows/borrows.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    BooksModule,
    MembersModule,
    BorrowsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
