"""Extract only independently movable art layers from the verified user PNG.
Never export the full poster as a website image/background.
Original SHA-256 MUST match; output assets serve typography and photo components.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import cv2, numpy as np, hashlib
ROOT=Path(__file__).resolve().parents[3]
source=ROOT/'docs/design-references/m01-poster-v2-target.png'
assert hashlib.sha256(source.read_bytes()).hexdigest()=='f28b1294ca511661d1ed6ce8bddcd524fdf9d50f8ac5428eac6362d3e6333257'
im=Image.open(source).convert('RGB')
assert im.size==(1672,941)
out=Path(__file__).resolve().parents[1]/'src/modules/m01/assets'
out.mkdir(exist_ok=True)
# Bounds are measured against the original (no scaling/registration).
boxes={
'into':(72,119,523,416),
'find':(514,239,765,362),
'center':(524,343,837,475),
'out':(133,422,620,738),
'explore':(616,499,882,632),
'world':(601,617,882,774),
}
for name,rect in boxes.items():
    crop=np.asarray(im.crop(rect)).copy()
    gray=cv2.cvtColor(crop,cv2.COLOR_RGB2GRAY)
    black=(gray<165).astype('uint8')*255
    if name in ('into','find','out','explore'):
        base=cv2.morphologyEx(black,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
        n, labels, stats, _=cv2.connectedComponentsWithStats(base)
        core=np.zeros_like(black)
        for i in range(1,n):
            if stats[i,cv2.CC_STAT_AREA]>=20:
                core[labels==i]=255
        footprint=cv2.dilate(core,np.ones((7,7),np.uint8),iterations=1)
    else:
        # Thin outline strokes cannot be eroded with a 3px morphological opening.
        footprint=cv2.dilate(black,np.ones((3,3),np.uint8))
    ink=np.clip((210-gray.astype('float32'))/95,0,1)
    # Preserve source ink texture and smooth glyph antialiasing, not the surrounding paper.
    mask=(footprint.astype('float32')/255)*ink
    alpha=np.uint8(np.clip(mask*255,0,255))
    rgba=np.dstack((crop,alpha))
    Image.fromarray(rgba,'RGBA').save(out/f'master-{name}.png',optimize=True)
    print(name,rect,'mask pct',round((alpha>30).mean(),3))
# Photo is an independent cropped asset, preserving source photographic lighting
# and grain. The polygon only cuts the frame; no full-poster raster is exported.
rect=(804,65,1604,936)
cut=im.crop(rect).convert('RGBA')
poly=[(822,112),(1520,70),(1590,872),(894,926)] # absolute artboard points
poly=[(x-rect[0],y-rect[1]) for x,y in poly]
mask=Image.new('L',cut.size,0)
ImageDraw.Draw(mask).polygon(poly,fill=255)
cut.putalpha(mask)
# User-requested localized correction (2026-10-28): the upper-left light leak
# should be gray-black, not bright cream. Keep portrait, grain and alpha intact.
# The feathered mask is constrained to x < 365 / y < 385 in the *crop*.
rgba=np.array(cut)
hh,ww=rgba.shape[:2]
light_leak=np.zeros((hh,ww),np.uint8)
cv2.fillPoly(light_leak,[np.array([(-50,-80),(315,-80),(385,225),(205,315),(-50,245)],np.int32)],255)
light_leak=cv2.GaussianBlur(light_leak.astype('float32')/255,(0,0),26)
light_leak*=np.clip((385-np.arange(hh,dtype='float32'))/65,0,1)[:,None]
light_leak*=np.clip((365-np.arange(ww,dtype='float32'))/65,0,1)[None,:]
light_leak*=rgba[:,:,3].astype('float32')/255
original_rgb=rgba[:,:,:3].astype('float32')
lum=.2126*original_rgb[:,:,0]+.7152*original_rgb[:,:,1]+.0722*original_rgb[:,:,2]
gray_lum=lum-np.maximum(lum-105,0)*.96*light_leak
local_weight=(light_leak*.88)[:,:,None]
rgba[:,:,:3]=np.clip(original_rgb*(1-local_weight)+gray_lum[:,:,None]*local_weight,0,255).astype('uint8')
cut=Image.fromarray(rgba,'RGBA')
cut.save(out/'master-portrait.png',optimize=True)
# Exact mountain photo fragment is separate; outside of the strip remains transparent.
rect=(20,421,214,512)
m=im.crop(rect).convert('RGBA')
mask=Image.new('L',m.size,0)
ImageDraw.Draw(mask).polygon([(0,16),(194,6),(194,69),(0,91)],fill=255)
m.putalpha(mask)
m.save(out/'master-mountain.png',optimize=True)
# Tiny clean paper-only tile, NOT the full poster.
im.crop((285,10,477,106)).save(out/'master-paper-tile.png',optimize=True)
print('layers generated', len(list(out.glob('master-*'))))
