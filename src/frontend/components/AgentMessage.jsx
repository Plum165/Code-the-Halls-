export default function AgentMessage({ sender, text, file }) {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <div className={`chat-message ${sender}`}>
        {text}
      </div>
      
      {file && (
        <div className={`file-message ${sender}`}>
          <div className="file-details">
            <div className="file-name">{file.name}</div>
            <div className="file-meta">
              {formatFileSize(file.size)} • Uploaded at {file.uploadedAt}
            </div>
          </div>
        </div>
      )}
    </>
  );
}