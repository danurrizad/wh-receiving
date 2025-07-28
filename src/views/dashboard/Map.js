import React, { useState, useEffect, useRef } from "react";
import {
  dataSchedulesDummy,
  dataReceivingDummy,
  dataDummy,
} from "../../utils/DummyData";
import colorStyles from "../../utils/StyleReactSelect";
import "../../scss/_tabels.scss";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import Pagination from "../../components/Pagination";
import { DatePicker, DateRangePicker } from "rsuite";
import "primeicons/primeicons.css";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import "primereact/resources/themes/nano/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css"; // Icon bawaan PrimeReact
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primeicons/primeicons.css";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import useReceivingDataService from "../../services/ReceivingDataServices";
import { cilChart, cilCog } from "@coreui/icons";
import {
  FaAnglesLeft,
  FaAnglesRight,
  FaArrowUpRightFromSquare,
  FaChevronLeft,
  FaChevronRight,
  FaCircleCheck,
  FaCircleExclamation,
  FaCircleXmark,
} from "react-icons/fa6";
import {
  CAvatar,
  CModal,
  CModalHeader,
  CModalTitle,
  CFormInput,
  CButton,
  CButtonGroup,
  CPaginationItem,
  CPagination,
  CImage,
  CCard,
  CCardBody,
  CBadge,
  CCardHeader,
  CCardText,
  CCardTitle,
  CCol,
  CContainer,
  CFormLabel,
  CFormText,
  CProgress,
  CTooltip,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModalBody,
} from "@coreui/react";
import { cilCalendar } from "@coreui/icons";
import useDashboardReceivingService from "../../services/DashboardService";
import useChartData from "../../services/ChartDataServices";
import useMasterDataService from "../../services/MasterDataService";
import Mapfoto from "src/assets/images/map-plant-1.png";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import CIcon from "@coreui/icons-react";
import { useToast } from "../../App";
import CustomTableLoading from "../../components/LoadingTemplate";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const buttonPositions = {
  "TS 1-02": { top: "45%", left: "32%", color: "#074799" },
  "TS 1-01": { top: "48%", left: "15%", color: "#5bc0de" },
  "TS 1-06": { top: "35%", left: "40%", color: "#f0ad4e" },
  "TS 1-07": { top: "35%", left: "50%", color: "#d9534f" },
  "TS 1-14": { top: "20%", left: "60%", color: "#5bc0de" },
  "TS 1-12": { top: "48%", left: "45%", color: "#f0ad4e" },
  "OIL STORE": { top: "12%", left: "12%", color: "#d9534f" },
  "GAS STORAGE": { top: "18%", left: "48%", color: "#f0ad4e" },
  "TS - PACKING": { top: "14%", left: "25%", color: "#5bc0de" },
};

const Dashboard = () => {
  const addToast = useToast();
  const [loading, setLoading] = useState(false)
  const { getMasterData } = useMasterDataService();
  const { getDNInqueryData } = useReceivingDataService();

  const [optionsSelectVendor, setOptionsSelectVendor] = useState({});
  const [optionsSelectPlant, setOptionsSelectPlant] = useState({});
  const [optionsSelectStatus, setOptionsSelectStatus] = useState({
    list: [
      {
        label: 'PLAN',
        options: [
          { label: "SCHEDULED", value: "scheduled", color: '#6F9CFF' },
          { label: "DELAYED", value: "delayed", color: '#F64242' },
        ],
      },
      {
        label: 'ARRIVAL',
        options: [
          { label: "ON SCHEDULE", value: "on schedule", color: '#49C05F' },
          { label: "OVERDUE", value: "overdue", color: '#FBC550' },
        ],
      },
    ],
  });

  const [dataSchedules, setDataSchedules] = useState([]);
  const [dataDNInquery, setDataDNInquery] = useState([]);

  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const [showModalInput, setShowModalInput] = useState(false);
  const [formUpdate, setFormUpdate] = useState({});

  const apiPlant = "plant-public";

  const [dataMaterialsByDNInquery, setDataMaterialsByDNInquery] = useState([]);

  const [queryFilter, setQueryFilter] = useState({
    plantId: "",
    status: "",
    rangeDate: [
      new Date(new Date().setHours(0, 0, 0, 1)), // Today at 00:00
      new Date(new Date().setHours(23, 59, 59, 999)), // Today at 23:59
    ],
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const fetchPlants = async () => {
    try {
      const response = await getMasterData(apiPlant);
      if (response && response.data) {
        const plantOptions = response.data.map((plant) => ({
          value: plant.id,
          label: plant.plantName,
        }));
        setOptionsSelectPlant({ ...optionsSelectPlant, list: plantOptions });
      }
    } catch (error) {
      console.error("Error fetching plants:", error);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  const getDNInquery = async (plantId, startDate, endDate) => {
    try {
      const response = await getDNInqueryData(
        plantId,
        startDate.toLocaleDateString("en-CA"),
        endDate.toLocaleDateString("en-CA")
      );
      setDataDNInquery(response.data.data);
    } catch (error) {
      console.error("Error fetching DN Inquiry:", error);
    }
  };

  useEffect(() => {
    getDNInquery(
      queryFilter.plantId,
      queryFilter.rangeDate[0],
      queryFilter.rangeDate[1]
    );
  }, [queryFilter.plantId, queryFilter.rangeDate]);

  const handleClickOpenMaterials = (data) => {
    setShowModalInput(true);
    const dataVendor = data;
    const dataMaterials = data.Materials;

    setDataMaterialsByDNInquery(dataMaterials);

    setFormUpdate({
      dnNumber: dataVendor.dnNumber,
      vendorName: dataVendor.supplierName,
      rit: dataVendor.rit,
      incomingIds: dataMaterials.map((data) => data.incomingId),
      receivedQuantities: dataMaterials.map((data) => data.receivedQuantity),
      statuses: dataMaterials.map((data) => data.status),
      remains: dataMaterials.map((data) => data.remain),
    });
  };

  const plantTimeBodyTemplate = (rowData) => {
    const timeFrom = rowData.arrivalPlanTime;
    const timeTo = rowData.departurePlanTime;
    return (
      <div>
        {timeFrom} - {timeTo}
      </div>
    );
  };
  const statusVendorBodyTemplate = (rowData) => {
      const status = rowData.status
      const bgColor = 
        status === "delayed" ? "#F64242" : 
        status === "scheduled" ? "#6E9CFF" : 
        status === "overdue" ? "#FBC550" : 
        status === "on schedule" ? "#43AB43" : 
        status === "no schedule" ? "gray" : 
        "transparent"
      return(
        <CTooltip 
          content={ 
            status === "delayed" ? "Vendor belum tiba dan melebihi jadwal" : 
            status === "scheduled" ? "Vendor belum tiba" : 
            status === "overdue" ? "Vendor telah tiba dengan melebihi jadwal" : 
            status === "on schedule" ? "Vendor telah tiba tepat waktu" : 
            status === "no schedule" ? "Tidak ada jadwal" : 
            ""
          } 
          placement="top"
          >
            <button
              className='text-center' 
              style={{ 
                backgroundColor: bgColor, 
                color: status === "overdue" ? "black" : "white",
                width: "100%",
                padding: "5px 10px",
                fontWeight: "bold",
                borderRadius: "8px", 
                textTransform: "uppercase",
                cursor: "pointer"
              }}
            >
              {status}
            </button>
          </CTooltip>
      )
    }
  const materialsBodyTemplate = (rowBody) => {
    return (
      <div className="d-flex align-items-center justify-content-center">
        <CButton
          onClick={() => handleClickOpenMaterials(rowBody)}
          color="info"
          className="d-flex justify-content-center align-items-center p-2 "
        >
          <FaArrowUpRightFromSquare style={{ color: "white" }} size={13} />
        </CButton>
      </div>
    );
  };

  const remainBodyTemplate = (rowBody, {rowIndex}) => {
    const colorText = rowBody.remain < 0 ? "red" : "black" 
    return(
      <p style={{color: colorText}}>
        {rowBody.remain}
      </p>
    )
  }

  const statusQtyBodyTemplate = (rowData, rowIndex) => {
    return (
      <div className="d-flex justify-content-center">
        <CTooltip
          content={
            rowData.status === "not complete"
              ? "NOT DELIVERED"
              : rowData.status === "partial"
                ? "NOT COMPLETED"
                : rowData.status === "completed"
                  ? "COMPLETED"
                  : "COMPLETED"
          }
          placement="top"
        >
          <CButton style={{ border: 0 }}>
            {rowData.status === "not complete" ? (
              <FaCircleXmark style={{ color: "#FF0000", fontSize: "24px" }} />
            ) : rowData.status === "partial" ? (
              <FaCircleExclamation
                style={{ color: "#FFD43B", fontSize: "24px" }}
              />
            ) : rowData.status === "completed" ? (
              <FaCircleCheck style={{ color: "#00DB42", fontSize: "24px" }} />
            ) : (
              <FaCircleCheck style={{ color: "#00DB42", fontSize: "24px" }} />
            )}
          </CButton>
        </CTooltip>
      </div>
    );
  };


  const selectStatusStyle = {
    option: (base, {data, isDisabled, isSelected}) => ({
      ...base,
      backgroundColor: data.color,
      display: 'flex',
      justifyContent: "center",
      padding: "10px",
      borderRadius: '5px',
      marginTop: "10px",
      marginLeft: "10px",
      width: '90%',
      color: "white",
      fontWeight: "bold",
      ':active': {
        ...base[':active'],
        backgroundColor: data.color ,
      },
      ':hover': {
        ...base[':hover'],
        backgroundColor: 
          data.value === 'scheduled' ? "#B8CEFF" : 
          data.value === 'delayed' ? "#FFA4A4" : 
          data.value === 'on schedule' ? "#97D497" : 
          data.value === 'overdue' ? "#FFDE97" : 
          "gray"
      }
    }),
    placeholder: (base) => ({
      ...base,
      // color: "red", // Warna merah untuk placeholder
      // fontWeight: "bold",
    }),
    singleValue: (base, state) => ({
      ...base,
      color: "white",
      // color: state.data.value === "delayed" ? "red" : "green", // Warna sesuai status
      backgroundColor: 
        state.data.value === "delayed" ? "#F64242" : 
        state.data.value === "scheduled" ? "#6E9CFF" : 
        state.data.value === "overdue" ? "#FBC550" : 
        state.data.value === "on schedule" ? "#43AB43" : 
        "transparent",
      fontWeight: "bold",
      padding: "5px 10px",
      borderRadius: "5px",
      display: 'flex',
      justifyContent: "center",
    }),
    control: (base) => ({
      ...base,
      height: "42px",
      minWidth: "220px"
    })
  };

  return (
    <CContainer fluid>
      <CRow className="mt-1">
        <CCard
          className="px-0 text-black mb-1"
          style={{
            overflow: "hidden",
            transitionDuration: "500ms",
            border: "1px solid #6482AD",
          }}
        >
          <CCardHeader
            style={{
              zIndex: 4,
              backgroundColor: "#6482AD",
              color: "white",
              padding: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <CTooltip content="Toggle Filter Visibility">
                <button
                  className="btn d-flex align-items-center justify-content-center btn-toggle"
                  style={{
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                  }}
                  onClick={() => setIsFilterVisible(!isFilterVisible)}
                >
                  <CIcon icon={cilCog} size="sm" className="icon-toggle" />
                </button>
              </CTooltip>
              <CCardTitle className="text-center fs-4" style={{ flexGrow: 1 }}>
                MAP TRUCK STATION WAREHOUSE #1 & #2
              </CCardTitle>
            </div>
          </CCardHeader>
          {/* Body dengan Gambar */}
          <CCardBody className="position-relative">
            {isFilterVisible && (
              <div className="d-flex mt-1 mb-2">
                <CCol sm={12} md={12} lg={5} xl={5} className="d-flex gap-1">
                  <div>
                    <CFormText>Filter Plant</CFormText>
                    <Select
                      className="select-plant"
                      classNamePrefix="select-plant"
                      id="plant"
                      isClearable
                      options={optionsSelectPlant.list} // Tambahkan opsi "All"
                      value={
                        optionsSelectPlant.list.find(
                          (opt) => opt.value === optionsSelectPlant.selected
                        ) || ""
                      }
                      onChange={(e) => {
                        setOptionsSelectPlant({
                          ...optionsSelectPlant,
                          selected: e !== null ? e.value : "",
                        });
                      }}
                      styles={{
                        control: (base) => {
                          return {
                            ...base,
                            width: "250px", // Atur lebar lebih kecil agar lebih proporsional
                            minWidth: "200px",
                            maxWidth: "100%",
                            borderRadius: "5px",
                            padding: "2px",
                            zIndex: 3, // Memberikan prioritas tinggi agar dropdown muncul di atas elemen lain
                            position: "relative",
                            height: "100%",
                          };
                        },
                        menu: (base) => ({
                          ...base,
                          zIndex: 3, // Pastikan menu dropdown tidak tertutup elemen lain
                        }),
                      }}
                    />
                  </div>
                  <div>
                    <CFormText>Filter by Status</CFormText>
                    <Select
                      className="select-status"
                      classNamePrefix="select-status"
                      options={optionsSelectStatus.list}
                      value={optionsSelectStatus.list.flatMap((group) => group.options).find(option => option.value === optionsSelectStatus.selected) || ""}
                      onChange={(e) => {
                        setOptionsSelectStatus({
                          ...optionsSelectStatus,
                          selected: e !== null ? e.value : "",
                        });
                      }}
                      placeholder="All"
                      isClearable
                      styles={selectStatusStyle}
                    />
                  </div>
                </CCol>
                {/* Kolom kedua */}
                <CCol
                  sm={12}
                  md={12}
                  lg={7}
                  xl={7}
                  className="d-flex justify-content-end gap-2 "
                >
                  <div>
                    <CFormText style={{ alignSelf: "flex-start" }}>
                      Search vendor
                    </CFormText>
                    <Select
                      className="select-vendor"
                      classNamePrefix="select-vendor"
                      options={optionsSelectVendor.list}
                      isClearable
                      placeholder="Vendor name"
                      styles={{
                        container: (provided) => ({
                          ...provided,
                          width: "250px", // Sesuaikan lebar input Select
                          zIndex: 1000, // Z-index untuk elemen container
                        }),
                        control: (base) => ({
                          ...base,
                          height: "42px",
                        }),
                      }}
                    />
                  </div>
                  {/* <div className="flatpickr-wrapper d-flex flex-column align-items-end" style={{ position: "relative", width: "100%" }}> */}
                  <div>
                    <CFormText>Filter by Date</CFormText>
                    <DateRangePicker
                      showOneCalendar
                      placeholder="All time"
                      position="start"
                      value={queryFilter.rangeDate}
                      onChange={(e) => {
                        setQueryFilter({
                          ...queryFilter,
                          rangeDate:
                            e !== null
                              ? [
                                  new Date(e[0].setHours(0, 0, 0, 1)),
                                  new Date(e[1].setHours(23, 59, 59, 59)),
                                ]
                              : ["", ""],
                        });
                      }}
                    />
                  </div>
                </CCol>
              </div>
            )}
            <div className="position-relative">
              <CImage
                className="w-100"
                src={Mapfoto}
                height={620}
                style={{ borderRadius: "10px" }}
              />
              {/* Loop untuk menampilkan tombol berdasarkan buttonPositions */}
              {Object.keys(buttonPositions).map((location) => {
                const pos = buttonPositions[location];
                return (
                  <CButton
                    key={location}
                    className="position-absolute translate-middle"
                    style={{
                      top: pos.top,
                      left: pos.left,
                      backgroundColor: pos.color,
                      borderColor: pos.color,
                      color: "white",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      padding: "8px 16px",
                      borderRadius: "8px",
                    }}
                  >
                    {location}
                  </CButton>
                );
              })}
            </div>
            <CCard className=" mt-2">
              <CCardBody>
                <CFormLabel className="fs-4 fw-bold mt-2">
                  {" "}
                  Table Detail Receive By Truck Station
                </CFormLabel>
                <DataTable
                  removableSort
                  globalFilterFields={[
                    "dnNumber",
                    "supplierName",
                    "truckStation",
                  ]}
                  paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                  currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                  filters={queryFilter}
                  showGridlines
                  size="small"
                  paginator
                  rows={10}
                  rowsPerPageOptions={[10, 25, 50]}
                  tableStyle={{ minWidth: "50rem" }}
                  value={dataDNInquery}
                  filterDisplay="row"
                  className="p-datatable-sm custom-datatable mt-2"
                >
                  <Column
                    className=""
                    header="No"
                    body={(rowBody, { rowIndex }) => rowIndex + 1}
                  ></Column>
                  <Column className="" field="dnNumber" header="DN No"></Column>
                  <Column
                    className=""
                    field="supplierName"
                    header="Vendor Name"
                  ></Column>
                  <Column
                    className=""
                    field="truckStation"
                    header="Truck Station"
                  ></Column>
                  <Column className="" field="rit" header="Rit"></Column>
                  <Column
                    className=""
                    field="arrivalPlanDate"
                    header="Plan Date"
                  ></Column>
                  <Column
                    className=""
                    field="arrivalPlanTime"
                    header="Plan Time"
                    body={plantTimeBodyTemplate}
                  ></Column>
                  <Column
                    className=""
                    field="arrivalActualDate"
                    header="Arriv. Date"
                  ></Column>
                  <Column
                    className=""
                    field="arrivalActualTime"
                    header="Arriv. Time"
                  ></Column>
                  {/* <Column className='' field='deliveryNotes.departureActualDate'  header="Departure Date" /> */}
                  <Column
                    className=""
                    field="departureActualTime"
                    header="Dept. Time"
                  ></Column>
                  <Column
                    className=""
                    field="status"
                    header="Status"
                    body={statusVendorBodyTemplate}
                  ></Column>
                  <Column
                    className=""
                    field=""
                    header="Materials"
                    body={materialsBodyTemplate}
                  ></Column>
                </DataTable>
              </CCardBody>
            </CCard>
          </CCardBody>
        </CCard>
      </CRow>

      {/* -----------------------------------MODAL------------------------------------ */}
      <CModal 
        visible={showModalInput}
        onClose={() => setShowModalInput(false)}
        size='xl'
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>List Materials Received</CModalTitle>
        </CModalHeader>
        <CModalBody> 
          <CRow>
            <CCol sm='3'>
              <CFormText>DN No</CFormText>  
              <CFormLabel>{formUpdate.dnNumber}</CFormLabel>
            </CCol>
            <CCol>
              <CFormText>VENDOR NAME</CFormText>  
              <CFormLabel>{formUpdate.vendorName}</CFormLabel>
            </CCol>
          </CRow>
          <CRow className='pt-1'>
            <DataTable
              className="p-datatable-sm custom-datatable text-nowrap"
              loading={loading}
              loadingIcon={<CustomTableLoading/>}
              tableStyle={{ minWidth: '50rem' }}
              removableSort
              size="small"
              scrollable
              scrollHeight="50vh"
              showGridlines
              paginator
              paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
              rowsPerPageOptions={[10, 25, 50]}
              rows={10}
              value={dataMaterialsByDNInquery}
              filterDisplay="row"
            >
              <Column header="No" body={(rowBody, {rowIndex})=>rowIndex+1} />
              <Column field='materialNo'  header="Material No" />
              <Column field='description'  header="Material Description" />
              <Column field='address'  header="Rack Address" />
              <Column field="reqQuantity" header="Req. Qty" body={(data) => <div className="text-center">{data.reqQuantity}</div>} />
              <Column field="actQuantity" header="Act. Qty" body={(data) => <div className="text-center">{data.receivedQuantity}</div>} />
              <Column field="remain" header="Remain" body={remainBodyTemplate} align="center" />
              <Column   field='status'  header="Status" body={statusQtyBodyTemplate} />
            </DataTable>
          </CRow>
          <CRow  className='mt-1 px-2'></CRow>
        </CModalBody>
      </CModal>
    </CContainer>
  );
};

export default Dashboard;
