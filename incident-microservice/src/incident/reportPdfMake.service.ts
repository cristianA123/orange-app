import { Injectable } from "@nestjs/common"
import PdfPrinter from "pdfmake"
import type { TDocumentDefinitions, Content, TableCell } from "pdfmake/interfaces"
import * as path from "node:path"
import moment from "moment"

interface IncidentData {
    type?: string
    subType?: string
    description?: string
    address?: string
    locationLat?: number
    locationLng?: number
    formType?: string
    documentNumber?: string
    cameraNumber?: string
    status?: string
    isRelevant?: boolean
    createdAt?: Date | string
    attentionDate?: Date | string
    closingDate?: Date | string
    updatedAt?: Date | string
    officer?: {
        name?: string
        lastName?: string
        documentType?: string
        documentNumber?: string
        jobLevel?: string
        areaGroup?: string
    }
    institute?: {
        name?: string
        address?: string
    }
}

const fonts = {
    Roboto: {
        normal: path.join(__dirname, "../../fonts/Roboto-Regular.ttf"),
        bold: path.join(__dirname, "../../fonts/Roboto-Bold.ttf"),
    },
}

const COLORS = {
    primary: "#064E3B",
    primaryLight: "#10B981",
    secondary: "#1F2937",
    text: "#111827",
    textLight: "#6B7280",
    border: "#E5E7EB",
    background: "#F9FAFB",
}

@Injectable()
export class ReportPdfMakeService {
    private printer = new PdfPrinter(fonts)

    async generateIncidentPdf(incident: IncidentData): Promise<Buffer> {
        const formatDate = (d?: Date | string) =>
            d ? moment(d).format("DD [de] MMMM [de] YYYY, HH:mm") : "—"

        const getStatusBadge = (status?: string) => {
            const map: Record<string, { text: string; color: string }> = {
                open: { text: "Abierto", color: COLORS.primaryLight },
                closed: { text: "Cerrado", color: COLORS.textLight },
                "1": { text: "Reportado", color: COLORS.primary },
                "2": { text: "En Proceso", color: "#F59E0B" },
                "3": { text: "Cerrado", color: COLORS.textLight },
            }
            return map[status || "1"] || { text: "Pendiente", color: COLORS.primary }
        }

        const status = getStatusBadge(incident.status)
        const relevanceText = incident.isRelevant ? "Relevante" : "No Relevante"

        const docDefinition: TDocumentDefinitions = {
            pageSize: "A4",
            pageMargins: [40, 40, 40, 50],
            defaultStyle: { font: "Roboto", color: COLORS.text },

            content: [
                // ===== HEADER =====
                {
                    style: "cardHeader",
                    table: {
                        widths: ["*", "auto"],
                        body: [
                            [
                                {
                                    stack: [
                                        { text: "Reporte de Incidencia", style: "title" },
                                        {
                                            text: incident.institute?.name || "Municipalidad A",
                                            style: "subTitle",
                                        }
                                    ],
                                },
                                {
                                    stack: [
                                        {
                                            text: status.text,
                                            color: "#fff",
                                            alignment: "center",
                                            fillColor: status.color,
                                            margin: [0, 0, 0, 2],
                                            bold: true,
                                        },
                                        {
                                            text: `Documento: ${incident.documentNumber || "—"}`,
                                            alignment: "right",
                                            fontSize: 9,
                                            color: COLORS.textLight,
                                        },
                                    ],
                                },
                            ],
                        ],
                    },
                    layout: {
                        hLineWidth: () => 0,
                        vLineWidth: () => 0,
                    },
                    margin: [0, 0, 0, 12],
                },

                // ===== SECTIONS =====
                this.cardSection("Tipo de Incidencia", [
                    ["Clasificación Principal:", incident.type],
                    ["Subclasificación:", incident.subType],
                    [
                        "Origen:",
                        incident.formType === "VideoSurveillance"
                            ? "VideoVigilancia"
                            : incident.formType,
                    ],
                ]),

                this.cardDescription("Descripción de los Hechos", incident.description),

                this.cardSection("Ubicación del Incidente", [
                    ["Dirección:", incident.address],
                    [
                        "Coordenadas GPS:",
                        `${incident.locationLat || "—"}, ${incident.locationLng || "—"}`,
                    ],
                ]),

                {
                    columns: [
                        this.cardSection("Oficial a Cargo", [
                            [
                                "Nombre:",
                                `${incident.officer?.name || ""} ${
                                    incident.officer?.lastName || ""
                                }`.trim(),
                            ],
                            ["Puesto:", incident.officer?.jobLevel],
                            ["Grupo/Área:", incident.officer?.areaGroup],
                            [
                                "Documento:",
                                `${incident.officer?.documentType || ""} ${
                                    incident.officer?.documentNumber || ""
                                }`,
                            ],
                        ]),
                        this.cardSection("Cronología", [
                            ["Fecha de Reporte:", formatDate(incident.createdAt)],
                            ["Atención:", formatDate(incident.attentionDate)],
                            ["Cierre:", formatDate(incident.closingDate)],
                            ["Última Actualización:", formatDate(incident.updatedAt)],
                        ]),
                    ],
                    columnGap: 10,
                    margin: [0, 0, 0, 10],
                },

                this.cardSection("Detalles Adicionales", [
                    ["Cámara:", `Cámara #${incident.cameraNumber || "—"}`],
                    ["Tipo de Formulario:", incident.formType || "—"],
                    ["Relevancia:", relevanceText],
                ]),
            ],

            footer: (currentPage, pageCount): Content => ({
                columns: [
                    {
                        text: `Reporte generado el ${moment().format(
                            "D [de] MMMM [de] YYYY, HH:mm"
                        )}`,
                        fontSize: 8,
                        color: COLORS.textLight,
                    },
                    {
                        text: incident.institute?.name || "Municipalidad A",
                        alignment: "center",
                        fontSize: 8,
                        bold: true,
                    },
                    {
                        text: `Página ${currentPage} de ${pageCount}`,
                        alignment: "right",
                        fontSize: 8,
                        color: COLORS.textLight,
                    },
                ],
                margin: [40, 10, 40, 0],
            }),

            styles: {
                title: { fontSize: 16, bold: true, color: COLORS.secondary },
                subTitle: { fontSize: 10, color: COLORS.textLight },
                smallText: { fontSize: 8, color: COLORS.textLight },

                cardHeader: {
                    fillColor: "#fff",
                    margin: [0, 0, 0, 8],
                },

                card: {
                    fillColor: COLORS.background,
                    margin: [0, 4, 0, 8],
                },

                sectionTitle: {
                    fontSize: 11,
                    bold: true,
                    color: COLORS.primary,
                    margin: [0, 0, 0, 6],
                },

                label: {
                    fontSize: 9,
                    color: COLORS.textLight,
                },

                value: {
                    fontSize: 9,
                    bold: true,
                    color: COLORS.text,
                },

                paragraph: {
                    fontSize: 9,
                    color: COLORS.text,
                    alignment: "justify",
                    margin: [0, 2, 0, 4],
                },
            },
        }

        const pdfDoc = this.printer.createPdfKitDocument(docDefinition)
        const chunks: Buffer[] = []

        return new Promise((resolve, reject) => {
            pdfDoc.on("data", (chunk) => chunks.push(chunk))
            pdfDoc.on("end", () => resolve(Buffer.concat(chunks)))
            pdfDoc.on("error", reject)
            pdfDoc.end()
        })
    }

    private cardSection(title: string, rows: (string | TableCell)[][]): Content {
        return {
            stack: [
                { text: title, style: "sectionTitle" },
                {
                    table: {
                        widths: ["35%", "65%"],
                        body: rows.map(([label, value]) => [
                            { text: String(label), style: "label", margin: [0, 3, 0, 3] },
                            { text: String(value || "—"), style: "value", margin: [0, 3, 0, 3] },
                        ]),
                    },
                    layout: "noBorders",
                },
            ],
            style: "card",
        }
    }

    private cardDescription(title: string, text?: string): Content {
        return {
            stack: [
                { text: title, style: "sectionTitle" },
                {
                    text: text || "Sin descripción disponible.",
                    style: "paragraph",
                    margin: [0, 4, 0, 8],
                },
            ],
            style: "card",
        }
    }
}
