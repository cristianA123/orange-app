import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePeopleDto } from './dto/create-people.dto';
// import { UpdatePeopleDto } from './dto/update-incident.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
// import { v4 as uuidv4 } from 'uuid';
// import { randomUUID } from 'crypto';
import {
  Incident,
  // IncidentStatus,
  Institute,
  User,
  People,
  Department,
  Province,
  District,
  Nationality,
  MaritalStatus,
  Origin,
  PensionSystem,
  LicenseA,
  LicenseB,
  EducationLevel,
  BloodType,
  EmergencyContactType,
  Child,
} from 'src/typeorm/entities';
import { successResponse } from 'src/common/response/response.util';
import { RpcException } from '@nestjs/microservices';
import { UpdatePeopleDto } from './dto/update-people.dto';
import { Cargo } from 'src/typeorm/entities/Cargo';

@Injectable()
export class PeopleManagementService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Institute)
    private instituteRepository: Repository<Institute>,
    @InjectRepository(Incident)
    private incidentRepository: Repository<Incident>,
    @InjectRepository(People)
    private peopleRepository: Repository<People>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
    @InjectRepository(District)
    private districtRepository: Repository<District>,
    @InjectRepository(Nationality)
    private nationalityRepository: Repository<Nationality>,
    @InjectRepository(MaritalStatus)
    private maritalStatusRepository: Repository<MaritalStatus>,
    @InjectRepository(Origin)
    private originRepository: Repository<Origin>,
    @InjectRepository(PensionSystem)
    private pensionSystemRepository: Repository<PensionSystem>,
    @InjectRepository(LicenseA)
    private licenseARepository: Repository<LicenseA>,
    @InjectRepository(LicenseB)
    private licenseBRepository: Repository<LicenseB>,
    @InjectRepository(EducationLevel)
    private educationLevelRepository: Repository<EducationLevel>,
    @InjectRepository(BloodType)
    private bloodTypeRepository: Repository<BloodType>,
    @InjectRepository(EmergencyContactType)
    private emergencyContactTypeRepository: Repository<EmergencyContactType>,
    @InjectRepository(Child)
    private childRepository: Repository<Child>,
    @InjectRepository(Cargo)
    private cargoRepository: Repository<Cargo>,
  ) {
    console.log('✅ PeopleManagementService inicializado');
  }

  async create(createPeopleDto: CreatePeopleDto) {
    // Verificar si ya existe una persona con el mismo documento
    const existingPeople = await this.peopleRepository.findOne({
      where: {
        document: createPeopleDto.document,
      },
    });

    if (existingPeople) {
      throw new RpcException({
        message: `Ya existe una persona con el documento ${createPeopleDto.document}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    // Buscar y validar todas las entidades relacionadas
    const relatedEntities =
      await this.validateAndFindRelatedEntities(createPeopleDto);

    // Crear la entidad People con todas las relaciones
    const newPeopleEntity = this.peopleRepository.create({
      ...createPeopleDto,
      // Relaciones ManyToOne
      ubigeo: relatedEntities.ubigeo,
      nationality: relatedEntities.nationality,
      department: relatedEntities.department,
      province: relatedEntities.province,
      district: relatedEntities.district,
      birthplaceDepartment: relatedEntities.birthplaceDepartment,
      maritalStatus: relatedEntities.maritalStatus,
      pensionSystem: relatedEntities.pensionSystem,
      bloodType: relatedEntities.bloodType,
      emergencyContactType: relatedEntities.emergencyContactType,
      origin: relatedEntities.origin,
      educationLevel: relatedEntities.educationLevel,
      institution: relatedEntities.institution,
      // Licencias ManyToMany
      licensesA: relatedEntities.licensesA,
      licensesB: relatedEntities.licensesB,
      // Relación cargo
      cargo: relatedEntities.cargo,
    });

    // Guardar la entidad con todas sus relaciones
    const savedPeople = await this.peopleRepository.save(newPeopleEntity);

    // Hijos (Children) - crear y asociar si vienen en el DTO
    if (createPeopleDto.children && createPeopleDto.children.length > 0) {
      createPeopleDto.children.map((childDto) =>
        this.childRepository.create({
          ...childDto,
          parent: savedPeople, // aquí ya tiene ID
        }),
      );
      // await this.childRepository.save(children);
    }

    // Cargar las relaciones para la respuesta
    const peopleWithRelations = await this.peopleRepository.findOne({
      where: { id: savedPeople.id },
      relations: [
        'ubigeo',
        'nationality',
        'department',
        'province',
        'district',
        'birthplaceDepartment',
        'maritalStatus',
        'pensionSystem',
        'bloodType',
        'emergencyContactType',
        'origin',
        'educationLevel',
        'licensesA',
        'licensesB',
        'children',
        'institution',
        // Relación cargo
        'cargo',
      ],
    });

    return successResponse(peopleWithRelations, 'Persona creada exitosamente');
  }

  private async validateAndFindRelatedEntities(dto: CreatePeopleDto) {
    const entities: any = {};

    // Ubigeo (Distrito) para dirección
    if (dto.ubigeoId) {
      entities.ubigeo = await this.districtRepository.findOne({
        where: { disID: dto.ubigeoId },
      });
      if (!entities.ubigeo) {
        throw new RpcException({
          message: `Ubigeo con ID ${dto.ubigeoId} no encontrado`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }

    // Nacionalidad
    if (dto.nationalityId) {
      entities.nationality = await this.nationalityRepository.findOne({
        where: { id: dto.nationalityId },
      });
      if (!entities.nationality) {
        throw new RpcException({
          message: `Nacionalidad con ID ${dto.nationalityId} no encontrada`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }

    // Departamento (solo departamento, no provincia/distrito)
    if (dto.departmentId) {
      entities.department = await this.departmentRepository.findOne({
        where: { depID: dto.departmentId },
      });
      if (!entities.department) {
        throw new RpcException({
          message: `Departamento con ID ${dto.departmentId} no encontrado`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }

    // Provincia
    if (dto.provinceId) {
      entities.province = await this.provinceRepository.findOne({
        where: { proID: dto.provinceId },
      });
      if (!entities.province) {
        throw new RpcException({
          message: `Provincia con ID ${dto.provinceId} no encontrada`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }

    // Distrito
    if (dto.districtId) {
      entities.district = await this.districtRepository.findOne({
        where: { disID: dto.districtId },
      });
      if (!entities.district) {
        throw new RpcException({
          message: `Distrito con ID ${dto.districtId} no encontrado`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }

    // Departamento de nacimiento
    if (dto.birthplaceDepartmentId) {
      entities.birthplaceDepartment = await this.departmentRepository.findOne({
        where: { depID: dto.birthplaceDepartmentId },
      });
      if (!entities.birthplaceDepartment) {
        throw new RpcException({
          message: `Departamento de nacimiento con ID ${dto.birthplaceDepartmentId} no encontrado`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }

    // Estado civil
    if (dto.maritalStatusId) {
      entities.maritalStatus = await this.maritalStatusRepository.findOne({
        where: { id: dto.maritalStatusId },
      });
      if (!entities.maritalStatus) {
        throw new RpcException({
          message: `Estado civil con ID ${dto.maritalStatusId} no encontrado`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }

    // Sistema de pensiones
    if (dto.pensionSystemId) {
      entities.pensionSystem = await this.pensionSystemRepository.findOne({
        where: { id: dto.pensionSystemId },
      });
      if (!entities.pensionSystem) {
        throw new RpcException({
          message: `Sistema de pensiones con ID ${dto.pensionSystemId} no encontrado`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }

    // Tipo de sangre
    if (dto.bloodTypeId) {
      entities.bloodType = await this.bloodTypeRepository.findOne({
        where: { id: dto.bloodTypeId },
      });
      if (!entities.bloodType) {
        throw new RpcException({
          message: `Tipo de sangre con ID ${dto.bloodTypeId} no encontrado`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }

    // Tipo de contacto de emergencia
    if (dto.emergencyContactTypeId) {
      entities.emergencyContactType =
        await this.emergencyContactTypeRepository.findOne({
          where: { id: dto.emergencyContactTypeId },
        });
      if (!entities.emergencyContactType) {
        throw new RpcException({
          message: `Tipo de contacto de emergencia con ID ${dto.emergencyContactTypeId} no encontrado`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }

    // Procedencia
    if (dto.originId) {
      entities.origin = await this.originRepository.findOne({
        where: { id: dto.originId },
      });
      if (!entities.origin) {
        throw new RpcException({
          message: `Procedencia con ID ${dto.originId} no encontrada`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }

    // Nivel educativo
    if (dto.educationLevelId) {
      entities.educationLevel = await this.educationLevelRepository.findOne({
        where: { id: dto.educationLevelId },
      });
      if (!entities.educationLevel) {
        throw new RpcException({
          message: `Nivel educativo con ID ${dto.educationLevelId} no encontrado`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }

    // Institución
    if (dto.instituteId) {
      entities.institution = await this.instituteRepository.findOne({
        where: { id: dto.instituteId },
      });
      if (!entities.institution) {
        throw new RpcException({
          message: `Institución con ID ${dto.instituteId} no encontrada`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }

    // Licencias A
    if (dto.licensesAIds && dto.licensesAIds.length > 0) {
      entities.licensesA = await this.licenseARepository.find({
        where: { id: In(dto.licensesAIds) },
      });
      if (entities.licensesA.length !== dto.licensesAIds.length) {
        throw new RpcException({
          message: 'Algunas licencias A no fueron encontradas',
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }

    // Licencias B
    if (dto.licensesBIds && dto.licensesBIds.length > 0) {
      entities.licensesB = await this.licenseBRepository.find({
        where: { id: In(dto.licensesBIds) },
      });
      if (entities.licensesB.length !== dto.licensesBIds.length) {
        throw new RpcException({
          message: 'Algunas licencias B no fueron encontradas',
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }

    // Cargo
    if (dto.cargoId) {
      entities.cargo = await this.cargoRepository.findOne({
        where: { id: dto.cargoId },
      });
      if (!entities.cargo) {
        throw new RpcException({
          message: `Cargo con ID ${dto.cargoId} no encontrado`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }

    return entities;
  }

  async getPeopleFormData() {
    try {
      const [
        departments,
        nationalities,
        maritalStatuses,
        pensionSystems,
        bloodTypes,
        emergencyContactTypes,
        origins,
        educationLevels,
        licensesA,
        licensesB,
        cargoes,
      ] = await Promise.all([
        this.departmentRepository.find({
          order: { depID: 'ASC' },
        }),
        this.nationalityRepository.find({
          order: { name: 'ASC' },
          select: ['id', 'name'],
        }),
        this.maritalStatusRepository.find({
          order: { name: 'ASC' },
          select: ['id', 'name'],
        }),
        this.pensionSystemRepository.find({
          order: { name: 'ASC' },
          select: ['id', 'name'],
        }),
        this.bloodTypeRepository.find({
          order: { name: 'ASC' },
          select: ['id', 'name'],
        }),
        this.emergencyContactTypeRepository.find({
          order: { name: 'ASC' },
          select: ['id', 'name'],
        }),
        this.originRepository.find({
          order: { name: 'ASC' },
          select: ['id', 'name'],
        }),
        this.educationLevelRepository.find({
          order: { name: 'ASC' },
          select: ['id', 'name'],
        }),
        this.licenseARepository.find({
          order: { name: 'ASC' },
          select: ['id', 'name'],
        }),
        this.licenseBRepository.find({
          order: { name: 'ASC' },
          select: ['id', 'name'],
        }),
        this.cargoRepository.find({
          order: { name: 'ASC' },
          select: ['id', 'name', 'source'],
        }),
      ]);

      return {
        success: true,
        data: {
          departments,
          nationalities,
          maritalStatuses,
          pensionSystems,
          bloodTypes,
          emergencyContactTypes,
          origins,
          educationLevels,
          licensesA,
          licensesB,
          cargoes,
        },
      };
    } catch (error) {
      throw new RpcException({
        message: 'Error al obtener datos del formulario',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getProvincesByDepartment(departmentId: string) {
    try {
      const provinces = await this.provinceRepository.find({
        where: { proDep: departmentId },
        order: { proNombre: 'ASC' },
      });

      return {
        success: true,
        data: provinces,
      };
    } catch (error) {
      throw new RpcException({
        message: 'Error al obtener provincias por departamento',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getDistrictsByProvince(provinceId: string) {
    try {
      const districts = await this.districtRepository.find({
        where: { disProv: provinceId },
        order: { disNombre: 'ASC' },
      });

      return {
        success: true,
        data: districts,
      };
    } catch (error) {
      throw new RpcException({
        message: 'Error al obtener distritos por provincia',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findAllIncidentByInstituteId(id: string) {
    console.log(id);
    const existInstitute = await this.instituteRepository.findOneBy({
      id,
    });
    if (!existInstitute) {
      throw new RpcException({
        message: `No existe el instituto`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const incidents = await this.incidentRepository.find({
      where: {
        institute: {
          id,
        },
      },
    });

    if (!incidents) {
      throw new RpcException({
        message: `No se encontraron incidentes`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
    return successResponse(incidents, 'Incidentes encontrados');
  }

  async getIncidentById(id: string) {
    // quiero agregar los datos del officer y solo sus id y name y documentType y documentNumber
    const incident = await this.incidentRepository.findOne({
      where: {
        id,
      },
      relations: ['officer'],
    });
    if (!incident) {
      throw new RpcException({
        message: `No se encontraron incidentes`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
    delete incident.officer.password;
    delete incident.officer.rol;
    delete incident.officer.institute_id;
    delete incident.officer.email;
    delete incident.officer.createdAt;
    delete incident.officer.updatedAt;
    delete incident.officer.deletedAt;
    delete incident.officer.status;
    return successResponse(incident, 'Incidente encontrado');
  }

  async findAllPeopleByInstituteId(instituteId: string) {
    try {
      const people = await this.peopleRepository.find({
        where: {
          institution: {
            id: instituteId,
          },
        },
        relations: ['cargo'],
        select: [
          'id',
          'names',
          'cellphone',
          'email',
          'documentType',
          'document',
          'paternalSurname',
          'maternalSurname',
          'createdAt',
          'updatedAt',
          'area',
          'jobTitle',
        ],
        order: { createdAt: 'DESC' },
      });

      return successResponse(people, 'Personas recuperadas exitosamente');
    } catch (error) {
      throw new RpcException({
        message: 'Error al obtener personas',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getPeopleById(id: string) {
    try {
      const person = await this.peopleRepository.findOne({
        where: { id },
        relations: [
          'ubigeo',
          'nationality',
          'department',
          'province',
          'district',
          'birthplaceDepartment',
          'maritalStatus',
          'pensionSystem',
          'bloodType',
          'emergencyContactType',
          'origin',
          'educationLevel',
          'licensesA',
          'licensesB',
          'children',
          'institution',
          // Relación cargo
          'cargo',
        ],
      });

      if (!person) {
        throw new RpcException({
          message: `Persona con ID ${id} no encontrada`,
          status: HttpStatus.NOT_FOUND,
        });
      }

      return successResponse(person, 'Persona recuperada exitosamente');
    } catch (error) {
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        message: 'Error al obtener persona por ID',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async update(id: string, updatePeopleDto: UpdatePeopleDto) {
    try {
      const person = await this.peopleRepository.findOne({
        where: { id },
        relations: [
          'ubigeo',
          'nationality',
          'department',
          'province',
          'district',
          'birthplaceDepartment',
          'maritalStatus',
          'pensionSystem',
          'bloodType',
          'emergencyContactType',
          'origin',
          'educationLevel',
          'licensesA',
          'licensesB',
          'children',
        ],
      });

      if (!person) {
        throw new RpcException({
          message: `Persona con ID ${id} no encontrada`,
          status: HttpStatus.NOT_FOUND,
        });
      }

      // Resolver relaciones sólo si se pasan IDs
      const related = await this.validateAndFindRelatedEntities(
        updatePeopleDto as CreatePeopleDto,
      );

      const directFields: Partial<People> = {
        paternalSurname: updatePeopleDto.paternalSurname,
        maternalSurname: updatePeopleDto.maternalSurname,
        names: updatePeopleDto.names,
        cellphone: updatePeopleDto.cellphone,
        email: updatePeopleDto.email,
        address: updatePeopleDto.address,
        landline: updatePeopleDto.landline,
        documentType: updatePeopleDto.documentType,
        document: updatePeopleDto.document,
        gender: updatePeopleDto.gender,
        birthDate: updatePeopleDto.birthDate,
        age: updatePeopleDto.age,
        domicile: updatePeopleDto.domicile,
        healthInsurance: updatePeopleDto.healthInsurance,
        insuranceType: updatePeopleDto.insuranceType,
        sctr: updatePeopleDto.sctr,
        isDonor: updatePeopleDto.isDonor,
        tattoos: updatePeopleDto.tattoos,
        militaryService: updatePeopleDto.militaryService,
        weaponsLicense: updatePeopleDto.weaponsLicense,
        differentAbility: updatePeopleDto.differentAbility,
        height: updatePeopleDto.height,
        weight: updatePeopleDto.weight,
        childrenNumber: updatePeopleDto.childrenNumber,
        spouse: updatePeopleDto.spouse,
        emergencyName: updatePeopleDto.emergencyName,
        emergencyEmail: updatePeopleDto.emergencyEmail,
        emergencyPhone: updatePeopleDto.emergencyPhone,
        lastUserModified: updatePeopleDto.lastUserModified,
        lastModificationDate: new Date(),
        // Relación cargo
        cargo: related.cargo,
      };

      Object.keys(directFields).forEach((key) => {
        const k = key as keyof People;
        if (directFields[k] === undefined) delete (directFields as any)[k];
      });
      Object.assign(person, directFields);

      if (updatePeopleDto.ubigeoId) person.ubigeo = related.ubigeo;
      if (updatePeopleDto.nationalityId)
        person.nationality = related.nationality;
      if (updatePeopleDto.departmentId) person.department = related.department;
      if (updatePeopleDto.provinceId) person.province = related.province;
      if (updatePeopleDto.districtId) person.district = related.district;
      if (updatePeopleDto.birthplaceDepartmentId)
        person.birthplaceDepartment = related.birthplaceDepartment;
      if (updatePeopleDto.maritalStatusId)
        person.maritalStatus = related.maritalStatus;
      if (updatePeopleDto.pensionSystemId)
        person.pensionSystem = related.pensionSystem;
      if (updatePeopleDto.bloodTypeId) person.bloodType = related.bloodType;
      if (updatePeopleDto.emergencyContactTypeId)
        person.emergencyContactType = related.emergencyContactType;
      if (updatePeopleDto.originId) person.origin = related.origin;
      if (updatePeopleDto.educationLevelId)
        person.educationLevel = related.educationLevel;
      if (updatePeopleDto.instituteId) person.institution = related.institution;

      if (updatePeopleDto.licensesAIds)
        person.licensesA = related.licensesA ?? [];
      if (updatePeopleDto.licensesBIds)
        person.licensesB = related.licensesB ?? [];

      // Reemplazar hijos si se proporcionan
      if (updatePeopleDto.children) {
        const existingChildren = await this.childRepository.find({
          where: { parent: { id } },
        });
        if (existingChildren.length) {
          await this.childRepository.remove(existingChildren);
        }
        person.children = updatePeopleDto.children.map((childDto) =>
          this.childRepository.create({ ...childDto, parent: person }),
        );
      }
      // Cargo
      if (updatePeopleDto.cargoId) {
        person.cargo = related.cargo;
      }

      // eliminar el dato del parent de cada children
      person.children.forEach((child) => {
        child.parent = null;
      });

      const saved = await this.peopleRepository.save(person);
      return successResponse(saved, 'Persona actualizada exitosamente');
    } catch (error) {
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        message: 'Error al actualizar persona',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findAllPeopleByInstituteIdToSummary(
    instituteId: string,
    source: string,
  ) {
    try {
      source = source.toUpperCase();
      const people = await this.peopleRepository
        .createQueryBuilder('people')
        .leftJoinAndSelect('people.cargo', 'cargo')
        .where('people.institution_id = :instituteId', { instituteId })
        .andWhere('cargo.source = :source', { source })
        .select([
          'people.id',
          'people.names',
          'people.paternalSurname',
          'people.maternalSurname',
          'people.document',
        ])
        .getMany();

      return successResponse(people, 'Personas encontradas');
    } catch (error) {
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        message: 'Error al obtener personas',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findAllPeopleSecurityByInstituteId(instituteId: string) {
    try {
      const people = await this.peopleRepository.find({
        where: {
          institution: {
            id: instituteId,
          },
          area: In(['SERENAZGO', 'SECURITY', 'Security', 'security']),
        },
      });
      return successResponse(people, 'Personas encontradas');
    } catch (error) {
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        message: 'Error al obtener personas',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // async remove(id: string) {
  //   const incident = await this.incidentRepository.update(id, {
  //     status: IncidentStatus.DELETED,
  //     deletedAt: new Date(),
  //   });
  //   if (!incident) {
  //     throw new RpcException({
  //       message: `No se encontraron incidentes`,
  //       status: HttpStatus.BAD_REQUEST,
  //     });
  //   }
  //   return successResponse(incident, 'Incidente eliminado');
  // }
}
