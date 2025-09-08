export class CreateIncidentDto {
  userId: string;
  instituteId: string;
  type: string;
  subType: string;
  description: string;
  address: string;
  locationLat: number;
  locationLng: number;
  formType: string;
  officerName?: string;
  phoneNumber?: string;
  senderName?: string;
  cameraNumber?: string;
  documentNumber?: string;
  attentionDate?: Date;
  closingDate?: Date;
  isRelevant: boolean;
  status?: number;
  officerId: string;
}
