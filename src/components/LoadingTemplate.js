import { CSpinner } from "@coreui/react";
import { Skeleton } from "primereact/skeleton";

const CustomTableLoading = () => {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center w-100 h-100" style={{backgroundColor: "rgba(255, 255, 255, 1)", borderRadius: "5px"}}>
        <CSpinner/>
        Loading content...
      </div>
    );
  };

export default CustomTableLoading