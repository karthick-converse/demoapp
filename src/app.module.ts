import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entites/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'dpg-cvdbkit2ng1s73dsea60-a',
      port: 5432,
      username: 'demo_r0hc_user',
      password: 'CjskokzEkBnnsU7V0PeFtl3HCED9Cb4L',
      database: 'demo_r0hc',
      entities: [User],
      synchronize: true,
      
    }),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
