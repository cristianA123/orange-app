export class CreateContractDto {
  peopleId: string;
  contractTypeId: string;
  areaId: string;
  cargoId: string;
  startDate: Date;
  endDate?: Date;
  cvFileId?: string;
  tdrFileId?: string;
  contractFileId?: string;
  workedTime?: string;
  isActive?: boolean;
}
