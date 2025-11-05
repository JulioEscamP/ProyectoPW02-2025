import { ConfidentialClientApplication } from "@azure/msal-node";

class MsalAuthService {
  constructor() {
    this.msalConfig = {
      auth: {
        clientId: process.env.AZURE_CLIENT_ID || "",
        //authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID || ""}`,
        clientSecret: process.env.AZURE_CLIENT_SECRET || "",
      },
    };

    this.cca = new ConfidentialClientApplication(this.msalConfig);
    this.tokenCache = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    try {
      if (this.tokenCache && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.tokenCache;
      }

      const tokenRequest = {
        //scopes: ["https://graph.microsoft.com/.default"],
      };

      const response = await this.cca.acquireTokenByClientCredential(tokenRequest);
      
      if (!response || !response.accessToken) {
        throw new Error("No se pudo obtener el token de acceso");
      }

      this.tokenCache = response.accessToken;
      this.tokenExpiry = Date.now() + (response.expiresIn * 1000) - 60000;

      return this.tokenCache;
    } catch (error) {
      console.error("Error al obtener token de acceso:", error.message);
      throw new Error(`Error de autenticación con Microsoft Graph: ${error.message}`);
    }
  }

  isConfigured() {
    return !!(
      process.env.AZURE_CLIENT_ID &&
      process.env.AZURE_TENANT_ID &&
      process.env.AZURE_CLIENT_SECRET
    );
  }
}

export default new MsalAuthService();
