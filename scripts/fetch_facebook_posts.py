import json, os, re, sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import quote

PAGE_ID = os.environ.get('META_PAGE_ID', '668870639648079')
TOKEN = os.environ.get('META_PAGE_ACCESS_TOKEN')
ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'assets' / 'data'
IMAGES = ROOT / 'assets' / 'img' / 'news'
API_VERSION = os.environ.get('META_API_VERSION', 'v26.0')

if not TOKEN:
    print('Brak META_PAGE_ACCESS_TOKEN', file=sys.stderr)
    sys.exit(1)

DATA.mkdir(parents=True, exist_ok=True)
IMAGES.mkdir(parents=True, exist_ok=True)
fields = 'id,message,created_time,full_picture,permalink_url,attachments{media{image{src}},subattachments{media{image{src}}}}'
url = f'https://graph.facebook.com/{API_VERSION}/{PAGE_ID}/feed?fields={fields}&limit=25&access_token={quote(TOKEN)}'
req = Request(url, headers={'User-Agent': 'OSP-Bialogrady-News/1.0'})
with urlopen(req, timeout=30) as response:
    payload = json.load(response)
if 'error' in payload:
    raise RuntimeError(payload['error'].get('message', 'Facebook API error'))

posts = []
for post in payload.get('data', []):
    post_id = post.get('id', '')
    if not post_id:
        continue
    message = re.sub(r'\s+', ' ', post.get('message', '')).strip()
    if not message:
        message = 'Nowa publikacja OSP Białogrądy.'
    created = post.get('created_time', '')
    try:
        dt = datetime.fromisoformat(created.replace('Z', '+00:00'))
        date = dt.astimezone().strftime('%d.%m.%Y')
        iso = dt.isoformat()
    except ValueError:
        date, iso = '', created
    safe_id = re.sub(r'[^a-zA-Z0-9_-]', '_', post_id)
    image_path = ''
    image_url = post.get('full_picture')
    if not image_url:
        attachments = post.get('attachments', {}).get('data', [])
        for attachment in attachments:
            media = attachment.get('media', {}) or {}
            image_url = (media.get('image', {}) or {}).get('src')
            if image_url:
                break
            for nested in (attachment.get('subattachments', {}) or {}).get('data', []):
                nested_media = nested.get('media', {}) or {}
                image_url = (nested_media.get('image', {}) or {}).get('src')
                if image_url:
                    break
            if image_url:
                break
    if image_url:
        target = IMAGES / f'{safe_id}.jpg'
        try:
            image_req = Request(image_url, headers={'User-Agent': 'OSP-Bialogrady-News/1.0'})
            with urlopen(image_req, timeout=30) as image_response:
                target.write_bytes(image_response.read())
            image_path = f'assets/img/news/{target.name}'
        except Exception as exc:
            print(f'Nie udało się pobrać zdjęcia {post_id}: {exc}', file=sys.stderr)
    posts.append({'id': post_id, 'text': message, 'date': date, 'created_time': iso, 'image': image_path, 'url': post.get('permalink_url', f'https://www.facebook.com/{post_id}')})

(DATA / 'posts.json').write_text(json.dumps({'updated_at': datetime.now(timezone.utc).isoformat(), 'posts': posts}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Zapisano {len(posts)} postów')
