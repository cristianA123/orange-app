import { Injectable, HttpStatus } from '@nestjs/common';
import { ChartConfiguration } from 'chart.js';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { RpcException } from '@nestjs/microservices';
import { Incident } from 'src/typeorm/entities';
import path from "node:path";

const fonts = {
    Roboto: {
        normal: path.join(__dirname, '../../fonts/Roboto-Regular.ttf'),
        bold: path.join(__dirname, '../../fonts/Roboto-Regular.ttf'),
    },
};

@Injectable()
export class ReportService {
    private chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 800, height: 600 });
    private printer= new PdfPrinter(fonts);

    async generateIncidentPdf(incident: Incident): Promise<Buffer> {

        const docDefinition: TDocumentDefinitions = {
            content: [
                { text: 'Reporte de Incidente', style: 'header', alignment: 'center', margin: [0, 0, 0, 20] },

                {
                    table: {
                        widths: ['30%', '70%'],
                        body: [
                            [{ text: 'ID', style: 'tableHeader' }, incident.id],
                            [{ text: 'Tipo', style: 'tableHeader' }, incident.type],
                            [{ text: 'Subtipo', style: 'tableHeader' }, incident.subType],
                            [{ text: 'Descripción', style: 'tableHeader' }, incident.description],
                            [{ text: 'Dirección', style: 'tableHeader' }, incident.address],
                            [{ text: 'Latitud', style: 'tableHeader' }, incident.locationLat],
                            [{ text: 'Longitud', style: 'tableHeader' }, incident.locationLng],
                            [{ text: 'Usuario', style: 'tableHeader' }, incident.user.name],
                            [{ text: 'Instituto', style: 'tableHeader' }, incident.institute.name],
                            [{ text: 'Tipo de Formulario', style: 'tableHeader' }, incident.formType],
                            [{ text: 'Oficial', style: 'tableHeader' }, incident.officerName],
                            [{ text: 'Teléfono', style: 'tableHeader' }, incident.phoneNumber],
                            [{ text: 'Remitente', style: 'tableHeader' }, incident.senderName],
                            [{ text: 'Número de Cámara', style: 'tableHeader' }, incident.cameraNumber],
                            [{ text: 'Número de Documento', style: 'tableHeader' }, incident.documentNumber],
                            [{ text: 'Fecha de Atención', style: 'tableHeader' }, incident.attentionDate],
                            [{ text: 'Fecha de Cierre', style: 'tableHeader' }, incident.closingDate],
                            [{ text: 'Relevante', style: 'tableHeader' }, incident.isRelevant ? 'Sí' : 'No'],
                            [{ text: 'Estado', style: 'tableHeader' }, incident.status],
                            [{ text: 'Creado', style: 'tableHeader' }, incident.createdAt],
                        ],
                    },
                    layout: {
                        fillColor: (rowIndex: number) => (rowIndex % 2 === 0 ? '#F5F5F5' : null),
                    },
                },
            ],
            styles: {
                header: { fontSize: 22, bold: true },
                tableHeader: { bold: true, fillColor: '#4CAF50', color: 'white', margin: [0, 5, 0, 5] },
            },
            defaultStyle: { fontSize: 10 },
        };

        const pdfDoc = this.printer.createPdfKitDocument(docDefinition);
        const chunks: Buffer[] = [];
        return new Promise((resolve, reject) => {
            pdfDoc.on('data', (chunk) => chunks.push(chunk));
            pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
            pdfDoc.on('error', reject);
            pdfDoc.end();
        });
    }
}
