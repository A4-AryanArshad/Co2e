import React, { useState, useRef, useEffect } from 'react';
import DynamicHeader from './components/DynamicHeader';
import Footer2 from './Home/Footer2';
import { API_BASE } from './config';

const AdminDirectoryUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewData, setPreviewData] = useState([]);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const fileInputRef = useRef();

  // Debug: Log message state changes
  useEffect(() => {
    console.log('Message state changed:', message);
  }, [message]);

  // Force clear any old error messages on component mount
  useEffect(() => {
    console.log('Component mounted, clearing any old messages');
    setMessage({ text: '', type: '' });
    fetchUploadHistory();
  }, []);

  const fetchUploadHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await fetch(`${API_BASE}/api/directory/upload-history`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const history = await response.json();
        setUploadHistory(history);
      } else {
        console.error('Failed to fetch upload history');
      }
    } catch (error) {
      console.error('Error fetching upload history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const showMessage = (text, type = 'success') => {
    console.log('showMessage called:', { text, type }); // Debug log
    console.log('Setting message state to:', { text, type });
    setMessage({ text, type });
    setTimeout(() => {
      console.log('Clearing message after timeout');
      setMessage({ text: '', type: '' });
    }, 5000);
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to delete ALL uploaded data? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/directory/clear-all`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        showMessage(`Successfully deleted ${result.deletedCount} listings and upload history`, 'success');
        setUploadHistory([]); // Clear the history
        setFile(null); // Clear the file
        setPreviewData([]); // Clear preview
      } else {
        showMessage('Failed to delete data', 'error');
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      showMessage('Error deleting data', 'error');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file type
      if (!selectedFile.name.match(/\.(xlsx|xls|xlsm|csv)$/)) {
        showMessage('Please select an Excel (.xlsx, .xls, .xlsm) or CSV file.', 'error');
        return;
      }
      
      setFile(selectedFile);
      previewFile(selectedFile);
    }
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // For now, we'll just show the file name and size
        // In a real implementation, you might want to parse Excel/CSV files on the frontend
        setPreviewData([{
          fileName: file.name,
          fileSize: `${(file.size / 1024).toFixed(2)} KB`,
          fileType: file.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }]);
      } catch (error) {
        console.error('Error previewing file:', error);
        setPreviewData([]);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      showMessage('Please select a file to upload.', 'error');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const res = await fetch(`${API_BASE}/api/directory/bulk-upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);
      console.log('Response headers:', res.headers);

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Response not ok, error data:', errorData);
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await res.json();
      
      console.log('Upload response received:', result); // Debug log
      
      // Reset form
      setFile(null);
      setPreviewData([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      const successMessage = `Successfully uploaded ${result.uploadedCount} listings! ${result.errors.length > 0 ? `${result.errors.length} entries had errors.` : ''}`;
      console.log('Showing success message:', successMessage); // Debug log
      showMessage(successMessage);
      
      // Refresh upload history after successful upload
      fetchUploadHistory();
      
      // Show errors if any
      if (result.errors.length > 0) {
        console.log('Upload errors:', result.errors);
        // Show detailed error information
        let errorDetails = result.errors.slice(0, 5).map(err => {
          const sheetInfo = err.sheet ? ` (Sheet: ${err.sheet})` : '';
          return `Row ${err.row}${sheetInfo}: ${err.error}`;
        }).join('\n');
        
        if (result.errors.length > 5) {
          errorDetails += `\n... and ${result.errors.length - 5} more errors`;
        }
        
        alert(`Upload completed with errors:\n\n${errorDetails}\n\nCheck console for full details.`);
      }

    } catch (err) {
      console.error('Upload error caught:', err);
      console.error('Error stack:', err.stack);
      console.error('Error message:', err.message);
      showMessage('Upload failed: ' + err.message, 'error');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleTestParse = async () => {
    if (!file) {
      showMessage('Please select a file to test.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/api/directory/test-parse`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Test parse failed');
      }

      const result = await res.json();
      
      // Show parsing results
      let message = `File: ${result.fileName}\nFormat: ${result.fileExtension}\nTotal Rows: ${result.totalRows}`;
      
      // Add sheet information if available
      if (result.sheets && result.sheets.length > 0) {
        message += '\n\nSheets:';
        result.sheets.forEach(sheet => {
          message += `\n${sheet.name}: ${sheet.rows} rows`;
        });
      }
      
      // Add auto-categorization information
      if (result.autoCategorization) {
        message += '\n\nAuto-Categorization:';
        Object.entries(result.autoCategorization).forEach(([tab, industry]) => {
          message += `\n${tab} → ${industry}`;
        });
      }
      
      message += `\n\nHeaders: ${result.headers.join(', ')}\n\nFirst Row: ${JSON.stringify(result.firstRow, null, 2)}`;
      
      alert(message);
      console.log('Test parse result:', result);

    } catch (err) {
      showMessage('Test parse failed: ' + err.message, 'error');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#90be55';
    e.currentTarget.style.backgroundColor = '#f0f8f0';
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#ddd';
    e.currentTarget.style.backgroundColor = '#fff';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#ddd';
    e.currentTarget.style.backgroundColor = '#fff';
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (!droppedFile.name.match(/\.(xlsx|xls|xlsm|csv)$/)) {
        showMessage('Please select an Excel (.xlsx, .xls, .xlsm) or CSV file.', 'error');
        return;
      }
      setFile(droppedFile);
      previewFile(droppedFile);
    }
  };

  return (
    <>
      <DynamicHeader />
      <div style={{ 
        maxWidth: 800, 
        margin: '340px auto 50px', 
        background: '#fff', 
        borderRadius: 16, 
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)', 
        padding: 32 
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24, color: '#333' }}>
          Admin: Bulk Upload Directory Listings
        </h2>
        
        <div style={{ marginBottom: 24, padding: 16, background: '#f8f9fa', borderRadius: 8, border: '1px solid #e9ecef' }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#495057' }}>📋 File Requirements:</h4>
          <ul style={{ margin: 0, paddingLeft: 20, color: '#6c757d' }}>
            <li>Excel (.xlsx, .xls, .xlsm) or CSV format</li>
            <li>Required Columns: COMPANY, EMAIL, PHONE NUMBER, CONTACT, CATEGORY</li>
            <li>Optional Columns: WEBSITE, SUB-CATEGORY2, IMAGE, LINK, SOCIAL MEDIA, USER</li>
            <li>IMAGE: Full URLs to images (only shown for premium users)</li>
            <li>LINK: Social media URLs</li>
            <li>SOCIAL MEDIA: Platform name (facebook, twitter, linkedin, instagram, etc.)</li>
            <li>USER: Package type (free, pro, premium) - affects display styling</li>
            <li>First row should contain headers</li>
            <li>Maximum file size: 10MB</li>
          </ul>
        </div>

        {/* Message Display */}
        {message.text && (
          <div style={{
            textAlign: 'center',
            marginBottom: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            backgroundColor: message.type === 'error' ? '#f8d7da' : '#d4edda',
            color: message.type === 'error' ? '#721c24' : '#155724',
            border: `1px solid ${message.type === 'error' ? '#f5c6cb' : '#c3e6cb'}`
          }}>
            {message.text}
            <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.7 }}>
              Type: {message.type} | Text: {message.text}
            </div>
            <button 
              onClick={() => setMessage({ text: '', type: '' })}
              style={{
                marginTop: '8px',
                padding: '4px 8px',
                fontSize: '12px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Clear Message
            </button>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div style={{ 
              width: '100%', 
              height: 8, 
              backgroundColor: '#e9ecef', 
              borderRadius: 4,
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${uploadProgress}%`,
                height: '100%',
                backgroundColor: '#90be55',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* File Upload Area */}
          <div
            style={{
              border: '2px dashed #ddd',
              borderRadius: 8,
              padding: 40,
              textAlign: 'center',
              backgroundColor: '#fff',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: 24
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
                          <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.xlsm,.csv"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            
            {!file ? (
              <>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📁</div>
                <h4 style={{ margin: '0 0 8px 0', color: '#495057' }}>
                  Drop your file here or click to browse
                </h4>
                <p style={{ margin: 0, color: '#6c757d' }}>
                  Supports Excel (.xlsx, .xls, .xlsm) and CSV files
                </p>
              </>
            ) : (
              <>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h4 style={{ margin: '0 0 8px 0', color: '#28a745' }}>
                  File Selected: {file.name}
                </h4>
                <p style={{ margin: 0, color: '#6c757d' }}>
                  Click to change file or drag & drop a new one
                </p>
              </>
            )}
          </div>

          {/* File Preview */}
          {previewData.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#495057' }}>File Preview:</h4>
              <div style={{ 
                padding: 16, 
                background: '#f8f9fa', 
                borderRadius: 8, 
                border: '1px solid #e9ecef' 
              }}>
                {previewData.map((item, index) => (
                  <div key={index} style={{ marginBottom: 8 }}>
                    <strong>File:</strong> {item.fileName} ({item.fileSize})
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Test Parse Button */}
          <button
            type="button"
            onClick={handleTestParse}
            disabled={!file || uploading}
            style={{
              width: '100%',
              padding: '12px 24px',
              backgroundColor: !file || uploading ? '#6c757d' : '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: !file || uploading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: 16
            }}
          >
            Test File Parse (Debug)
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!file || uploading}
            style={{
              width: '100%',
              padding: '16px 24px',
              backgroundColor: !file || uploading ? '#6c757d' : '#90be55',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: !file || uploading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {uploading ? 'Uploading...' : 'Upload Directory Listings'}
          </button>
        </form>

        {/* Upload History */}
        <div style={{ 
          marginTop: 32, 
          padding: 20, 
          background: '#f8f9fa', 
          borderRadius: 8, 
          border: '1px solid #e9ecef' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h4 style={{ margin: 0, color: '#495057' }}>📊 Upload History</h4>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={fetchUploadHistory}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                🔄 Refresh
              </button>
              <button
                type="button"
                onClick={handleDeleteAll}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                🗑️ Delete All Data
              </button>
            </div>
          </div>
          
          {loadingHistory ? (
            <p style={{ color: '#6c757d', textAlign: 'center' }}>Loading upload history...</p>
          ) : uploadHistory.length === 0 ? (
            <p style={{ color: '#6c757d', textAlign: 'center' }}>No uploads yet</p>
          ) : (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {uploadHistory.map((upload, index) => (
                <div key={upload._id || index} style={{ 
                  padding: 12, 
                  background: 'white', 
                  borderRadius: 6, 
                  border: '1px solid #dee2e6',
                  marginBottom: 8
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>{upload.originalName}</strong>
                      <div style={{ fontSize: 12, color: '#6c757d', marginTop: 2 }}>
                        {new Date(upload.uploadDate).toLocaleString()} • {upload.fileType.toUpperCase()} • {(upload.fileSize / 1024).toFixed(1)} KB
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        padding: '4px 8px', 
                        borderRadius: 4, 
                        fontSize: 12,
                        fontWeight: 600,
                        backgroundColor: upload.status === 'completed' ? '#d4edda' : upload.status === 'partial' ? '#fff3cd' : '#f8d7da',
                        color: upload.status === 'completed' ? '#155724' : upload.status === 'partial' ? '#856404' : '#721c24'
                      }}>
                        {upload.status.toUpperCase()}
                      </div>
                      <div style={{ fontSize: 12, color: '#6c757d', marginTop: 4 }}>
                        {upload.successfulUploads}/{upload.totalRows} rows
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div style={{ 
          marginTop: 32, 
          padding: 20, 
          background: '#f8f9fa', 
          borderRadius: 8, 
          border: '1px solid #e9ecef' 
        }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#495057' }}>ℹ️ How it works:</h4>
          <ol style={{ margin: 0, paddingLeft: 20, color: '#6c757d' }}>
            <li>Upload your Excel/CSV file with directory listings</li>
            <li>The system will process each row and create directory entries</li>
            <li>Valid entries will be added to the database</li>
            <li>Any errors will be reported back to you</li>
            <li>All listings will appear on the Services page automatically</li>
            <li>You can upload new files without deleting old data</li>
            <li>Use the delete button to clear all data when needed</li>
          </ol>
        </div>
      </div>
      <Footer2 />
    </>
  );
};

export default AdminDirectoryUpload; 