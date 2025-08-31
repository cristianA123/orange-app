import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from '../typeorm/entities/Incident';
import * as dayjs from 'dayjs';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Incident)
        private incidentRepository: Repository<Incident>,
    ) {}

    async getIncidents(instituteId: string) {
        let [byType, variation, relevant] = await Promise.all([
            this.incidentRepository
                .createQueryBuilder('incident')
                .select('incident.type', 'type')
                .addSelect('COUNT(*)', 'total')
                .where('incident.institute_id = :instituteId', { instituteId })
                .groupBy('incident.type')
                .getRawMany(),

            this.incidentRepository
                .createQueryBuilder('incident')
                .select("DATE_FORMAT(incident.attentionDate, '%Y-%m')", 'month')
                .addSelect('SUM(TIMESTAMPDIFF(HOUR, incident.attentionDate, incident.closingDate))', 'total')
                .where('incident.institute_id = :instituteId', { instituteId })
                .andWhere('incident.closingDate IS NOT NULL')
                .groupBy("DATE_FORMAT(incident.attentionDate, '%Y-%m')")
                .orderBy('month', 'ASC')
                .getRawMany(),

            this.incidentRepository
                .createQueryBuilder('incident')
                .select("DATE_FORMAT(incident.attentionDate, '%Y-%m')", 'month')
                .addSelect('COUNT(*)', 'total')
                .where('incident.institute_id = :instituteId', { instituteId })
                .andWhere('incident.isRelevant = true')
                .groupBy("DATE_FORMAT(incident.attentionDate, '%Y-%m')")
                .orderBy('month', 'ASC')
                .getRawMany(),
        ])


        byType = byType.map(item => ({
            label: item.type,
            count: Number(item.total),
        }));

        variation = variation.map(item => ({
            label: item.month,
            count: Number(item.total),
        }));

        relevant = relevant.map(item => ({
            label: item.month,
            count: Number(item.total),
        }));


        return { byType , variation, relevant }
    }

    async getKpis(instituteId: string) {

        const [totalIncidentsResult, variationResult, relevantResult] = await Promise.all([
             this.baseIncidentQuery(instituteId)
                .select('COUNT(*)', 'total')
                .getRawOne(),

            this.baseIncidentQuery(instituteId)
                .select('AVG(TIMESTAMPDIFF(HOUR, incident.attentionDate, incident.closingDate))', 'avg_hours')
                .andWhere('incident.closingDate IS NOT NULL')
                .getRawOne(),

            this.baseIncidentQuery(instituteId)
                .select('COUNT(*)', 'total')
                .andWhere('incident.isRelevant = true')
                .getRawOne(),
        ])

        return {
            total_incidents: Number(totalIncidentsResult?.total || 0),
            average_response_time: Number(variationResult?.avg_hours || 0),
            average_attention_time: 123,
            relevant_incidents: Number(relevantResult?.total || 0),
            health_video_surveillance_system: 95
        }
    }

    async getBettersWorks(instituteId: string) {
        const byOfficers = await this.baseIncidentQuery(instituteId)
            .select('users.name', 'name')
            .addSelect('users.rol', 'rol')
            .addSelect('COUNT(*)', 'total')
            .innerJoin('users', 'users', 'users.id = incident.user_id')
            .groupBy('users.id')
            .orderBy('total', 'DESC')
            .limit(10)
            .getRawMany();

        return byOfficers.map(item => ({
            name: item.name,
            count: parseInt(item.total, 10),
            role: item.rol
        }));
    }

    async getBetterWorks(instituteId: string) {
        const startOfLastMonth = dayjs().subtract(1, 'month').startOf('month').toDate();
        const endOfLastMonth = dayjs().subtract(1, 'month').endOf('month').toDate();

        const byOfficer = await this.baseIncidentQuery(instituteId)
            .select('users.name', 'name')
            .addSelect('COUNT(*)', 'total')
            .innerJoin('users', 'users', 'users.id = incident.user_id')
            .andWhere('incident.isRelevant = true')
            .andWhere('incident.created_at BETWEEN :start AND :end', {
                start: startOfLastMonth,
                end: endOfLastMonth,
            })
            .groupBy('users.id')
            .orderBy('total', 'DESC')
            .limit(1)
            .getRawOne();

        return { byOfficer };
    }

    private baseIncidentQuery(instituteId: string) {
        return this.incidentRepository
            .createQueryBuilder('incident')
            .where('incident.institute_id = :instituteId', { instituteId });
    }
}
