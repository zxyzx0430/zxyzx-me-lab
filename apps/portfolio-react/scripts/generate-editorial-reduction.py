from pathlib import Path
import json,hashlib,cv2
import numpy as np
from PIL import Image
ROOT=Path(__file__).resolve().parents[1] / 'src' / 'modules' / 'm01'
OUT=ROOT/'world-assets'/'reduction'; OUT.mkdir(parents=True,exist_ok=True)
PICK={
'within':['type-left-index','type-top-self','type-mid-thinking','type-bottom-meaning','type-top-right','type-right-quote','type-body-en','rail-upper-arc','rail-lower-path','rail-diagonal','survey-crosshairs'],
'beyond':['copy-folio','rail-upper-diagonal','rail-right-curve','rail-city-line','rail-lower-diagonal','cross-folio','cross-bottom']
}
report={'baseCommit':'1274f70','strategy':'Non-destructive layer omission; small-region inpaint trial; original master unchanged'}
for world,names in PICK.items():
  base=ROOT/'world-assets'/'deep'/world
  manifest=json.loads((base/'layer-manifest.json').read_text(encoding='utf8'))
  byid={l['id']:l for l in manifest['layers']}
  target=ROOT/'assets'/f'{world}-target-1536x864.png'
  original=np.array(Image.open(target).convert('RGB'))
  mask=np.zeros((864,1536),dtype=np.uint8)
  for name in names:
    l=byid[name]; b=l.get('bounds') or l.get('canvasBounds')
    x,y,w,h=[int(b[k]) for k in ('x','y','width','height')]
    a=np.array(Image.open(base/l['asset']).convert('RGBA'))[:,:,3]
    assert a.shape==(h,w),(name,a.shape,(w,h))
    mask[y:y+h,x:x+w]=np.maximum(mask[y:y+h,x:x+w],np.where(a>0,255,0).astype(np.uint8))
  # Remove fragmented mask remnants for a small number of archival captions.
  cleanup_boxes={
    'within':[(56,110,69,98)],
    'beyond':[(1430,25,82,65)]
  }
  for x,y,w,h in cleanup_boxes[world]:
    mask[y:y+h,x:x+w]=255
  mask=cv2.dilate(mask,np.ones((3,3),np.uint8),iterations=1)
  restored=cv2.cvtColor(cv2.inpaint(cv2.cvtColor(original,cv2.COLOR_RGB2BGR),mask,3,cv2.INPAINT_TELEA),cv2.COLOR_BGR2RGB)
  rgba=np.dstack([restored,mask])
  Image.fromarray(rgba,'RGBA').save(OUT/f'{world}-quiet-restoration.png',optimize=True)
  preview=original.copy();preview[mask>0]=restored[mask>0]
  Image.fromarray(preview,'RGB').save(OUT/f'{world}-quiet-review.jpg',quality=94,subsampling=0)
  report[world]={'removedLayers':names,'removedCount':len(names),'remainingLayerCount':40-len(names),'patchedPixels':int(np.count_nonzero(mask)),'patchedPercent':round(np.count_nonzero(mask)/mask.size*100,2),'referenceSha256':hashlib.sha256(target.read_bytes()).hexdigest()}
(OUT/'reduction-spec.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
print('FINISHED',report['within'],report['beyond'])