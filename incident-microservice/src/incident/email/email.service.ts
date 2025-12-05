import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

export interface IEmailPayload {
  id?: string;
  email: string;
  type: string;
  subType: string;
  description: string;
  address: string;
  locationLat: number;
  locationLng: number;
  formType: string;
  isRelevant: boolean;
  officerName?: string;
  phoneNumber?: string;
  senderName?: string;
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
          address: payload.address,
          senderName: payload.senderName || 'N/A',
          phoneNumber: payload.phoneNumber || 'N/A',
          officerName: payload.officerName || 'N/A',
          formType: payload.formType,
          isRelevant: payload.isRelevant ? 'Sí' : 'No',
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
