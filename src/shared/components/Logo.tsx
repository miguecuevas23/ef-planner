import { useState } from "react";
import logoUrlSvg from "../../assets/ef-planner-logo.svg";
import "./Logo.css";

interface LogoProps {
  size?: "large" | "small";
}

function Logo({ size = "large" }: LogoProps) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div className="logo">
        <span className={`logo-fallback logo-fallback-${size}`}>
          <span className="logo-fallback-icon">🏃</span>
          EF Planner
        </span>
      </div>
    );
  }

  return (
    <div className="logo">
      <img
        className={`logo-img logo-${size}`}
        src={logoUrlSvg}
        alt="EF Planner"
        onError={() => setImgError(true)}
      />
    </div>
  );
}

export default Logo;
