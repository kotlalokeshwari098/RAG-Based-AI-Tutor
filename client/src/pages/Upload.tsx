import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios";
const Upload = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/uploadFile`, formData);
       
      // console.log(response)
      
      if (response.data.statusCode === 201) {
        navigate(`/chat/${response.data.data.topicId}`);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.log("error", error);
      alert('Failed to upload file. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Upload Your Document
          </h1>
          <p className="text-gray-600 text-lg">
            Start learning with AI-powered insights
          </p>
        </div>
        
        <div className="space-y-4">
          <label 
            htmlFor="file-upload"
            className={`
              flex flex-col items-center justify-center w-full h-64
              border-2 border-dashed rounded-lg cursor-pointer
              transition-all duration-200
              ${loading 
                ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
                : 'border-indigo-300 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-400'
              }
            `}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {loading ? (
                <>
                  <svg 
                    className="w-12 h-12 text-indigo-500 animate-spin mb-4" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <p className="text-lg font-semibold text-gray-700">
                    Processing your PDF...
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    This may take a few moments
                  </p>
                </>
              ) : (
                <>
                  <svg 
                    className="w-12 h-12 mb-4 text-indigo-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                    />
                  </svg>
                  <p className="mb-2 text-lg font-semibold text-gray-700">
                    Click to upload PDF
                  </p>
                  <p className="text-sm text-gray-500">
                    or drag and drop
                  </p>
                  {selectedFile && (
                    <p className="mt-3 text-sm text-indigo-600 font-medium">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </>
              )}
            </div>
            <input 
              id="file-upload"
              type="file" 
              accept=".pdf"
              onChange={handleFileChange}
              disabled={loading}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Upload;