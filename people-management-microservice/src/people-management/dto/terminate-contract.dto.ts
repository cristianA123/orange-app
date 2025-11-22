export class TerminateContractDto {
  contractId: string;
  endDate: Date;
  reasonForTermination: string;
  terminationDocFileId?: string;
}
