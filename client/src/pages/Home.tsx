import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center max-w-4xl ">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">
          RAG-Based AI Tutor
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your Intelligent Document Assistant
        </p>

        {/* Feature Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              1. Upload PDF
            </h3>
            <p className="text-gray-600">
              Upload your educational PDF document and let AI analyze it
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              2. Ask Questions
            </h3>
            <p className="text-gray-600">
              Ask any question related to your uploaded document
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              3. Get Answers
            </h3>
            <p className="text-gray-600">
              Receive accurate answers with relevant images
            </p>
          </div>
        </div>

        <Link 
          to="/upload"
          className="inline-block px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          Get Started
        </Link>
      </div>
    </div>
  )
}

export default Home