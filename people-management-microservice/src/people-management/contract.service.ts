import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import {
  Contract,
  People,
  ContractType,
  Area,
  Cargo,
  ContractFile,
  ContractFileType,
} from 'src/typeorm/entities';
import { CreateContractDto } from './dto/create-contract.dto';
import { TerminateContractDto } from './dto/terminate-contract.dto';
import { successResponse } from 'src/common/response/response.util';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,
    @InjectRepository(People)
    private peopleRepository: Repository<People>,
    @InjectRepository(ContractType)
    private contractTypeRepository: Repository<ContractType>,
    @InjectRepository(Area)
    private areaRepository: Repository<Area>,
    @InjectRepository(Cargo)
    private cargoRepository: Repository<Cargo>,
    @InjectRepository(ContractFile)
    private contractFileRepository: Repository<ContractFile>,
  ) { }

  async create(createContractDto: CreateContractDto) {
    const {
      peopleId,
      contractTypeId,
      areaId,
      cargoId,
      startDate,
      endDate,
      cvFileId,
      tdrFileId,
      contractFileId,
      workedTime,
      isActive,
    } = createContractDto;

    if (!peopleId) {
      throw new RpcException({
        message: 'peopleId is required to create a contract',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const people = await this.peopleRepository.findOne({
      where: { id: peopleId },
    });
    if (!people)
      throw new RpcException({
        message: 'Person not found',
        status: HttpStatus.NOT_FOUND,
      });

    const contractType = await this.contractTypeRepository.findOne({
      where: { id: createContractDto.contractTypeId },
    });
    if (!contractType)
      throw new RpcException({
        message: 'Contract Type not found',
        status: HttpStatus.NOT_FOUND,
      });

    const area = await this.areaRepository.findOne({
      where: { id: createContractDto.areaId },
    });
    if (!area)
      throw new RpcException({
        message: 'Area not found',
        status: HttpStatus.NOT_FOUND,
      });

    const cargo = await this.cargoRepository.findOne({ where: { id: cargoId } });
    if (!cargo)
      throw new RpcException({
        message: 'Cargo not found',
        status: HttpStatus.NOT_FOUND,
      });

    // Deactivate previous contracts
    const previousContracts = await this.contractRepository.find({
      where: { people: { id: peopleId }, isActive: true },
    });

    if (previousContracts.length > 0) {
      for (const contract of previousContracts) {
        contract.isActive = false;
        contract.endDate = new Date();
        await this.contractRepository.save(contract);
      }
    }

    const files: ContractFile[] = [];

    if (cvFileId) {
      const cvFile = await this.contractFileRepository.findOne({ where: { id: cvFileId } });
      if (cvFile) {
        cvFile.fileType = ContractFileType.CV;
        files.push(cvFile);
      }
    }

    if (tdrFileId) {
      const tdrFile = await this.contractFileRepository.findOne({ where: { id: tdrFileId } });
      if (tdrFile) {
        tdrFile.fileType = ContractFileType.TDR;
        files.push(tdrFile);
      }
    }

    if (contractFileId) {
      const cFile = await this.contractFileRepository.findOne({ where: { id: contractFileId } });
      if (cFile) {
        cFile.fileType = ContractFileType.CONTRACT;
        files.push(cFile);
      }
    }

    const newContract = this.contractRepository.create({
      // Set relation by id to guarantee FK assignment
      people,
      contractType,
      area,
      cargo,
      startDate,
      endDate,
      workedTime,
      isActive: isActive !== undefined ? isActive : true,
      files,
    });

    console.log('Creating contract with peopleId:', peopleId);
    console.log('New Contract Object (people.id):', newContract.people?.id);

    const savedContract = await this.contractRepository.save(newContract);
    console.log('Saved Contract people.id:', savedContract.people?.id);

    // Update People status and details
    people.status = 'ACTIVE';
    people.jobTitle = cargo.name; // Assuming jobTitle maps to cargo name
    people.area = area.id; // Store ID instead of name
    people.cargo = cargo; // Set relation
    await this.peopleRepository.save(people);

    return successResponse(savedContract, 'Contract created successfully');
  }

  async terminate(terminateContractDto: TerminateContractDto) {
    const { contractId, endDate, reasonForTermination, terminationDocFileId } =
      terminateContractDto;

    const contract = await this.contractRepository.findOne({
      where: { id: contractId },
      relations: ['people', 'files'],
    });

    if (!contract)
      throw new RpcException({
        message: 'Contract not found',
        status: HttpStatus.NOT_FOUND,
      });

    contract.endDate = endDate;
    contract.reasonForTermination = reasonForTermination;

    // Calculate worked time in days
    const startDate = new Date(contract.startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    contract.workedTime = `${diffDays} días`;

    contract.isActive = false;

    if (terminationDocFileId) {
      const termFile = await this.contractFileRepository.findOne({ where: { id: terminationDocFileId } });
      if (termFile) {
        termFile.fileType = ContractFileType.TERMINATION;
        // termFile.contract = contract; // Will be saved via cascade or manual save
        if (!contract.files) contract.files = [];
        contract.files.push(termFile);
      }
    }

    const savedContract = await this.contractRepository.save(contract);

    // Update People status
    if (contract.people) {
      contract.people.status = 'INACTIVE';
      await this.peopleRepository.save(contract.people);
    }

    return successResponse(savedContract, 'Contract terminated successfully');
  }

  async reentry(createContractDto: CreateContractDto) {
    // Reentry is essentially creating a new contract but maybe with specific status logic
    const result = await this.create(createContractDto);

    // If we need to explicitly set status to REENTRY (if 'ACTIVE' is not enough)
    // But usually Reentry means they become Active again.
    // If the requirement is to show 'REENTRY' status:
    const savedContract = result.data;
    const people = await this.peopleRepository.findOne({ where: { id: createContractDto.peopleId } });
    if (people) {
      people.status = 'REENTRY'; // Or keep it ACTIVE? User requested REENTRY status.
      await this.peopleRepository.save(people);
    }

    return result;
  }

  async findOne(id: string) {
    const contract = await this.contractRepository.findOne({
      where: { id },
      relations: ['people', 'contractType', 'area', 'cargo', 'files'],
    });
    if (!contract)
      throw new RpcException({
        message: 'Contract not found',
        status: HttpStatus.NOT_FOUND,
      });
    return successResponse(contract, 'Contract retrieved successfully');
  }

  async findAllByPeopleId(peopleId: string) {
    console.log('Finding contracts for peopleId:', peopleId);
    const contracts = await this.contractRepository
      .createQueryBuilder('contract')
      .leftJoinAndSelect('contract.people', 'people')
      .leftJoinAndSelect('contract.contractType', 'contractType')
      .leftJoinAndSelect('contract.area', 'area')
      .leftJoinAndSelect('contract.cargo', 'cargo')
      .leftJoinAndSelect('contract.files', 'files')
      .where('people.id = :peopleId', { peopleId })
      .orderBy('contract.startDate', 'DESC')
      .getMany();

    console.log('Found contracts:', contracts);
    return successResponse(contracts, 'Contracts retrieved successfully');
  }
}
