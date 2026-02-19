# Lucidchart API Integration Setup

## Step 1: Create Developer Account & API Key

1. Go to **https://developer.lucid.app/**
2. Sign in with your Lucidchart account (or create one)
3. Create a new Application:
   - Click "Create Application"
   - Name: `AgentCore MSAP Diagram Generator`
   - Description: `React app for converting AgentCore architecture to Lucidchart diagrams`
   - Accept the terms and create
4. Copy your **API Key** from the credentials page

## Step 2: Set Environment Variables

Create a `.env.local` file in your project root:

```env
# Lucidchart API Configuration
VITE_LUCID_API_KEY=your_api_key_here
VITE_LUCID_FOLDER_ID=optional_folder_id_here
```

**Note:** 
- Vite requires the `VITE_` prefix for client-side environment variables
- Store the API key securely - never commit it to git
- Add `.env.local` to `.gitignore`

## Step 3: Use the API in Your App

### Example 1: Create a New Diagram Document

```jsx
import { useLucidAPI } from '../hooks/useLucidAPI';

function CreateDiagramButton() {
  const { createDocument, loading, error, data } = useLucidAPI();

  const handleCreate = async () => {
    const result = await createDocument('AgentCore Architecture Diagram');
    console.log('Document created:', result);
    // result.id = documentId to open in Lucidchart
  };

  return (
    <div>
      <button onClick={handleCreate} disabled={loading}>
        {loading ? 'Creating...' : 'Create in Lucidchart'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && <p>Document created! ID: {data.id}</p>}
    </div>
  );
}
```

### Example 2: List Your Documents

```jsx
function ListDocuments() {
  const { listDocuments, loading, data } = useLucidAPI();

  useEffect(() => {
    listDocuments();
  }, [listDocuments]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      <ul>
        {data?.documents?.map(doc => (
          <li key={doc.id}>{doc.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Example 3: Export Diagram

```jsx
async function exportToFile(documentId) {
  const export = await api.exportDocument(documentId, 'pdf');
  // Check export.downloadLink for the file URL
  window.open(export.downloadLink, '_blank');
}
```

## Step 4: Open Document in Lucidchart

Once you create a document via API, open it at:

```
https://lucidchart.com/documents/view/{documentId}
```

## Available API Methods

```javascript
// User
getCurrentUser()

// Documents
listDocuments(folderId)
getDocument(documentId)
createDocument(name, folderId)
updateDocument(documentId, updates)

// Sharing
shareDocument(documentId, emails, permission)

// Pages
getPages(documentId)

// Export
exportDocument(documentId, format, pageId)
getExportStatus(documentId, exportId)
```

## Limitations & Notes

1. **REST API doesn't support programmatic shape creation** - you can only:
   - Create/manage documents
   - Export diagrams
   - Share documents
   - Manage pages

2. **To create shapes programmatically**, you need:
   - **Lucid Extension SDK** (runs inside Lucidchart editor)
   - Or manually import your JSON structure into Lucidchart

3. **JSON Export/Import workaround**:
   - Export your diagram as JSON from your React app
   - Manually upload to Lucidchart via UI
   - Or write a script to parse JSON and create shapes via Extension SDK

## API Reference

- **Official Docs**: https://developer.lucid.app/docs
- **ReadMe Docs**: https://lucidchart.readme.io/
- **API Base URL**: `https://api.lucidchart.com/v1`

## Troubleshooting

**401 Unauthorized**
- Verify API key is correct
- API key may have expired - regenerate it

**404 Not Found**
- Document ID doesn't exist or you don't have access
- Check if document was shared with your account

**CORS Issues**
- Your app runs on localhost while API expects specific origins
- Set up a backend proxy if needed

---

For more help, visit: https://developer.lucid.app/support
