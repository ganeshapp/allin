import logo from "../assets/logo.png";

interface Props {
  onClose: () => void;
}

const SITE_URL = "https://www.gapp.in";
const GITHUB_URL = "https://github.com/ganeshapp/allin";
const PAGES_URL = "https://ganeshapp.github.io/allin/";

export function AboutModal({ onClose }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal about-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>About All-In</h3>
          <button type="button" className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="about-content">
          <img src={logo} alt="" className="about-logo" />
          <p className="about-tagline">Offline Texas Hold'em training for macOS and Linux.</p>
          <p>
            Built by{" "}
            <a href={SITE_URL} target="_blank" rel="noopener noreferrer">gapp</a>
            {" "}(
            <a href={SITE_URL} target="_blank" rel="noopener noreferrer">www.gapp.in</a>
            )
          </p>
          <div className="about-links">
            <a href={PAGES_URL} target="_blank" rel="noopener noreferrer">Project website</a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">Source on GitHub</a>
          </div>
        </div>
        <button type="button" className="btn btn-primary" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
