import { useState } from "react";
import logoUrl from "../../assets/ef-planner-logo.png";
import logoUrlSvg from "../../assets/ef-planner-logo.svg";
import "./Logo.css";

interface LogoProps {
  size?: "large" | "small";
}

function Logo({ size = "large" }: LogoProps) {
  const [source, setSource] = useState<"png" | "svg" | "text">("png");

  if (source === "text") {
    return (
      <div className="app-brand">
        <span className={`logo-fallback logo-fallback-${size}`}>
          <span className="logo-fallback-icon">🏃</span>
          EF Planner
        </span>
      </div>
    );
  }

  return (
    <div className="app-brand">
      <img
        className={`app-logo logo-${size}`}
        src={source === "png" ? logoUrl : logoUrlSvg}
        alt="EF Planner"
        onError={() => {
          if (source === "png") {
            setSource("svg");
          } else {
            setSource("text");
          }
        }}
      />
    </div>
  );
}

export default Logo;
