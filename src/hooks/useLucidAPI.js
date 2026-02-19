import { useState, useCallback } from 'react';
import LucidChartAPI from '../utils/lucidchartAPI';

/**
 * Hook for using Lucidchart API
 */
export function useLucidAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const apiKey = import.meta.env.VITE_LUCID_API_KEY;

  let api = null;
  if (apiKey) {
    api = new LucidChartAPI(apiKey);
  }

  const execute = useCallback(async (fn) => {
    if (!api) {
      setError('Lucidchart API key not configured');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await fn(api);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [api]);

  return {
    api,
    loading,
    error,
    data,
    execute,
    // Convenience methods
    getCurrentUser: () => execute((api) => api.getCurrentUser()),
    listDocuments: (folderId) => execute((api) => api.listDocuments(folderId)),
    createDocument: (name, folderId) => execute((api) => api.createDocument(name, folderId)),
    getDocument: (docId) => execute((api) => api.getDocument(docId)),
    exportDocument: (docId, format) => execute((api) => api.exportDocument(docId, format)),
    importDocument: (fileData, fileType, title, folderId) => execute((api) => api.importDocument(fileData, fileType, title, folderId)),
    importDiagramJSON: (diagramData, title, folderId) => execute((api) => api.importDiagramJSON(diagramData, title, folderId)),
  };
}

export default useLucidAPI;
