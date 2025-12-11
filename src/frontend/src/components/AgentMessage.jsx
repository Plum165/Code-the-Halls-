export default function AgentMessage({ sender, text, file, recorded, mockConsent }) {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Determine CSS classes
  let messageClass = `chat-message ${sender}`;
  if (recorded) messageClass += ' recorded';
  if (mockConsent) messageClass += ' mock-consent';
  if (sender === "system") {
  return <div className="system-message">{text}</div>;
}

  return (
    <>
      <div className={messageClass}>
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

