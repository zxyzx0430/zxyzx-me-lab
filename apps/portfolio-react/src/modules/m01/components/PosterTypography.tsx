import into from '../assets/master-into.png';
import find from '../assets/master-find.png';
import center from '../assets/master-center.png';
import out from '../assets/master-out.png';
import explore from '../assets/master-explore.png';
import world from '../assets/master-world.png';
const wordAssets = [
  { name: 'into', text: '向内', src: into, x:72, y:119, w:451, h:297 },
  { name: 'find', text: '寻找', src: find, x:514, y:239, w:251, h:123 },
  { name: 'center', text: '中心，', src: center, x:524, y:343, w:313, h:132 },
  { name: 'out', text: '向外', src: out, x:133, y:422, w:487, h:316 },
  { name: 'explore', text: '探寻', src: explore, x:616, y:499, w:266, h:133 },
  { name: 'world', text: '世界。', src: world, x:601, y:617, w:281, h:157 }
] as const;
export function PosterTypography() {
  return <div className="poster-title" aria-hidden="true">
    <div className="master-word-layer">
      {wordAssets.map(word => <span className={'master-word word-' + word.name} key={word.name}
        style={{left:word.x,top:word.y,width:word.w,height:word.h}}>
        <img src={word.src} width={word.w} height={word.h} alt="" draggable={false}/>
      </span>)}
    </div>
    <div className="responsive-type-layer">
      <span className="t t-into">向内</span><span className="t t-find">寻找</span>
      <span className="t t-center">中心，</span><span className="t t-out">向外</span>
      <span className="t t-explore">探寻</span>
      <span className="t t-world"><span className="outline">世</span><span className="solid">界。</span></span>
    </div>
  </div>;
}
