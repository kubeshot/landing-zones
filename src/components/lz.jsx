import { useState } from "react";
import BootstrapComponent from "../components/Bootstrap";
import "../styles/lz.css";

function lz() {
  const [landing_zone, set_landing_zone] = useState(null);

  return (
    <>
      {landing_zone === null ? (
        <div className="lz_container">
          <div className="lz_heading">Select landing zone</div>
          <div className="lz_options">
            <button  onClick={() => set_landing_zone("PBMM")}>
              PBMM
            </button>
            <button  onClick={() => set_landing_zone("Other")}>
              Other
            </button>
          </div>
        </div>
      ) : (
        <>
        <div className="selected_lz">
        <i className="material-icons tooltip-icon">check_circle</i>Landing zone: {landing_zone}
        </div>
        <BootstrapComponent/>
        </>
      )}
    </>
  );
}

export default lz;