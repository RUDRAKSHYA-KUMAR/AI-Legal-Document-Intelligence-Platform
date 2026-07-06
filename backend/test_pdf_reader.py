from app.utils.pdf_reader import extract_document

result = extract_document(
    "app/uploads/67d5a115-957a-4261-9f6d-2009742e0cf2.pdf"
)

print(result["preview"])
print(result["page_count"])
print(result["metadata"])
print(len(result["text"]))