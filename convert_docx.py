import os
from docx2python import docx2python

def convert():
    docx_file = "bao-cao.docx"
    output_dir = "docs"
    image_dir = os.path.join(output_dir, "media")
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # docx2python extracts images to the specified folder
    with docx2python(docx_file, image_folder=image_dir) as docx_content:
        # Get text in markdown format (docx2python has a .text property that is somewhat structured)
        # It uses placeholders like ----image1.png---- for images
        text = docx_content.text
        
        # Replace image placeholders with markdown syntax
        # docx2python images are usually named image1.png, image2.png etc.
        # The placeholders look like ----image1.png----
        import re
        def replace_image(match):
            img_name = match.group(1)
            return f"![{img_name}](media/{img_name})"
        
        md_text = re.sub(r'----(image\d+\.\w+)----', replace_image, text)
        
        # Save to markdown file
        with open(os.path.join(output_dir, "bao-cao.md"), "w", encoding="utf-8") as f:
            f.write(md_text)
            
    print(f"Successfully converted {docx_file} to {output_dir}/bao-cao.md")
    print(f"Images extracted to {image_dir}")

if __name__ == "__main__":
    convert()
