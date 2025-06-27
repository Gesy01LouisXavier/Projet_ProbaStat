// Configuration centralisée pour les URLs d'API
export const config = {
  // URL de l'API backend
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:3100',
  
  // Endpoints spécifiques
  endpoints: {
    calculReserves: '/api/calcul-reserves/',
    importCsv: '/api/import-csv/',
  }
};

// Fonction utilitaire pour construire les URLs complètes
export const getApiUrl = (endpoint: string): string => {
  return `${config.apiBaseUrl}${endpoint}`;
};

// URLs prêtes à l'emploi
export const apiUrls = {
  calculReserves: getApiUrl(config.endpoints.calculReserves),
  importCsv: getApiUrl(config.endpoints.importCsv),
}; 