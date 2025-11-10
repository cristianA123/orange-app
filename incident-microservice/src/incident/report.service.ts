import { Injectable } from "@nestjs/common"
import moment from "moment"
import puppeteer from "puppeteer"

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

const COLORS = {
    primary: "#065f46",
    primaryLight: "#10b981",
    accent: "#047857",
    secondary: "#1f2937",
    text: "#111827",
    textLight: "#6b7280",
    textLighter: "#9ca3af",
    border: "#e5e7eb",
    background: "#f9fafb",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
}

@Injectable()
export class ReportService {
    async generateIncidentPdf(incident: IncidentData): Promise<Buffer> {
        const formatDate = (d?: Date | string) => (d ? moment(d).format("DD [de] MMMM [de] YYYY, HH:mm") : "—")

        const getStatusBadge = (status?: string) => {
            const map: Record<string, { text: string; color: string; bgColor: string }> = {
                open: { text: "Abierto", color: "#fff", bgColor: COLORS.primaryLight },
                closed: { text: "Cerrado", color: "#fff", bgColor: COLORS.textLight },
                "1": { text: "Reportado", color: "#fff", bgColor: COLORS.primary },
                "2": { text: "En Proceso", color: "#fff", bgColor: COLORS.warning },
                "3": { text: "Cerrado", color: "#fff", bgColor: COLORS.textLight },
            }
            return map[status || "1"] || { text: "Pendiente", color: "#fff", bgColor: COLORS.primary }
        }

        const status = getStatusBadge(incident.status)
        const relevanceText = incident.isRelevant ? "Relevante" : "No Relevante"

        const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reporte de Incidencia</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background-color: #f8fafc;
      color: ${COLORS.text};
      line-height: 1.5;
    }

    .container {
      margin: 40px 35px;
      background: white;
    }

    /* Improved header with decorative line */
    .header {
      position: relative;
      padding: 24px 0 20px 0;
      margin-bottom: 28px;
      border-bottom: 2px solid ${COLORS.primary};
    }

    .header::before {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 60px;
      height: 3px;
      background: linear-gradient(to right, ${COLORS.primaryLight}, ${COLORS.accent});
      border-radius: 2px;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .header-left h1 {
      font-size: 28px;
      font-weight: 700;
      color: ${COLORS.primary};
      margin-bottom: 4px;
    }

    .header-left .institute {
      font-size: 13px;
      color: ${COLORS.textLight};
      font-weight: 500;
    }

    .header-right {
      text-align: right;
    }

    .badge {
      display: inline-block;
      background-color: ${status.bgColor};
      color: ${status.color};
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      margin-bottom: 8px;
    }

    .doc-number {
      font-size: 11px;
      color: ${COLORS.textLighter};
      font-weight: 500;
    }

    /* Enhanced section styling */
    .section {
      background: white;
      border: 1px solid ${COLORS.border};
      border-radius: 8px;
      padding: 18px 20px;
      margin-bottom: 16px;
      transition: box-shadow 0.2s;
    }

    .section:hover {
      box-shadow: 0 4px 12px rgba(6, 95, 70, 0.08);
    }

    .section-title {
      font-size: 12px;
      font-weight: 700;
      color: ${COLORS.primary};
      text-transform: uppercase;
      letter-spacing: 0.6px;
      padding-bottom: 10px;
      margin-bottom: 12px;
      border-bottom: 1.5px solid ${COLORS.border};
      display: flex;
      align-items: center;
    }

    .section-title::before {
      content: '';
      width: 3px;
      height: 14px;
      background: ${COLORS.primaryLight};
      border-radius: 2px;
      margin-right: 8px;
    }

    .row {
      display: flex;
      font-size: 12px;
      margin-bottom: 8px;
      padding-bottom: 6px;
    }

    .row:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .label {
      width: 35%;
      color: ${COLORS.textLight};
      font-weight: 500;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .value {
      width: 65%;
      color: ${COLORS.text};
      font-weight: 500;
      word-break: break-word;
    }

    /* Enhanced description section */
    .description-text {
      font-size: 12px;
      line-height: 1.6;
      color: ${COLORS.text};
      text-align: justify;
      background: ${COLORS.background};
      padding: 14px;
      border-radius: 6px;
      border-left: 3px solid ${COLORS.primaryLight};
      font-weight: 400;
    }

    .columns {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .columns .section {
      flex: 1;
    }

    /* Footer styling */
    footer {
      position: fixed;
      bottom: 30px;
      left: 35px;
      right: 35px;
      font-size: 10px;
      color: ${COLORS.textLighter};
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid ${COLORS.border};
      padding-top: 12px;
    }

    footer strong {
      color: ${COLORS.primary};
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-content">
        <div class="header-left">
          <h1>Reporte de Incidencia</h1>
          <div class="institute">${incident.institute?.name || "Municipalidad"}</div>
        </div>
        <div class="header-right">
          <div class="badge">${status.text}</div>
          <div class="doc-number">Doc. ${incident.documentNumber || "—"}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Tipo de Incidencia</div>
      ${this.row("Clasificación Principal", incident.type)}
      ${this.row("Subclasificación", incident.subType)}
      ${this.row("Origen", incident.formType === "VideoSurveillance" ? "VideoVigilancia" : incident.formType)}
    </div>

    <div class="section">
      <div class="section-title">Descripción de los Hechos2</div>
      <div class="description-text">${incident.description || "Sin descripción disponible."}</div>
    </div>

    <div class="section">
      <div class="section-title">Ubicación del Incidente</div>
      ${this.row("Dirección", incident.address)}
      ${this.row("Coordenadas GPS", `${incident.locationLat || "—"}, ${incident.locationLng || "—"}`)}
    </div>

    <div class="columns">
      <div class="section">
        <div class="section-title">Oficial a Cargo</div>
        ${this.row("Nombre", `${incident.officer?.name || ""} ${incident.officer?.lastName || ""}`)}
        ${this.row("Puesto", incident.officer?.jobLevel)}
        ${this.row("Grupo/Área", incident.officer?.areaGroup)}
        ${this.row("Documento", `${incident.officer?.documentType || ""} ${incident.officer?.documentNumber || ""}`)}
      </div>

      <div class="section">
        <div class="section-title">Cronología</div>
        ${this.row("Fecha de Reporte", formatDate(incident.createdAt))}
        ${this.row("Atención", formatDate(incident.attentionDate))}
        ${this.row("Cierre", formatDate(incident.closingDate))}
        ${this.row("Última Actualización", formatDate(incident.updatedAt))}
      </div>
    </div>

    <div class="section">
      <div class="section-title">Detalles Adicionales</div>
      ${this.row("Cámara", `Cámara #${incident.cameraNumber || "—"}`)}
      ${this.row("Tipo de Formulario", incident.formType || "—")}
      ${this.row("Relevancia", relevanceText)}
    </div>
  </div>

  <footer>
    <div>Generado el ${moment().format("D [de] MMMM [de] YYYY, HH:mm")}</div>
    <div><strong>${incident.institute?.name || "Municipalidad"}</strong></div>
    <div>Página 1 de 1</div>
  </footer>
</body>
</html>
`

        const browser = await puppeteer.launch({
            headless: true,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--single-process",
          ],
        })

        const page = await browser.newPage()
        await page.setContent(html, { waitUntil: "networkidle0" })
        const pdf = await page.pdf({ format: "A4" })

        await browser.close()
        return Buffer.from(pdf)
    }

    private row(label: string, value?: any) {
        return `
      <div class="row">
        <div class="label">${label}</div>
        <div class="value">${value || "—"}</div>
      </div>
    `
    }
}
