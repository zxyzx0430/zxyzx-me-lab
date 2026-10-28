"""Historical proxy comparison ONLY; not user-supplied 1:1 master."""
from pathlib import Path
from PIL import Image, ImageChops, ImageStat, ImageEnhance
src=Path(__file__).parent
reference=Image.open(src/'proxy-1672.jpg').convert('RGB')
actual_path=src/'artifacts/m01-1672x941.png'
if not actual_path.exists():
    raise SystemExit('Missing 1672x941 browser capture')
actual=Image.open(actual_path).convert('RGB')
if actual.size!=reference.size:
    raise SystemExit(f'bad viewport: {actual.size} != {reference.size}')
diff=ImageChops.difference(reference,actual)
score=sum(ImageStat.Stat(diff).mean)/3
overlay=Image.blend(reference,actual,.5)
overlay.save(src/'artifacts/overlay-proxy-1672.png')
ImageEnhance.Contrast(diff).enhance(3).save(src/'artifacts/diff-proxy-1672.png')
(src/'artifacts/score.txt').write_text(f'PROXY IMAGE ONLY; RGB mean absolute error: {score:.3f}/255\n')
print(f'PROXY comparison: RGB mean absolute error={score:.3f}/255')
if score > 8.0: raise SystemExit('Historical proxy regression threshold exceeded (MAE > 8/255)')
print('Visual deliverables: visual/artifacts/overlay-proxy-1672.png and diff-proxy-1672.png')
