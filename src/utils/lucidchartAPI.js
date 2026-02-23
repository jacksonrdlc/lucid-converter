/**
 * Lucidchart REST API Integration
 * 
 * Before using this, you need to:
 * 1. Create a Lucidchart developer account at https://developer.lucid.app
 * 2. Create an application to get your API key
 * 3. Set env variables: VITE_LUCID_API_KEY
 * 
 * API Documentation: https://developer.lucid.app/docs/rest-api
 */

import JSZip from 'jszip';

const LUCID_API_BASE = 'https://api.lucid.co';

class LucidChartAPI {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('Lucidchart API key is required. Set VITE_LUCID_API_KEY env variable.');
    }
    this.apiKey = apiKey;
    this.headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Lucid-Api-Version': '1',  // Required by Lucidchart API
    };
  }

  /**
   * Get current authenticated user info
   * Note: Lucidchart API may require getting user from a different endpoint
   */
  /**
   * Test the API connection with a simple request
   * This helps diagnose if authentication is working
   */
  async testConnection() {
    console.log('Testing Lucidchart REST API connection...');
    console.log(`API Base: ${LUCID_API_BASE}`);
    
    try {
      const result = await this.request('GET', '/documents');
      return { 
        success: true, 
        message: 'API connection successful! Documents endpoint is accessible.',
        data: result 
      };
    } catch (err) {
      return { 
        success: false, 
        message: `API connection failed: ${err.message}` 
      };
    }
  }

  async getCurrentUser() {
    // The Lucidchart REST API documentation suggests trying these endpoints
    const endpoints = ['/me', '/user', '/account/user'];
    
    let lastError = null;
    for (const endpoint of endpoints) {
      try {
        console.log(`Attempting getCurrentUser with endpoint: ${endpoint}`);
        const result = await this.request('GET', endpoint);
        console.log(`✅ Success with endpoint: ${endpoint}`);
        return result;
      } catch (err) {
        console.warn(`❌ ${endpoint} failed:`, err.message);
        lastError = err;
      }
    }
    
    console.error('All user profile endpoints failed:', lastError);
    throw new Error(`Could not get current user. Tried: ${endpoints.join(', ')}. Error: ${lastError?.message || 'Unknown error'}`);
  }

  /**
   * List all documents
   */
  async listDocuments(folderId = null) {
    let url = '/documents';
    if (folderId) {
      url += `?parent=${folderId}`;
    }
    return this.request('GET', url);
  }

  /**
   * Get a specific document
   */
  async getDocument(documentId) {
    return this.request('GET', `/documents/${documentId}`);
  }

  /**
   * Create a new document
   */
  async createDocument(name, folderId = null) {
    const body = { 
      title: name,
      product: 'lucidchart'
    };
    if (folderId) {
      body.parent = folderId;
    }
    return this.request('POST', '/documents', body);
  }

  /**
   * Create a .lucid ZIP file from diagram JSON and import it
   * 
   * .lucid files are ZIP archives containing document.json in Lucid's standard format
   * Requires: jszip library
   */
  async importDiagramJSON(diagramData, title = 'Architecture Diagram', folderId = null) {
    try {
      // Get the shapes and connections from diagram data
      const shapes = diagramData.shapes || [];
      const lines = diagramData.lines || [];

      console.log('📊 Diagram data:', { shapeCount: shapes.length, lineCount: lines.length });
      console.log('📋 Shapes:', shapes.slice(0, 2)); // Show first 2 shapes

      // Create the Lucid Standard Import format with pages array
      const lucidJSON = {
        version: 1,
        pages: [
          {
            id: 'page1',
            title: title,
            shapes: shapes,
            lines: lines,
          }
        ]
      };

      console.log('📦 Built Lucid JSON:', {
        version: lucidJSON.version,
        pageCount: lucidJSON.pages.length,
        shapeCount: shapes.length,
        lineCount: lines.length
      });
      
      console.log('📦 Building .lucid ZIP file...');
      
      // Create a ZIP archive with JSZip
      const zip = new JSZip();
      zip.file('document.json', JSON.stringify(lucidJSON, null, 2));
      
      // Generate the ZIP blob
      const arrayBuffer = await zip.generateAsync({ type: 'arraybuffer' });
      // Create a File object with the custom MIME type for Lucidchart imports
      // The browser will include this as Content-Type in the multipart form-data,
      // and the Lucidchart API reads the Content-Type header to determine file type
      const file = new File([arrayBuffer], 'diagram.lucid', { 
        type: 'x-application/vnd.lucid.standardImport' 
      });
      
      console.log('✅ Generated .lucid file:', file.size, 'bytes');
      console.log('📦 File Content-Type:', file.type, '(read from file entry in multipart form-data)');
      
      // Import the ZIP file as a .lucid document
      return this.importDocument(file, 'lucid', title, folderId);
    } catch (err) {
      console.error('Error creating .lucid file:', err);
      throw new Error(`Failed to create diagram file: ${err.message}`);
    }
  }
  async importDocument(fileData, fileType, title = 'Imported Document', folderId = null) {
    // Create FormData for multipart upload
    const formData = new FormData();
    
    // Determine the MIME type based on file type
    let mimeType = 'x-application/vnd.lucid.standardImport';
    if (fileType === 'drawio') {
      mimeType = 'x-application/vnd.lucid.drawio';
    } else if (fileType === 'visio') {
      mimeType = 'x-application/vnd.lucid.visio';
    } else if (fileType === 'gliffy') {
      mimeType = 'x-application/vnd.lucid.gliffy';
    } else if (fileType === 'board') {
      mimeType = 'x-application/vnd.lucid.board';
    }
    
    // Handle both Blob and string data
    let blob;
    if (fileData instanceof Blob) {
      blob = fileData;
    } else {
      blob = new Blob([fileData], { type: 'application/octet-stream' });
    }
    
    // For .lucid files, add the filename so the API recognizes the format
    const filename = fileType === 'lucid' ? 'diagram.lucid' : 'import-file';
    formData.append('file', blob, filename);
    formData.append('type', mimeType);
    formData.append('product', 'lucidchart');
    formData.append('title', title);
    
    if (folderId) {
      formData.append('parent', folderId);
    }
    
    // Make the request with FormData (don't set Content-Type header - let browser set it)
    try {
      const options = {
        method: 'POST',
        headers: {
          'Authorization': this.headers['Authorization'],
          'Lucid-Api-Version': this.headers['Lucid-Api-Version'],
        },
        body: formData,
      };

      console.log(`[Lucid API] POST ${LUCID_API_BASE}/documents (multipart import)`, {
        filename,
        fileSize: blob.size,
        fileType,
        mimeType,
        title
      });
      const response = await fetch(`${LUCID_API_BASE}/documents`, options);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }
        console.error('[Lucid API Error Response]', errorData);
        throw new Error(`Lucid API Error (${response.status}): ${errorData.message || errorData.error || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Lucid API Request Failed:', error);
      throw error;
    }
  }

  /**
   * Update document name or description
   */
  async updateDocument(documentId, updates) {
    return this.request('PUT', `/documents/${documentId}`, updates);
  }

  /**
   * Export document to various formats
   * @param {string} documentId - Document ID
   * @param {string} format - Format: png, pdf, svg, jpeg
   * @param {number} pageId - Optional: specific page to export
   */
  async exportDocument(documentId, format = 'pdf', pageId = null) {
    const body = { fileType: format };
    if (pageId) {
      body.pageId = pageId;
    }
    return this.request('POST', `/documents/${documentId}/exports`, body);
  }

  /**
   * Get export status and download link
   */
  async getExportStatus(documentId, exportId) {
    return this.request('GET', `/documents/${documentId}/exports/${exportId}`);
  }

  /**
   * List shared documents
   */
  async getSharedDocuments() {
    return this.request('GET', '/documents?sharedWithMe=true');
  }

  /**
   * Share document with users
   */
  async shareDocument(documentId, emails, permission = 'edit') {
    const collaborators = emails.map(email => ({
      email,
      permission,
    }));
    return this.request('POST', `/documents/${documentId}/collaborators`, { collaborators });
  }

  /**
   * Get document pages
   */
  async getPages(documentId) {
    return this.request('GET', `/documents/${documentId}/pages`);
  }

  /**
   * Make a generic API request
   */
  async request(method, endpoint, body = null) {
    try {
      const options = {
        method,
        headers: this.headers,
      };

      if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(body);
      }

      console.log(`[Lucid API] ${method} ${LUCID_API_BASE}${endpoint}`, body);

      const response = await fetch(`${LUCID_API_BASE}${endpoint}`, options);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }
        console.error('[Lucid API Error Response]', errorData);
        throw new Error(`Lucid API Error (${response.status}): ${errorData.message || errorData.error || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Lucid API Request Failed:', error);
      throw error;
    }
  }
}

export default LucidChartAPI;
