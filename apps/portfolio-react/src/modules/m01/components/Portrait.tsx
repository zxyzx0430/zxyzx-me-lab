import portrait from '../assets/portrait-gaze-hd.webp';
export function Portrait() {
  return <div className="portrait-plane" aria-hidden="true">
    <div className="portrait-shadow" />
    <div className="photo-frame"><img src={portrait} alt="" fetchPriority="high" decoding="async" /><div className="photo-vignette"/></div>
  </div>;
}
