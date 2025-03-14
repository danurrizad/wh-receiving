import { CImage, CSpinner } from "@coreui/react";
import LogoTWIIS from 'src/assets/images/logo-twiis-2.png';

const LoadingTWIIS = () => {
    return (
      <div className="w-100 h-100 d-flex align-items-center flex-column justify-content-center">
        <CImage src={LogoTWIIS} width={250} className="animate-logos" />
        <div className="loading-twiis d-flex align-items-center justify-content-center gap-3" style={{backgroundColor: "transparent", borderRadius: "5px"}}>
          <CSpinner variant="grow" style={{backgroundColor: "#F64242", width: "1.5rem", height: "1.5rem"}}/>
          <CSpinner variant="grow" style={{backgroundColor: "#003399", width: "1.5rem", height: "1.5rem"}}/>
          <CSpinner variant="grow" style={{backgroundColor: "#6799FF", width: "1.5rem", height: "1.5rem"}}/>
          <CSpinner variant="grow" style={{backgroundColor: "#00CCFF", width: "1.5rem", height: "1.5rem"}}/>
          <CSpinner variant="grow" style={{backgroundColor: "black", width: "1.5rem", height: "1.5rem"}}/>
        </div>
      </div>
    );
  };

export default LoadingTWIIS