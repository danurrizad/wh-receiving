import { CSpinner } from "@coreui/react";
import { Skeleton } from "primereact/skeleton";

const CustomTableLoading = () => {
    return (
      <div className="custom-loading d-flex flex-column align-items-center justify-content-center w-100 h-100" style={{backgroundColor: "rgba(255, 255, 255, 1)", borderRadius: "5px"}}>
        <CSpinner className="custom-spinner"/>
        <p>Loading content...</p>
      </div>
    );
  };

export default CustomTableLoading