import { useState } from 'react';
import { useLucidAPI } from '../hooks/useLucidAPI';
import { generateLucidDiagram } from '../utils/lucidDiagramData';

function LucidAPIIntegration() {
  const { 
    api, 
    loading, 
    error, 
    data,
    getCurrentUser,
    listDocuments,
    createDocument,
    getDocument,
    importDiagramJSON,
  } = useLucidAPI();

  const [activeTab, setActiveTab] = useState('create');
  const [newDocName, setNewDocName] = useState('AgentCore Architecture');
  const [documentId, setDocumentId] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [importTitle, setImportTitle] = useState('AgentCore Architecture Diagram');

  const handleCreateDocument = async (e) => {
    e.preventDefault();
    const result = await createDocument(newDocName);
    if (result?.id) {
      setNewDocName('AgentCore Architecture');
      // Open in Lucidchart
      window.open(`https://lucidchart.com/documents/view/${result.id}`, '_blank');
    }
  };

  const handleListDocuments = async (e) => {
    e.preventDefault();
    await listDocuments();
  };

  const handleGetUser = async (e) => {
    e.preventDefault();
    await getCurrentUser();
  };

  const handleViewDocument = async (e) => {
    e.preventDefault();
    if (documentId) {
      const doc = await getDocument(documentId);
      setSelectedDoc(doc);
    }
  };

  const handleTestConnection = async (e) => {
    e.preventDefault();
    console.log('Testing Lucidchart API connection...');
    try {
      const result = await api.testConnection();
      setTestResults(result);
      console.log('Test result:', result);
    } catch (err) {
      setTestResults({ success: false, message: err.message });
      console.error('Test failed:', err);
    }
  };

  const handleImportDiagram = async (e) => {
    e.preventDefault();
    console.log('Importing architecture diagram...');
    try {
      // Generate the Lucid diagram from architecture data
      const diagramData = generateLucidDiagram();
      console.log('Generated diagram data:', diagramData);
      
      // Import it to Lucidchart
      const result = await importDiagramJSON(diagramData, importTitle);
      if (result?.documentId) {
        // Open in Lucidchart
        window.open(`https://lucid.app/lucidchart/${result.documentId}/edit`, '_blank');
      }
    } catch (err) {
      console.error('Import failed:', err);
    }
  };

  if (!api) {
    return (
      <div style={{ padding: '20px', background: '#FEE2E2', borderRadius: '8px', color: '#991B1B' }}>
        <strong>⚠️ Lucidchart API Not Configured</strong>
        <p style={{ margin: '8px 0' }}>
          Set your API key in <code>.env.local</code> to enable Lucidchart integration.
        </p>
        <p style={{ fontSize: '12px', color: '#7F1D1D' }}>
          Create a free API key at <a href="https://developer.lucid.app/" target="_blank" rel="noopener noreferrer">developer.lucid.app</a>
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px', marginTop: '20px' }}>
      <h2 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: '700' }}>Lucidchart API Integration</h2>

      {/* Diagnosis Call-out */}
      <div style={{ 
        padding: '12px', 
        background: '#FEF3C7', 
        borderRadius: '6px', 
        marginBottom: '16px',
        fontSize: '13px',
        color: '#92400E',
        border: '1px solid #FCD34D'
      }}>
        <strong>⚠️ API Connection Issue Detected</strong>
        <p style={{ margin: '6px 0 0' }}>
          The Lucidchart REST API endpoints may not be available or your API key might not have the right permissions. 
          Try the <strong>List Documents</strong> option first - if that fails, your API key or credentials need review.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
        {['create', 'import', 'list', 'view', 'user', 'test'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 16px',
              background: activeTab === tab ? '#3B82F6' : 'transparent',
              color: activeTab === tab ? '#fff' : '#666',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === tab ? '600' : '400',
              borderBottom: activeTab === tab ? '3px solid #3B82F6' : 'none',
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Create Document Tab */}
      {activeTab === 'create' && (
        <form onSubmit={handleCreateDocument} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>
              Document Name
            </label>
            <input
              type="text"
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                marginTop: '4px',
              }}
              placeholder="Enter diagram name"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 16px',
              background: '#3B82F6',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Creating...' : '+ Create New Diagram'}
          </button>
          {data?.id && (
            <div style={{ padding: '12px', background: '#DBEAFE', borderRadius: '6px', color: '#0c4a6e', fontSize: '13px' }}>
              ✓ Document created! Opens in Lucidchart automatically.
              <br />
              <code style={{ fontSize: '11px' }}>ID: {data.id}</code>
            </div>
          )}
        </form>
      )}

      {/* Import Diagram Tab */}
      {activeTab === 'import' && (
        <form onSubmit={handleImportDiagram} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            padding: '12px',
            background: '#FEF3C7',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#b45309',
            border: '1px solid #fcd34d'
          }}>
            <strong>📝 Creating Diagram Document</strong>
            <p style={{ margin: '6px 0 0' }}>
              This creates a new Lucidchart document and prepares it for your architecture diagram. 
              You can then edit it directly in Lucidchart to add the diagram content.
            </p>
          </div>
          
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>
              Diagram Title
            </label>
            <input
              type="text"
              value={importTitle}
              onChange={(e) => setImportTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                marginTop: '4px',
              }}
              placeholder="Enter diagram title"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 16px',
              background: '#10B981',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Creating...' : '📤 Create Diagram Document'}
          </button>
          {data?.documentId && (
            <div style={{ padding: '12px', background: '#D1FAE5', borderRadius: '6px', color: '#065F46', fontSize: '13px' }}>
              ✓ Document created successfully! 
              <br />
              <strong>Opening in Lucidchart...</strong>
              <br />
              <code style={{ fontSize: '11px' }}>ID: {data.documentId}</code>
              <br />
              <span style={{ fontSize: '11px', marginTop: '6px', display: 'block' }}>
                You can now edit the document and create your architecture diagram directly in Lucidchart.
              </span>
            </div>
          )}
        </form>
      )}

      {/* List Documents Tab */}
      {activeTab === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={handleListDocuments}
            disabled={loading}
            style={{
              padding: '10px 16px',
              background: '#3B82F6',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              width: 'fit-content',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Loading...' : 'Load My Documents'}
          </button>
          {data?.documents && (
            <div>
              <p style={{ fontSize: '13px', color: '#666', margin: '8px 0' }}>
                Found {data.documents.length} documents:
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {data.documents.map((doc) => (
                  <li
                    key={doc.id}
                    style={{
                      padding: '10px 12px',
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      marginBottom: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                    onClick={() => window.open(`https://lucidchart.com/documents/view/${doc.id}`, '_blank')}
                  >
                    <strong>{doc.name}</strong>
                    <br />
                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>ID: {doc.id}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* View Document Tab */}
      {activeTab === 'view' && (
        <form onSubmit={handleViewDocument} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>
              Document ID
            </label>
            <input
              type="text"
              value={documentId}
              onChange={(e) => setDocumentId(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                marginTop: '4px',
              }}
              placeholder="Paste document ID"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !documentId}
            style={{
              padding: '10px 16px',
              background: '#3B82F6',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              opacity: loading || !documentId ? 0.7 : 1,
            }}
          >
            {loading ? 'Loading...' : 'Get Document Info'}
          </button>
          {selectedDoc && (
            <div style={{ padding: '12px', background: '#DBEAFE', borderRadius: '6px', color: '#0c4a6e', fontSize: '13px' }}>
              <strong>{selectedDoc.name}</strong>
              <br />
              <span style={{ fontSize: '11px' }}>Created: {new Date(selectedDoc.created).toLocaleDateString()}</span>
            </div>
          )}
        </form>
      )}

      {/* User Info Tab */}
      {activeTab === 'user' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={handleGetUser}
            disabled={loading}
            style={{
              padding: '10px 16px',
              background: '#3B82F6',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              width: 'fit-content',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Loading...' : 'Get Profile Info'}
          </button>
          {data && (
            <div style={{ padding: '12px', background: '#E0F2FE', borderRadius: '6px', color: '#0a2463', fontSize: '13px' }}>
              <strong>User: {data.name || data.email || data.id || 'Unknown'}</strong>
              <br />
              {data.email && <span style={{ fontSize: '11px', color: '#026aa2' }}>Email: {data.email}</span>}
              {data.email && <br />}
              {data.accountType && (
                <>
                  <span style={{ fontSize: '11px', color: '#026aa2' }}>Account: {data.accountType}</span>
                  <br />
                </>
              )}
              {data.id && <span style={{ fontSize: '11px', color: '#026aa2' }}>ID: {data.id}</span>}
            </div>
          )}
        </div>
      )}

      {/* Test Connection Tab */}
      {activeTab === 'test' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ margin: '0', fontSize: '13px', color: '#666' }}>
            Test which Lucidchart API endpoints are available for your API key.
          </p>
          <button
            onClick={handleTestConnection}
            disabled={loading}
            style={{
              padding: '10px 16px',
              background: '#10B981',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              width: 'fit-content',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Testing...' : '🔍 Run Diagnostics'}
          </button>
          {testResults && (
            <div style={{
              padding: '12px',
              background: testResults.success ? '#D1FAE5' : '#FEE2E2',
              borderRadius: '6px',
              color: testResults.success ? '#065F46' : '#991B1B',
              fontSize: '13px',
            }}>
              <strong>{testResults.success ? '✅' : '❌'} {testResults.message}</strong>
              {testResults.data && (
                <div style={{ marginTop: '8px', fontSize: '12px', opacity: 0.9 }}>
                  <pre style={{ margin: 0, overflow: 'auto', maxHeight: '200px' }}>
                    {JSON.stringify(testResults.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
          <div style={{ fontSize: '12px', color: '#666', marginTop: '8px', lineHeight: '1.5' }}>
            <strong>What this tests:</strong>
            <ul style={{ margin: '6px 0', paddingLeft: '20px' }}>
              <li>Checks v1 API base URL</li>
              <li>Checks v2 API base URL</li>
              <li>Checks root API endpoint</li>
              <li>Validates your API key authentication</li>
            </ul>
            <p style={{ margin: '8px 0 0' }}>
              Check browser console (F12) for detailed logs about which endpoints respond.
            </p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div style={{ padding: '12px', background: '#FEE2E2', borderRadius: '6px', color: '#991B1B', fontSize: '13px', marginTop: '12px' }}>
          ❌ <strong>API Error:</strong> {error}
          <div style={{ fontSize: '11px', marginTop: '6px', opacity: 0.8 }}>
            Check the browser console (F12) for detailed error information from the API response.
          </div>
        </div>
      )}
    </div>
  );
}

export default LucidAPIIntegration;
