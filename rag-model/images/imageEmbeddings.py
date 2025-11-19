import json
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Path to your images JSON
IMAGE_JSON_PATH = "D:/AI-Tutor-Rag-Project/rag-model/images/images_metadata.json"
VECTORSTORE_DIR = "D:/AI-Tutor-Rag-Project/rag-model/images/vectorstore_images"

# Loading the image metadata.json
with open(IMAGE_JSON_PATH, "r", encoding="utf-8") as f:
    image_data = json.load(f)

# Preprocessing the  metadata
for img in image_data:
    if "keywords" in img and isinstance(img["keywords"], list):
        img["keywords"] = ", ".join(img["keywords"])

# Preparing texts, ids, and metadata
texts = [img["description"] for img in image_data]
ids = [img["id"] for img in image_data]
metadatas = image_data  

# Creating embedding function
embedding_function = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Creating Chroma vectorstore
image_vectorstore = Chroma.from_texts(
    texts=texts,
    embedding=embedding_function,
    metadatas=metadatas,
    ids=ids,
    persist_directory=VECTORSTORE_DIR
)

# Persisting vectorstore
image_vectorstore.persist()

print(f"Stored {len(texts)} image embeddings in {VECTORSTORE_DIR}")
