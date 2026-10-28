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
# Remove only the cream-colored paper artefact baked into the very left wall
# edge by 「寻」. Keep the ORIGINAL portrait crop/alpha and all other lighting.
photo=np.asarray(cut).copy()
rgb=photo[:,:,:3].astype('float32')
h,w=photo.shape[:2]
photo_mask=np.zeros((h,w),np.uint8)
edge_pts=np.array([
    (865,518),(905,514),(905,558),(897,590),(886,616),
    (884,652),(884,697),(860,697),(855,632),(862,591)
],dtype=np.int32)-np.array([804,65],dtype=np.int32)
cv2.fillPoly(photo_mask,[edge_pts],255)
soft=cv2.GaussianBlur(photo_mask.astype('float32')/255,(0,0),3.5)
brightness=.2126*rgb[:,:,0]+.7152*rgb[:,:,1]+.0722*rgb[:,:,2]
repair=soft*(photo[:,:,3].astype('float32')/255)*np.clip((brightness-68)/75,0,1)
sample_x=np.minimum(np.arange(w)+65,w-1)
wall_rgb=rgb[:,sample_x,:]
photo[:,:,:3]=np.uint8(np.clip(rgb*(1-repair[:,:,None])+wall_rgb*repair[:,:,None],0,255))
# Must not change alpha or any part of the face, hair, shoulder or light beam.
assert np.array_equal(photo[:,:,3],np.asarray(cut)[:,:,3])
assert np.array_equal(photo[:420],np.asarray(cut)[:420])
assert np.array_equal(photo[:,135:],np.asarray(cut)[:,135:])
cut=Image.fromarray(photo,'RGBA')
cut.save(out/'master-portrait.png',optimize=True)
# Exact mountain photo fragment is separate; outside of the strip remains transparent.
rect=(20,421,214,512)
m=im.crop(rect).convert('RGBA')
mask=Image.new('L',m.size,0)
ImageDraw.Draw(mask).polygon([(0,16),(194,6),(194,69),(0,91)],fill=255)
m.putalpha(mask)
m.save(out/'master-mountain.png',optimize=True)
# Independent photographic wall extension for the small pale seam right of 「寻」.
# Kept BEHIND the typographic ink and original photo frame; the portrait pixels,
# portrait alpha, all six extracted word assets and the master stay unchanged.
# Match its original paper/film grain by borrowing pixels from the photograph
# 75px to the right rather than painting a flat gray CSS rectangle.
seam_box=(798,505,902,715)
sx0,sy0,sx1,sy1=seam_box
yy,xx=np.mgrid[sy0:sy1,sx0:sx1].astype('float32')
photo_edge=822+(yy-112)*(72.0/814)
ramp_in=np.clip((yy-522)/28,0,1)
ramp_out=np.clip((684-yy)/34,0,1)
extension=21*ramp_in*ramp_out
left=photo_edge-extension
# Fade at the left edge, and do not produce a hard vertical rectangle.
alpha=np.clip((xx-left)/13,0,1)*np.clip((photo_edge+9-xx)/11,0,1)
alpha=np.uint8(np.clip(alpha*185,0,255))
base=np.asarray(im)
sample_x=np.clip(xx.astype('int32')+75,0,base.shape[1]-1)
sample_y=yy.astype('int32')
wall=base[sample_y,sample_x]
seam=np.dstack((wall,alpha))
Image.fromarray(seam,'RGBA').save(out/'master-wall-seam.png',optimize=True)
# Tiny clean paper-only tile, NOT the full poster.
im.crop((285,10,477,106)).save(out/'master-paper-tile.png',optimize=True)
print('layers generated', len(list(out.glob('master-*'))))
