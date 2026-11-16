import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('build', Path(__file__).with_name('build.py'))
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)


class DeploymentTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name) / 'source'
        self.output = Path(self.temp.name) / 'output'
        (self.root / 'assets').mkdir(parents=True)
        (self.root / 'en').mkdir()
        (self.root / 'en' / 'index.html').write_text('<html lang="en">English</html>', encoding='utf-8')
        for name in ('index.html', 'styles.css', 'app.js', '.nojekyll'):
            (self.root / name).write_text('', encoding='utf-8')

    def test_no_upload_keeps_download_unavailable_and_excludes_private_files(self):
        (self.root / 'private.txt').write_text('not public')
        builder.build(self.root, self.output)
        self.assertEqual(json.loads((self.output / 'download.json').read_text()), {'available': False})
        self.assertFalse((self.output / 'private.txt').exists())

    def test_english_page_is_published_without_other_files_from_its_folder(self):
        (self.root / 'en' / 'private.txt').write_text('not public')
        builder.build(self.root, self.output)
        self.assertEqual((self.output / 'en' / 'index.html').read_text(), '<html lang="en">English</html>')
        self.assertFalse((self.output / 'en' / 'private.txt').exists())

    def test_uploaded_apk_becomes_downloadable_without_page_changes(self):
        payload = b'test binary, not a real APK'
        (self.root / 'smart detector.apk').write_bytes(payload)
        result = builder.build(self.root, self.output)
        self.assertTrue(result['available'])
        self.assertEqual(result['url'], 'downloads/smart%20detector.apk')
        self.assertEqual((self.output / 'downloads/smart detector.apk').read_bytes(), payload)
        self.assertEqual(result['size'], len(payload))
        self.assertEqual(result['channel'], 'beta')
        self.assertEqual(result['version'], '')

    def test_published_beta_release_is_supported_and_draft_is_excluded(self):
        asset = {'name': 'app.apk', 'size': 1024, 'state': 'uploaded',
                 'browser_download_url': 'https://github.com/cjyh37/smart-detector/releases/download/v1/app.apk'}
        result = builder.build(self.root, self.output, [
            {'draft': True, 'tag_name': 'private', 'assets': [asset]},
            {'draft': False, 'prerelease': True, 'tag_name': 'v1-beta', 'assets': [asset]}])
        self.assertTrue(result['available'])
        self.assertEqual(result['version'], 'v1-beta')

    def test_ambiguous_or_empty_upload_fails_before_deploy(self):
        (self.root / 'empty.apk').write_bytes(b'')
        with self.assertRaisesRegex(ValueError, 'empty'):
            builder.build(self.root, self.output)
        (self.root / 'another.apk').write_bytes(b'test')
        with self.assertRaisesRegex(ValueError, 'one APK'):
            builder.build(self.root, self.output)


if __name__ == '__main__':
    unittest.main()
