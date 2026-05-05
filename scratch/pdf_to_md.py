import fitz  # PyMuPDF
import os

def pdf_to_markdown(pdf_path, md_path):
    doc = fitz.open(pdf_path)
    md_content = ""
    
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        text = page.get_text("text")
        
        # Simple heuristic: treat lines that look like headers
        # or use some block detection if needed.
        # For now, we just append text.
        md_content += f"## Page {page_num + 1}\n\n"
        md_content += text + "\n\n"
        
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(md_content)
    
    doc.close()
    print(f"Converted {pdf_path} to {md_path}")

files_to_convert = [
    "5_tool_test - Postman.pdf",
    "5_unit_test - user-service.pdf",
    "5_system_test - Candidate submits an application.pdf"
]

output_dir = "docs"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

for file_name in files_to_convert:
    input_path = os.path.join(os.getcwd(), file_name)
    output_name = file_name.replace(".pdf", ".md")
    output_path = os.path.join(os.getcwd(), output_dir, output_name)
    
    if os.path.exists(input_path):
        pdf_to_markdown(input_path, output_path)
    else:
        print(f"File not found: {input_path}")
