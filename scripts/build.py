"""Build public site assets, preferring the configured Google Play destination."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]


def google_play_download(root):
    config = root / 'download.json'
    if not config.is_file():
        return None
    info = json.loads(config.read_text(encoding='utf-8'))
    if info.get('channel') != 'google-play':
        return None
    if info.get('url') != 'https://play.google.com/store/apps/details?id=ai.fwth.smartdetector':
        raise ValueError('Unexpected Google Play destination')
    return info


def release_download(releases, repository):
    for release in releases:
        if release.get('draft'):
            continue
        assets = [a for a in release.get('assets', [])
                  if a.get('name', '').lower().endswith('.apk') and a.get('size', 0) > 0
                  and a.get('state') == 'uploaded']
        if not assets:
            continue
        assets.sort(key=lambda a: (a['name'] == 'smart-detector.apk', a.get('updated_at', '')), reverse=True)
        asset = assets[0]
        url = asset['browser_download_url']
        if not url.startswith(f'https://github.com/{repository}/releases/download/'):
            raise ValueError('Unexpected release asset origin')
        return {'available': True, 'url': url, 'filename': asset['name'],
                'version': release.get('tag_name', ''), 'size': asset['size']}
    return {'available': False}


def build(root, output, releases=None, repository='cjyh37/smart-detector'):
    output.mkdir(parents=True, exist_ok=True)
    for name in ('index.html', 'styles.css', 'app.js', '.nojekyll', 'robots.txt', 'sitemap.xml'):
        shutil.copy2(root / name, output / name)
    (output / 'en').mkdir(exist_ok=True)
    shutil.copy2(root / 'en' / 'index.html', output / 'en' / 'index.html')
    shutil.copytree(root / 'assets', output / 'assets', dirs_exist_ok=True)
    store = google_play_download(root)
    if store is not None:
        (output / 'download.json').write_text(json.dumps(store, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        return store
    local_apks = [p for folder in (root, root / 'downloads') if folder.is_dir()
                  for p in folder.iterdir() if p.is_file() and p.suffix.lower() == '.apk']
    if len(local_apks) > 1:
        raise ValueError('Keep one APK in the repository; use GitHub Releases for version history.')
    if local_apks:
        apk = local_apks[0]
        if apk.stat().st_size == 0:
            raise ValueError('The uploaded APK is empty.')
        target = output / 'downloads' / apk.name
        target.parent.mkdir(exist_ok=True)
        shutil.copy2(apk, target)
        digest = hashlib.sha256()
        with apk.open('rb') as stream:
            for chunk in iter(lambda: stream.read(1024 * 1024), b''):
                digest.update(chunk)
        info = {'available': True, 'url': 'downloads/' + quote(apk.name),
                'filename': apk.name, 'version': '', 'channel': 'beta', 'size': apk.stat().st_size,
                'sha256': digest.hexdigest()}
    else:
        info = release_download(releases or [], repository)
    (output / 'download.json').write_text(json.dumps(info, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    return info


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--github-repository')
    args = parser.parse_args()
    releases = []
    if args.github_repository and google_play_download(ROOT) is None:
        # GH_TOKEN is supplied by Actions, never embedded in this repository or site.
        result = subprocess.run(['gh', 'api', f'repos/{args.github_repository}/releases?per_page=100'],
                                capture_output=True, text=True, encoding='utf-8', check=True,
                                creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
        releases = json.loads(result.stdout)
    info = build(ROOT, ROOT / 'dist', releases, args.github_repository or 'cjyh37/smart-detector')
    print('Site built. Download: ' + (info['url'] if info['available'] else 'not available'))
