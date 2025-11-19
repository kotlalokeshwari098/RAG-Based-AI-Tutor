from dotenv import load_dotenv
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq


load_dotenv()

# Prompt template
prompt_template = """
You are a helpful tutor. Use the following lesson content to answer the question.
Only use the information provided below. Do not make up answers.
You should always complete the answer with "What more topics you want to cover? Happy to help!"

Start your answer with a sentence, for example:
- "Based on the lesson content, ..."
- "According to the provided material, ..."
- "From the study material, we learn that ..."

Lesson Content:
{context}

Question:
{question}

Please provide a detailed, structured answer (use bullet points where necessary) based only on the given context.
"""
prompt = ChatPromptTemplate.from_template(prompt_template)

# Function to format retrieved docs
def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

# LLM
llm = ChatGroq(model='llama-3.3-70b-versatile')

# RAG chain
rag_chain = (
    {
        "context": RunnablePassthrough(),
        "question": RunnablePassthrough()
    }
    | prompt
    | llm
    | StrOutputParser()
)