import { AbsoluteFill, Img, staticFile, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
/** Reusable cinematic timing study, NOT a site-level layout or scroll controller. */
export function M01Scene() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const alpha = (start:number) => interpolate(f,[start,start+fps*0.6],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <AbsoluteFill style={{background:'#f1eee6',fontFamily:'"WenQuanYi Zen Hei","Noto Sans CJK SC",sans-serif',overflow:'hidden'}}>
    <AbsoluteFill style={{left:'47%',top:'8%',width:'46%',height:'86%',transform:'rotate(-3deg)',background:'#191919'}}>
      <Img src={staticFile('portrait-gaze-hd.webp')} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
    </AbsoluteFill>
    <div style={{position:'absolute',left:'5%',top:'22%',color:'#171718',fontSize:190,fontWeight:900,opacity:alpha(8)}}>向内</div>
    <div style={{position:'absolute',left:'6%',top:'54%',color:'#171718',fontSize:190,fontWeight:900,opacity:alpha(19)}}>向外</div>
    <div style={{position:'absolute',left:'32%',top:'36%',fontSize:72,fontWeight:800,opacity:alpha(28)}}>寻找中心，</div>
    <div style={{position:'absolute',left:'35%',top:'70%',fontSize:72,fontWeight:800,opacity:alpha(40)}}>探寻世界。</div>
  </AbsoluteFill>;
}
