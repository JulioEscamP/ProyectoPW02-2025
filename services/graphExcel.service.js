import { Client } from "@microsoft/microsoft-graph-client";
import msalAuthService from "./msalAuth.service.js";

class GraphExcelService {
  constructor() {
    this.siteId = process.env.SHAREPOINT_SITE_ID || "";
    this.driveId = process.env.SHAREPOINT_DRIVE_ID || "";
    this.fileId = process.env.EXCEL_FILE_ID || "";
    this.worksheetName = process.env.EXCEL_WORKSHEET_NAME || "Aplicaciones";
  }

  async getClient() {
    const accessToken = await msalAuthService.getAccessToken();
    
    return Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      },
    });
  }

  async addRowToExcel(aplicacionData) {
    try {
      if (!msalAuthService.isConfigured()) {
        console.warn("Microsoft Graph no está configurado. Saltando integración con Excel.");
        return { success: false, message: "Configuración de Azure no disponible" };
      }

      const client = await this.getClient();

      const rowData = this.formatAplicacionData(aplicacionData);

      const tableName = process.env.EXCEL_TABLE_NAME || "TablaAplicaciones";
      const endpoint = `/sites/${this.siteId}/drives/${this.driveId}/items/${this.fileId}/workbook/tables/${tableName}/rows`;

      const requestBody = {
        values: [rowData],
      };

      const response = await client.api(endpoint).post(requestBody);

      console.log("Fila agregada exitosamente a Excel:", response);
      return { success: true, data: response };
    } catch (error) {
      console.error("Error al agregar fila a Excel:", error.message);
      
      if (error.statusCode === 404) {
        console.error("Recurso no encontrado. Verifica SHAREPOINT_SITE_ID, SHAREPOINT_DRIVE_ID, EXCEL_FILE_ID y EXCEL_TABLE_NAME");
      }
      
      return { success: false, error: error.message };
    }
  }

  formatAplicacionData(aplicacion) {
    const fecha = new Date(aplicacion.fechaSumision || Date.now());
    const fechaFormateada = fecha.toISOString().split('T')[0];
    
    return [
      aplicacion._id?.toString() || "",
      aplicacion.estudiante?.nombre || aplicacion.estudiante?.toString() || "",
      aplicacion.estudiante?.correo || "",
      aplicacion.proyecto?.titulo || aplicacion.proyecto?.toString() || "",
      aplicacion.estado || "Pendiente",
      fechaFormateada,
    ];
  }

  async updateRowInExcel(aplicacionId, nuevoEstado) {
    try {
      if (!msalAuthService.isConfigured()) {
        console.warn("Microsoft Graph no está configurado. Saltando actualización en Excel.");
        return { success: false, message: "Configuración de Azure no disponible" };
      }

      const client = await this.getClient();

      const tableName = process.env.EXCEL_TABLE_NAME || "TablaAplicaciones";
      const worksheetName = this.worksheetName;
      
      const rangeEndpoint = `/sites/${this.siteId}/drives/${this.driveId}/items/${this.fileId}/workbook/worksheets/${worksheetName}/usedRange`;
      const rangeResponse = await client.api(rangeEndpoint).get();

      const rows = rangeResponse.values;
      let rowIndex = -1;

      for (let i = 1; i < rows.length; i++) {
        if (rows[i][0] === aplicacionId.toString()) {
          rowIndex = i;
          break;
        }
      }

      if (rowIndex === -1) {
        console.warn(`No se encontró la aplicación ${aplicacionId} en Excel`);
        return { success: false, message: "Aplicación no encontrada en Excel" };
      }

      const columnIndex = 4;
      const cellAddress = `${worksheetName}!${this.getColumnLetter(columnIndex)}${rowIndex + 1}`;
      const updateEndpoint = `/sites/${this.siteId}/drives/${this.driveId}/items/${this.fileId}/workbook/worksheets/${worksheetName}/range(address='${cellAddress}')`;

      const requestBody = {
        values: [[nuevoEstado]],
      };

      const response = await client.api(updateEndpoint).patch(requestBody);

      console.log("Estado actualizado en Excel:", response);
      return { success: true, data: response };
    } catch (error) {
      console.error("Error al actualizar estado en Excel:", error.message);
      return { success: false, error: error.message };
    }
  }

  getColumnLetter(columnNumber) {
    let letter = "";
    while (columnNumber >= 0) {
      letter = String.fromCharCode((columnNumber % 26) + 65) + letter;
      columnNumber = Math.floor(columnNumber / 26) - 1;
    }
    return letter;
  }

  isConfigured() {
    return !!(
      this.siteId &&
      this.driveId &&
      this.fileId &&
      msalAuthService.isConfigured()
    );
  }
}

export default new GraphExcelService();
