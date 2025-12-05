import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

export interface IEmailPayload {
  id?: string;
  email: string;
  type: string;
  subType: string;
  description: string;
  formType: string;
  phoneNumber?: string;
  senderName?: string;
  priority: boolean;
  zone?: string;
}

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) { }

  async sendIncidentNotification(payload: IEmailPayload) {
    try {
      await this.mailerService.sendMail({
        to: payload.email,
        subject: `Nueva Incidencia Reportada: ${payload.type} - ${payload.subType}`,
        template: './incident-notification',
        context: {
          type: payload.type,
          subType: payload.subType,
          description: payload.description,
          formType: payload.formType,
          senderName: payload.senderName || 'N/A',
          phoneNumber: payload.phoneNumber || 'N/A',
          priority: payload.priority ? 'Alta' : 'Normal',
          zone: payload.zone || 'N/A',
          date: new Date().toLocaleString(),
          detailUrl: payload.id ? `https://atuq-system.netlify.app/#/private-security/form/${payload.id}` : null,
        },
      });
      console.log('Email sent successfully to:', payload.email);
      return { success: true, message: 'Email enviado correctamente' };
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
