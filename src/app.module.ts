// npm install @nestjs/typeorm typeorm pg bcrypt @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt class-validator class-transformer
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_NAME', 'library'),
        autoLoadEntities: true,
        synchronize: true, // dev only
      }),
      inject: [ConfigService],
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
