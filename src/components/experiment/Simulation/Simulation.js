import React from "react";
import { useLocation } from "react-router-dom";
import "./experiment.css";

function Simulation() {
  const iframe = useLocation().state.iframe;
  const [iframeRef, setIframeRef] = React.useState(null);
  // const iframeRef = useRef();
  console.log("iframe ref", iframeRef);
  console.log("iframe ref", iframeRef?.contentWindow);

  return (
    <div className="Simulation-iframe-container">
      <iframe
        src={iframe}
        ref={setIframeRef}
        frameBorder="0"
        className="Simulation-iframe"
        title="simulation"
        onLoad={() => console.log("iframe is loaded")}
      />
    </div>
  );
}

export default Simulation;
