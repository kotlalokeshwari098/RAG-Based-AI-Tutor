# 🧠 AI Tutor RAG Model

Retrieval-Augmented Generation (RAG) pipeline for intelligent document Q&A.

## 📖 What is RAG?

**Retrieval-Augmented Generation** is an AI framework that enhances large language models by retrieving relevant information from a knowledge base before generating responses. This approach:

-  Reduces hallucinations
-  Provides context-specific answers
-  Enables document-based Q&A
-  Improves accuracy

### How It Works
```
Question → Retrieve relevant chunks → Pass to LLM → Generate answer
```

## 🏗️ Architecture

### Pipeline Flow

```
1. Client uploads PDF (POST /upload to NodeJS)
   ↓
2. NodeJS (Multer) saves PDF → /uploads/{topicId}/
   ↓
3. NodeJS triggers Python ingestion (app.py -- ingest mode)
   ↓
4. Python ingestion:
     • Load PDF (PyMuPDF / PyPDFLoader)
     • Extract text
     • Chunk text (RecursiveCharacterTextSplitter)
     • Generate text embeddings (HuggingFace MiniLM)
     • Store text embeddings in ChromaDB (collection: {topicId})
   ↓
5. Persist vectorstores and return { topicId } to NodeJS → Client
   ↓
6. Client sends query (POST /chat { question, topicId })
   ↓
7. NodeJS receives query → calls Python 
   ↓
8. Python chat:
     • Embedding question (same embedding model)
     • Retrieve top-N text chunks from ChromaDB filtered by topicId
     • Build context from retrieved chunks
     • Call LLM (Groq LLaMA 3.3) with { context, question } → generate answer
     • Search image embeddings (images_{topicId}) with question embedding (cosine similarity)
     • Select best-matching image and form image metadata + URL
   ↓
9. Python returns JSON { answer, image } to NodeJS
   ↓
10. NodeJS returns final JSON to client (200 OK)

```


## 🛠️ Models Used

### 1. Embedding Model
**Model:** `all-MiniLM-L6-v2` (HuggingFace)
- **Purpose:** Convert text to vector embeddings
- **Dimension:** 384
- **Speed:** Fast
- **Quality:** Good for general text

### 2. Language Model
**Model:** `llama-3.3-70b-versatile` (Groq)
- **Purpose:** Generate answers
- **Context Window:** 8k tokens
- **Speed:** Very fast (Groq LPU)
- **Quality:** High accuracy

### 3. PDF Processing
**Library:** PyMuPDF 
- **Purpose:** Extract text
- **Features:** Fast, accurate, handles layouts

### 4. Vector Store
**Database:** ChromaDB
- **Purpose:** Store and retrieve embeddings
- **Features:** Fast similarity search, persistent storage

## 📁 Folder Structure

```
rag-model/
├── rag-model.py           # Main RAG pipeline
├── rag_api.py             # API wrapper for backend
├── images/      
│    ├── images/              
│    └── imageEmbeddings.py  
│    └── images_metadata.json  
├── RAG_BASED_AI_TUTOR (1).ipynb     # Google collab code
├── .env                             # Environment variables
├── vectorstore                      # Vector database storage
├── requirements.txt                 # Python dependencies          
└── README.md
```

## 🚀 Installation

### Prerequisites
- Python 3.8+
- pip
- Virtual environment (recommended)

### Setup Steps

1. **Create Virtual Environment**
```bash
cd rag-model
python -m venv venv

# Activate
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```

2. **Install Dependencies**
```bash
pip install -r requirements.txt
```

3. **Configure Environment**
Create `.env` file:
```env
GROQ_API_KEY=your_groq_api_key_here
```

Get your Groq API key from: https://console.groq.com


## 📦 Requirements

### requirements.txt
```txt
langchain==0.1.0
langchain-community==0.0.13
langchain-core==0.1.10
langchain-groq==0.0.1
pypdf==3.17.4
PyMuPDF==1.23.8
chromadb==0.4.22
sentence-transformers==2.3.1
huggingface-hub==0.20.3
Pillow==10.1.0
python-dotenv==1.0.0
```

## 🔧 Chunking Strategy

### Configuration
```python
chunk_size = 500        # Characters per chunk
chunk_overlap = 100     # Overlap between chunks
```

### Why This Strategy?

**Chunk Size (500)**
- Balances context and specificity
- Fits well within embedding model limits
- Provides enough context for accurate retrieval

**Chunk Overlap (100)**
- Prevents information loss at boundaries
- Improves retrieval accuracy
- Maintains context across chunks



## 🏃 How to Run

### Basic Usage

```python
# Import the RAG chain
from rag_model import rag_chain

# Ask a question
answer = rag_chain.invoke("What is the speed of sound?")
print(answer)
```


## 📊 Sample Queries

### Example 1: Basic Question
```python
question = "What is sound?"
answer = rag_chain.invoke(question)
```

**Output:**
```
Sound is a type of energy made by vibrations. When an object vibrates, 
it causes movement in surrounding air molecules. These molecules bump 
into the molecules close to them, causing them to vibrate too...
```

### Example 2: Specific Information
```python
question = "What are the characteristics of a sound wave?"
answer = rag_chain.invoke(question)
```

**Output:**
```
Sound waves have three main characteristics:
 Frequency - determines pitch
 Amplitude - determines loudness
 Wavelength - distance between peaks...
```


