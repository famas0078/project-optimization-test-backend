import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { AuthModule } from './modules/auth/auth.module';
import { ActivesModule } from './modules/actives/actives.module';
import { DataModule } from './modules/data/data.module';
import { CtfModule } from './modules/ctf/ctf.module';
import { DataLoaderModule } from './modules/data-loader/data-loader.module';
import { AdminModule } from './modules/admin/admin.module';
import { MailModule } from './modules/mail/mail.module';
import { TepModule } from './modules/tep/tep.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModule,
    AuthModule,
    AdminModule,
    MailModule,
    DataLoaderModule,
    ActivesModule,
    DataModule,
    CtfModule,
    TepModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
