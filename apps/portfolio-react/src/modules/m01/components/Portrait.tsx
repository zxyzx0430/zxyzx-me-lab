import portrait from '../assets/portrait-user-20261028.jpg';
export function Portrait() {
  return <div className="portrait-plane" aria-hidden="true">
    <div className="portrait-shadow" />
    <div className="photo-frame">
      <img className="portrait-hd" src={portrait} alt="" fetchPriority="high" decoding="async" />
      <div className="poster-vertical">FAITHFUL TO THE CENTER</div>
      <div className="photo-vignette"/>
    </div>
  </div>;
}
