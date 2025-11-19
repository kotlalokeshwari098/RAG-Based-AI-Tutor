from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from rag_model import rag_chain  
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain_core.stores import InMemoryByteStore
from images.imageEmbeddings import image_vectorstore

import asyncio
import shutil
import os
import re

app = FastAPI()


UPLOAD_DIR = "./uploads"  
os.makedirs(UPLOAD_DIR, exist_ok=True)


VECTORSTORE_DIR = "./vectorstore"
os.makedirs(VECTORSTORE_DIR, exist_ok=True)

embedding_function = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

try:
    vectorstore = Chroma(persist_directory=VECTORSTORE_DIR, embedding_function=embedding_function)
except asyncio.CancelledError:
    print("Server startup was cancelled.")

store = InMemoryByteStore()


app.mount("/images", StaticFiles(directory="D:/AI-Tutor-Rag-Project/rag-model/images/images"), name="images")

class ChatRequest(BaseModel):
    topicId: str
    question: str

@app.post("/upload")
async def upload(file: UploadFile = File(...)):

    print("Received file:", file.filename)
    
    filename = file.filename.split(".")[0]  
    topic_id = re.sub(r'\W+', '_', filename.lower()) 


    
    upload_dir = os.path.join("uploads")
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)


    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    
    loader = PyPDFLoader(file_path)
    docs = loader.load()

    
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
    splits = text_splitter.split_documents(docs)
    
   
    vectorstore.add_texts(
        texts=[doc.page_content for doc in splits],
        metadatas=[{"topic_id": topic_id} for _ in splits]
    )
    vectorstore.persist()

    return {"topicId": topic_id}



@app.post("/chat")
async def chat(request: ChatRequest):
    question = request.question
    topic_id = request.topicId


    docs = vectorstore.similarity_search(
    question,
    k=5,
    filter={"topic_id": topic_id}  
)
    print(f"Retrieved {len(docs)} documents for topic_id {topic_id}")


    context = "\n\n".join(doc.page_content for doc in docs)
    # print("Context for RAG chain:", context)

    answer = rag_chain.invoke({"context": context, "question": question})
    # print("Generated answer:", answer)


    image_results = image_vectorstore.similarity_search(
        question,  
        k=1 
    )

    image_data = None
    if image_results:
        img = image_results[0].metadata
        image_data = {
            "id": img["id"],
            "url": f"{os.getenv('BASE_URL')}/images/{os.path.basename(img['filename'])}",
            "filename": img["filename"],
            "title": img["title"],
            "description": img["description"]
        }


    return JSONResponse(content={
        "answer": answer,
        "image": image_data
    })



@app.get("/images/{topic_id}")
async def get_images(topic_id: str):

    image_results = image_vectorstore.similarity_search(
        topic_id,  
        k=1 
    )

    image_data = None
    if image_results:
        img = image_results[0].metadata
        image_data = {
            "id": img["id"],
            "url": f"{os.getenv('BASE_URL')}/images/{os.path.basename(img['filename'])}",
            "filename": img["filename"],
            "title": img["title"],
            "description": img["description"]
        }
    return {"images": [image_data]}

