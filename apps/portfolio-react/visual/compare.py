"""Strict M01 visual comparison against the SHA-verified original user PNG.
The prior historical JPG is never read by this file.
"""
from pathlib import Path
from PIL import Image, ImageChops, ImageStat
import hashlib, json, numpy as np, cv2

HERE=Path(__file__).resolve().parent
MASTER=HERE.parents[2]/'docs/design-references/m01-poster-v2-target.png'
ACTUAL=HERE/'artifacts/m01-1672x941.png'
OUT=HERE/'artifacts'
SHA='f28b1294ca511661d1ed6ce8bddcd524fdf9d50f8ac5428eac6362d3e6333257'
if hashlib.sha256(MASTER.read_bytes()).hexdigest()!=SHA:
    raise SystemExit('Incorrect master PNG SHA-256')
master=Image.open(MASTER).convert('RGB')
actual=Image.open(ACTUAL).convert('RGB')
if master.size != (1672,941) or actual.size!=master.size:
    raise SystemExit(f'Image dimensions invalid: master={master.size}, actual={actual.size}')
a=np.array(master,dtype=np.int16)
b=np.array(actual,dtype=np.int16)
delta=np.abs(a-b)
pixel_error=delta.mean(axis=2)
regions={
 'brand_navigation':(34,8,1640,100),
 'giant_upper':(61,112,525,420),
 'find':(512,232,770,366),
 'outline_center':(522,342,838,481),
 'giant_lower':(127,412,622,747),
 'explore':(605,491,890,635),
 'world':(597,611,886,779),
 'mountain_collage':(12,413,233,515),
 'portrait_photo':(805,67,1600,935),
 'lower_captions':(42,723,793,935),
 'paper_blank_top':(260,0,580,110),
 'orbit_crossings':(0,185,940,828),
}
report={'reference':'docs/design-references/m01-poster-v2-target.png',
 'reference_sha256':SHA,'size':list(master.size),
 'overall':{'mae_rgb':round(float(delta.mean()),4),'p95_pixel_mae':round(float(np.percentile(pixel_error,95)),3),'pixels_over_20pct':round(float((pixel_error>20).mean()*100),3)},'regions':{}}
for label,(x0,y0,x1,y1) in regions.items():
    r=delta[y0:y1,x0:x1]
    report['regions'][label]={'reference_box':[x0,y0,x1,y1],'mae_rgb':round(float(r.mean()),3),
      'pixels_over_20pct':round(float((r.mean(axis=2)>20).mean()*100),3)}
    print(f'{label:19s} MAE {report["regions"][label]["mae_rgb"]:6.3f}')
print('TRUE MASTER RGB MAE',report['overall']['mae_rgb'])
(OUT/'master-regions.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
Image.blend(master,actual,.5).save(OUT/'overlay-master-1672.png')
Image.fromarray(np.uint8(np.clip(delta*3,0,255))).save(OUT/'diff-master-1672.png')
norm=np.clip(pixel_error.astype(np.float32)*4,0,255).astype('uint8')
heat=cv2.applyColorMap(norm,cv2.COLORMAP_TURBO)
Image.fromarray(cv2.cvtColor(heat,cv2.COLOR_BGR2RGB)).save(OUT/'heatmap-master-1672.png')
side=Image.new('RGB',(3344,941))
side.paste(master,(0,0));side.paste(actual,(1672,0))
side.save(OUT/'side-by-side-master-1672.png')
# This is a regression guard, not a claim of exact visual approval.
if report['overall']['mae_rgb']>16:
    raise SystemExit('Actual-source visual regression exceeded 16/255')
