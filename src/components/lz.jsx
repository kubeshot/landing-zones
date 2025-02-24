import { useState } from "react";
import BootstrapComponent from "../components/Bootstrap";

function lz() {
  const [landing_zone, set_landing_zone] = useState(null);

  return (
    <>
      {landing_zone === null ? (
        <>
          <div className="lz_heading">Select landing zone</div>
          <div className="lz_container">
            <button className="lz" onClick={() => set_landing_zone("PBMM")}>
              PBMM
            </button>
            <button className="lz" onClick={() => set_landing_zone("Other")}>
              Other
            </button>
          </div>
        </>
      ) : (

        <div className="selected_lz">
          Landing zone: <strong>{landing_zone}</strong>
          <BootstrapComponent/>
        </div>
      )}
    </>
  );
}

export default lz;