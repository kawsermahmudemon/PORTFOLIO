import re

with open('c:/PORTFOLIO/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

def replace_thumbnail(match):
    full_match = match.group(0)
    href = match.group(1)
    
    if href.lower().endswith(('.jpg', '.jpeg', '.png')):
        # It's an image, use an img tag
        new_thumb = f'''<div class="cert-thumbnail">
          <img src="{href}" alt="Certificate">
          <div class="cert-meta">REC</div>
          <div class="cert-play-icon">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>'''
        return re.sub(r'<div class="cert-thumbnail">.*?</div>', new_thumb, full_match, flags=re.DOTALL)
    return full_match

# Find all a.cert-card blocks
new_content = re.sub(r'<a href="([^"]+)" class="cert-card"[^>]*>.*?</a>', replace_thumbnail, content, flags=re.DOTALL)

with open('c:/PORTFOLIO/index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
print('Updated thumbnails in index.html')
