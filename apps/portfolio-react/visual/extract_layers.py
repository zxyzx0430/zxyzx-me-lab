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
# Repair ONLY the beige paper-colored scrap along the wall immediately right
# of 「寻」. The wall is photographic: use adjacent source wall pixels, not a
# flat CSS rectangle. Do not alter transparency, face, upper light beam or any
# portion of the portrait beyond this tiny band.
rgba=np.asarray(cut).copy()
rgb=rgba[:,:,:3].astype('float32')
Y,X=np.mgrid[65:936,804:1604]
paper_scrap=np.zeros(rgba.shape[:2],np.uint8)
points=np.array([(867,518),(907,515),(900,554),(896,579),
                 (885,613),(869,610),(864,573)],np.int32)
points-=np.array([804,65])
cv2.fillPoly(paper_scrap,[points],255)
soft=cv2.GaussianBlur(paper_scrap.astype('float32')/255,(0,0),3.1)
bright=.2126*rgb[:,:,0]+.7152*rgb[:,:,1]+.0722*rgb[:,:,2]
# Avoid touching dark printed ink or scratches; repaint only the pale region.
repaint=soft*np.clip((bright-85)/105,0,1)*.96*(rgba[:,:,3].astype('float32')/255)
repaint[:448,:]=0
repaint[549:,:]=0
source_x=np.minimum(X+56,1603)-804
wall=rgb[np.arange(rgb.shape[0])[:,None],source_x]
rgba[:,:,:3]=np.uint8(np.clip(rgb*(1-repaint[:,:,None])+wall*repaint[:,:,None],0,255))
assert np.array_equal(rgba[:,:,3],np.asarray(cut)[:,:,3]),'alpha may not change'
assert np.array_equal(rgba[:448],np.asarray(cut)[:448]),'top must not change'
assert np.array_equal(rgba[549:],np.asarray(cut)[549:]),'bottom must not change'
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
