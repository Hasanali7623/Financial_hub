import os
import re

dir_path = 'src'

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    orig_content = content
    
    # Tooltip replacements
    content = re.sub(
        r'contentStyle=\{\{\s*borderRadius:\s*12,\s*border:\s*["\']none["\'],',
        r'contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", color: "var(--color-text-primary)",',
        content
    )

    if content != orig_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated Tooltips in {filepath}")

for root, dirs, files in os.walk(dir_path):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            process_file(os.path.join(root, file))
