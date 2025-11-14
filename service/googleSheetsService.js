import {google} from 'googleapis';

const getGoogleSheetsClient = () => {
  try {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
    
    const auth = new google.auth.JWT(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      null,
      privateKey,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    return google.sheets({ version: 'v4', auth });
  } catch (error) {
    console.error('Error al crear cliente de Google Sheets:', error.message);
    throw error;
  }
};

export const agregarFilaAplicacion = async (aplicacionData) => {
  try {
    const sheets = getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const values = [[
      aplicacionData.id,
      aplicacionData.nombreEstudiante,
      aplicacionData.correoEstudiante,
      aplicacionData.tituloProyecto,
      aplicacionData.estado,
      aplicacionData.fechaSumision
    ]];

    const resource = { values };

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Hoja 1!A:F',
      valueInputOption: 'RAW',
      resource,
    });

    console.log('Fila agregada exitosamente');
    return response.data;
  } catch (error) {
    console.error('Error al agregar fila', error.message);
    throw error;
  }
};