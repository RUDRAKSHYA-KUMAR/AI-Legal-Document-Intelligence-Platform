from rag.loader import document_loader
from rag.splitter import document_splitter
from rag.vectorstore import vector_manager
from rag.chain import legal_rag

# Load document
docs = document_loader.load_document("upload/Sample_Employment_Agreement.pdf")

print("Loaded:", len(docs))

# Split
chunks = document_splitter.split_documents(docs)

print("Chunks:", len(chunks))

# Create Vector DB
vector_manager.create_and_save(chunks)

print("Vector DB Created!")

# Ask Questions
while True:
    question = input("\nAsk your question (type 'exit' to quit): ")

    if question.lower() == "exit":
        print("Goodbye!")
        break

    answer = legal_rag.ask(question)

    print("\nAnswer:")
    print(answer)
