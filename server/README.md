# AI Tutor Backend

Node.js + Express backend server for the RAG-Based AI Tutor application.

## 📖 Introduction

The backend serves as the bridge between the frontend and the RAG model, handling file uploads, processing requests, and coordinating with the Python RAG pipeline.

## ✨ API Features

- 📤 **File Upload**: Accept and store PDF files
- 🖼️ **Image Extraction**: Extract images from PDFs using Python
- 💾 **Metadata Storage**: Generate and store image metadata
- 🤖 **RAG Integration**: Interface with Python RAG model
- 🔍 **Smart Image Retrieval**: Match images to query keywords
- 📂 **File Serving**: Serve extracted images

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 16+ | Runtime |
| Express | 4.18+ | Web Framework |
| Multer | 1.4+ | File Upload |
| CORS | 2.8+ | Cross-Origin |

## 📁 Server Structure

```
server/
├── src/
│   ├── controllers/
│   │   └── controller.js   
│   ├── middleware/
│   │   └── multer.middleware.js    
│   ├── routes/
│   │   └── routes.js              # API routes configuration
│   ├── public/              
│   └── index.js                   # Main server entry point
├── .env                           # (git ignored)
│── node_modules                   # (git ignored)
│── .gitignore                  
├── package.json
├── package-lock.json
└── README.md
```

### File Descriptions

- **index.js**: Main server file with Express configuration, middleware setup, and server initialization
- **routes.js**: Central route handler that imports and uses controllers
- **controller.js**: Handles PDF upload, calls Python image extraction, stores metadata and Processes chat queries, interfaces with RAG model, finds relevant images
- **public/**: Directory for storing uploaded PDFs

## 🚀 Installation

### Prerequisites
- Node.js 16.x or higher
- npm
- Python 3.8+ (for RAG model integration)

### Setup Steps

1. **Install Dependencies**
```bash
cd server
npm install
```

2. **Configure Environment**
Create `.env` file:
```env
PORT=5000
PYTHON_URL=http://localhost:8000
```

3. **Start Server**
```bash
npm run dev
```


## API Documentation

### Base URL
```
http://localhost:5000/
```

### Endpoints

#### 1. Upload PDF File

**Endpoint:** `POST /api/uploadFile`

**Description:** Upload a PDF file

**Request:**
```http
POST /api/uploadFile
Content-Type: multipart/form-data

Body:
  file: <PDF file>
```

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "topicId": "550e8400-e29b-41d4-a716-446655440000"
  },
  "statusCode": 201
}
```

**Status Codes:**
- `201` - Success
- `500` - Server error

**Error Response:**
```json
{
  "success": false,
  "message": "File upload failed",
  "data": {
    "error": "Error message here"
  },
  "statusCode": 500
}
```

---

#### 2. Chat Query

**Endpoint:** `POST /api/chat`

**Description:** Send a question and receive an AI-generated answer with relevant image

**Request:**
```http
POST /api/chat
Content-Type: application/json

{
  "question": "What is the wavelength of sound?",
  "topicId": "sound"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Chat response received",
  "data": {
    "answer": "The wavelength of sound is the distance between...",
    "image": "imageUrl"
  },
  "statusCode": 200
}
```

**Status Codes:**
- `200` - Success
- `500` - RAG model error

**Error Response:**
```json
{
  "success": false,
  "message": "Error processing chat request",
  "data": {
    "error": "Error message here"
  },
  "statusCode": 500
}
```

---

#### 3. Get Images Metadata

**Endpoint:** `GET /api/images/:topicId`

**Description:** Retrieve all image metadata for a topic

**Request:**
```http
GET /api/images/id
```

**Response:**
```json
{
  "success": true,
  "message": "Images retrieved successfully",
  "data": {
    "images": [
      {
        "id": "img_001",
        "filename": "topicId_img_001.png",
        "title": "Bell Vibration",
        "keywords": ["bell", "vibration", "sound"],
        "description": "Bell vibration diagram",
        "page_number": 1,
        "width": 800,
        "height": 600
      }
    ]
  },
  "statusCode": 200
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error retrieving images",
  "data": {
    "error": "Error message here"
  },
  "statusCode": 500
}
```

---

### Chat Query Flow

1. Receive question and topicId
2. Call Python script `app.py`
3. Get answer from RAG model
4. Find relevant image using embedding matching (question and image embeddings)
5. Return answer + image URL


## 📦 Models & Data Flow

### File Upload Pipeline
```
 Client
   |
   | POST /upload (PDF)
   v
 NodeJS (Multer)
   |
   | Save PDF → /uploads
   v
 controller.js
   |
   | Generate topicId
   | Call Python → ingest
   v
 Python
   |
   | Load PDF
   | Extract text
   | Chunk text
   | Embedding text chunks
   | Store text embeddings in ChromaDB
   |
   v
 Return { topicId } to NodeJS (backend) → Client (frontend)

```

### Chat Pipeline
```
  Client
   |
   | POST /api/chat  { question, topicId }
   v
  NodeJS controller.js
   |
   | Spawn Python → /chat endpoint
   v
  Python (/chat)
   |
   | 1️⃣ Receive question + topicId
   |
   | 2️⃣ Retrieve relevant text chunks from ChromaDB
   |      vectorstore.similarity_search(
   |        question, k=5, filter={topic_id}
   |      )
   |
   |    → Builds context from retrieved docs
   |
   | 3️⃣ Generate answer using RAG chain
   |      rag_chain.invoke({ context, question })
   |
   | 4️⃣ Perform IMAGE similarity search
   |      image_vectorstore.similarity_search(
   |        question, k=1
   |      )
   |
   |    → image embeddings were pre-stored
   |    → Find the best matching image
   |
   | 5️⃣ Build image metadata:
   |      { id, filename, title, description,
   |        url: /images/<image_file> }
   |
   | 6️⃣ Return JSON:
   |      { answer, image }
   v
  NodeJS  (backend)
   |
   | Sends final response to frontend
   v
  Client receives:
   - Answer (text)
   - Image (best match)


```

## 🐛 Error Handling

```javascript
try {
  // Operation
} catch (error) {
  console.error('Error:', error)
  res.status(500).json({ 
    error: 'Operation failed',
    message: error.message 
  })
}
```


## 📄 License

MIT
