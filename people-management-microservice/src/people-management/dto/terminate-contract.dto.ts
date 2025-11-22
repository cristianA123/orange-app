export class TerminateContractDto {
  contractId: string;
  endDate: Date;
  reasonForTermination: string;
  workedTime?: string;
  terminationDocFileId?: string;
}
