import portrait from '../assets/portrait-gaze-hd.webp';
import exactPortrait from '../assets/master-portrait.png';
export function Portrait() {
  return <div className="portrait-plane" aria-hidden="true">
    <div className="portrait-shadow" />
    <div className="photo-frame">
      <img className="portrait-hd" src={portrait} alt="" fetchPriority="high" decoding="async" />
      <img className="portrait-master" src={exactPortrait} alt="" fetchPriority="high" decoding="async" />
      <div className="photo-vignette"/>
    </div>
  </div>;
}
