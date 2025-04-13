import React from "react";

const UploadButton = ({ onUpload, multiple, accept, directory, webkitdirectory }) => {
  const handleFileChange = (event) => {
    console.log('File selection event triggered');
    console.log('Files selected:', event.target.files);
    if (onUpload) {
      onUpload(event);
    }
  };

  return (
    <div className="file-field input-field">
      <div className="btn">
        <span>{directory ? "Select Folder" : "Select File"}</span>
        <input
          type="file"
          onChange={handleFileChange}
          multiple={multiple}
          accept={accept}
          directory={directory ? "directory" : undefined}
          webkitdirectory={webkitdirectory ? "webkitdirectory" : undefined}
          style={{ 
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            opacity: 0,
            cursor: 'pointer'
          }}
        />
      </div>
      <div className="file-path-wrapper">
        <input 
          className="file-path validate" 
          type="text" 
          placeholder={directory ? "Select a folder containing FBX files" : "Select a file"}
          readOnly
        />
      </div>
    </div>
  );
};

export default UploadButton;
