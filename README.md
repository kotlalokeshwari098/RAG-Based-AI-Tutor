# RAG-Based AI Tutor

An intelligent document assistant powered by Retrieval-Augmented Generation (RAG) that allows users to upload PDF documents and ask questions and get response with contextual answers and relevant images.

## 📋 Project Overview

This project combines modern web technologies with advanced AI to create an interactive learning experience. Users can upload educational PDFs, and the AI assistant will:
- Answer questions based on the document content
- Display relevant images
- Provide contextual and accurate responses

## 🏗️ Architecture

```
AI-Tutor-Rag-Project/
├── client/          # React + TypeScript frontend
├── server/          # Node.js + Express backend
└── rag-model/       # Python RAG pipeline
```

## ✨ Key Features

- 📄 **PDF Upload & Processing**: Automatic text extraction
- 🤖 **AI-Powered Q&A**: Context-aware responses using RAG
- 🖼️ **Image Integration**: Relevant diagrams displayed with answers
- 💬 **Chat Interface**: Modern, responsive chat UI
- 🔍 **Smart Context Retrieval**: Top-N text chunks retrieved from vector store based on semantic similarity to user questions.
- ⚡ **Real-time Processing**: Fast response times
- 🔧 **Extensible Backend**: Easy to add new models, embedding methods, or data sources

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Python 3.8+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd AI-Tutor-Rag-Project
```

2. **Setup Frontend**
```bash
cd client
npm install
npm run dev
```

3. **Setup Backend**
```bash
cd server
npm install
npm run dev
```

4. **Setup RAG Model**
```bash
cd rag-model
python -m venv venv 
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

5. **Configure Environment Variables**
Create `.env` files in respective directories (see individual READMEs)

## 📚 Documentation

- [Frontend Documentation](./client/README.md)
- [Backend Documentation](./server/README.md)
- [RAG Model Documentation](./rag-model/README.md)

## 🛠️ Tech Stack

| Component | Technologies |
|-----------|-------------|
| **Frontend** | React 18, TypeScript, Tailwind CSS, Axios, React Router |
| **Backend** | Node.js, Express, Multer  |
| **Database** | ChromaDB (Vector Store) |
| **RAG Model** | Python, LangChain, HuggingFace Embeddings, Groq LLaMA 3.3, PyMuPDF |

### Detailed Stack

<table>
<tr>
<th>Layer</th>
<th>Technology</th>
<th>Purpose</th>
</tr>
<tr>
<td rowspan="5"><strong>Frontend</strong></td>
<td>React 18</td>
<td>UI Framework</td>
</tr>
<tr>
<td>TypeScript</td>
<td>Type Safety</td>
</tr>
<tr>
<td>Tailwind CSS</td>
<td>Styling</td>
</tr>
<tr>
<td>Axios</td>
<td>HTTP Client</td>
</tr>
<tr>
<td>React Router</td>
<td>Navigation</td>
</tr>
<tr>
<td rowspan="4"><strong>Backend</strong></td>
<td>Node.js</td>
<td>Runtime Environment</td>
</tr>
<tr>
<td>Express</td>
<td>Web Framework</td>
</tr>
<tr>
<td>Multer</td>
<td>File Upload Handling</td>
</tr>
<tr>
<td>UUID</td>
<td>Unique ID Generation</td>
</tr>
<tr>
<td rowspan="1"><strong>Database</strong></td>
<td>ChromaDB</td>
<td>Vector Database for Embeddings</td>
</tr>
<tr>
<td rowspan="5"><strong>RAG Model</strong></td>
<td>Python 3.8+</td>
<td>Programming Language</td>
</tr>
<tr>
<td>LangChain</td>
<td>RAG Framework</td>
</tr>
<tr>
<td>HuggingFace (MiniLM-L6-v2)</td>
<td>Text Embeddings</td>
</tr>
<tr>
<td>Groq LLaMA 3.3</td>
<td>Language Model (LLM)</td>
</tr>
<tr>
<td>PyMuPDF</td>
<td>PDF Processing & Image Extraction</td>
</tr>
</table>

## 📄 License

MIT License

