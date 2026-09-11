from pathlib import Path
from docx import Document
import json

root = Path('WebsiteContent')
files = sorted(root.glob('*.docx'))

results = []
for p in files:
    try:
        doc = Document(p)
        paragraphs = [par.text.strip() for par in doc.paragraphs if par.text.strip()]
        text = '\n'.join(paragraphs)
        results.append({
            'name': p.name,
            'text': text[:4000],
            'paragraphs': paragraphs[:80],
        })
    except Exception as exc:
        results.append({
            'name': p.name,
            'error': str(exc)
        })

print(json.dumps(results, indent=2)[:120000])
