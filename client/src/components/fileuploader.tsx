import React, { useState } from "react";

export function FileUploader() {
  const [fileName, setFileName] = useState<string | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <label
        htmlFor="file-upload"
        className="cursor-pointer rounded border border-gray-300 px-6 py-3 bg-white hover:bg-gray-100 transition"
      >
        Datei auswählen
      </label>
      <input
        id="file-upload"
        type="file"
        onChange={onFileChange}
        className="hidden"
      />
      {fileName && (
        <span className="ml-4 text-gray-700 font-medium">{fileName}</span>
      )}
    </div>
  );
}

export default FileUploader;
