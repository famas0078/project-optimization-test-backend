import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { RegistrationUserInterface } from '../admin/interface/admin.interface';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendNewDataUserRegister(
    data: RegistrationUserInterface,
    organizationName: string,
  ) {
    await this.mailerService.sendMail({
      to: data.email,
      subject: 'регистрация СППР',
      template: './registrationUser',
      context: {
        email: data.email,
        password: data.password,
        organizationName: organizationName,
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName,
      },
    });

    this.logger.log('Письмо успешно отправлено');
  }
}
