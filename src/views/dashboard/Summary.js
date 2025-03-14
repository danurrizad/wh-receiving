import React, { useState, useEffect, useRef } from "react";
import "../../scss/_tabels.scss";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import { DatePicker, DateRangePicker, Input } from "rsuite";
import "primereact/resources/themes/nano/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css"; // Icon bawaan PrimeReact
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primeicons/primeicons.css";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import useReceivingDataService from "../../services/ReceivingDataServices.jsx";
import { cilChart, cilCog } from "@coreui/icons";
import {
  FaAnglesLeft,
  FaAnglesRight,
  FaArrowUpRightFromSquare,
  FaBoxesPacking,
  FaChevronLeft,
  FaChevronRight,
  FaCircleCheck,
  FaCircleExclamation,
  FaCircleInfo,
  FaCircleRight,
  FaCircleXmark,
  FaInbox,
} from "react-icons/fa6";
import {
  CAvatar,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CButton,
  CButtonGroup,
  CPagination,
  CPaginationItem,
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
  CFormInput,
} from "@coreui/react";
import { cilCalendar } from "@coreui/icons";
import useDashboardReceivingService from "../../services/DashboardService.jsx";
import useChartData from "../../services/ChartDataServices.jsx";
import usePieChartDataService from "../../services/PieChartDataService.jsx.jsx";
import useMasterDataService from "../../services/MasterDataService.jsx";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import annotationPlugin from "chartjs-plugin-annotation";
import { Bar, Pie, Doughnut, Line } from "react-chartjs-2";
import CIcon from "@coreui/icons-react";
import { useToast } from "../../App.js";
import CustomTableLoading from "../../components/LoadingTemplate.js";
import useBarChartDataService from "../../services/BarChartDataService.jsx";
import TimeProgressBar from "../../components/TimeProgressBar.js";

ChartJS.register(
  CategoryScale,
  ArcElement,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin,
  ChartDataLabels
);

const Summary = () => {
  const [loading, setLoading] = useState(false);
  const addToast = useToast();
  const [dataPieChart, setDataPieChart] = useState([]);
  const [dataBarChart, setDataBarChart] = useState([]);
  const [dataTableHistory, setDataTableHistory] = useState([]);
  const { setPieChartData, getPieChartOption } = usePieChartDataService({
    dataPieChart,
  });
  const {
    setBarChartData,
    getBarChartOptions,
    setLineChartYellowData,
    getLineChartYellowOptions,
    setLineChartRedData,
    getLineChartRedOptions,
  } = useBarChartDataService({ dataBarChart });
  const { getChartReceiving, getChartHistoryReceiving } =
    useDashboardReceivingService();
  const { getMasterData } = useMasterDataService();

  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthsName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [filterDate, setFilterDate] = useState(new Date());
  const [filterMonth, setFilterMonth] = useState(new Date());
  const [optionsSelectPlant, setOptionsSelectPlant] = useState({
    list: [],
    selectedPie: "",
    selectedBar: "",
  });

  const [timeState, setTimeState] = useState(new Date());
  const t = new Date();
  const c = t.getHours() - 12;
  useEffect(() => {
    setInterval(() => {
      setTimeState(new Date());
    }, 1000);
  }, []);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const fetchPieChartReceiving = async (plantId) => {
    try {
      const response = await getChartReceiving(
        plantId,
        "",
        "",
        filterDate.toLocaleDateString("en-CA"),
        filterDate.toLocaleDateString("en-CA"),
        "",
        ""
      );
      setDataPieChart(response.summaryMaterial);
    } catch (error) {
      console.error(error);
      setDataPieChart([]);
    }
  };

  useEffect(() => {
    const fetchFirstLoad = async () => {
      setLoading(true);
      await fetchPieChartReceiving(optionsSelectPlant.selectedPie);
      setLoading(false);
    };

    fetchFirstLoad();
  }, [filterDate, optionsSelectPlant.selectedPie]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchPieChartReceiving(optionsSelectPlant.selectedPie);
    }, 10000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [optionsSelectPlant.selectedPie, filterDate]);

  const fetchPlant = async () => {
    try {
      const response = await getMasterData("plant-public");
      const optionsPlant = response.data.map((data) => {
        return {
          label: data.plantName,
          value: data.id,
        };
      });
      setOptionsSelectPlant({ ...optionsSelectPlant, list: optionsPlant });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPlant();
  }, []);

  const fetchHistoryChartReceiving = async (plantId, year, month) => {
    try {
      const response = await getChartHistoryReceiving(plantId, year, month);
      setDataBarChart(response.data.data.byDate);
      setDataTableHistory(response.data.data.bySupplier);
    } catch (error) {
      console.error(error);
      setDataBarChart([]);
    }
  };

  useEffect(() => {
    fetchHistoryChartReceiving(
      optionsSelectPlant.selectedBar,
      filterMonth.toLocaleDateString("en-CA").split("-")[0],
      filterMonth.toLocaleDateString("en-CA").split("-")[1]
    );
  }, [filterMonth, optionsSelectPlant.selectedBar]);

  const renderCustomEmptyMsg = () => {
    return (
      <div
        className="empty-msg w-100 d-flex h-100 flex-column align-items-center justify-content-center py-3"
        style={{ color: "black", opacity: "50%" }}
      >
        <FaInbox size={40} />
        <p>NO DATA FOUND</p>
      </div>
    );
  };

  return (
    <CContainer fluid>
      {/* -------------------------------------------------------------------VERTICAL BAR CHART--------------------------------------------- */}

      <CRow className="mb-5 ">
        <CCard
          className="px-0"
          style={{
            border: "1px solid #6482AD",
            minHeight: "400px",
            overflow: "hidden",
          }}
        >
          <CCardHeader
            className="text-center"
            style={{ backgroundColor: "#6482AD", color: "white" }}
          >
            <CCardTitle className="fs-4">MONTHLY MATERIALS RECEIVED</CCardTitle>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-3">
              <CCol>
                {/* <CCard>
                        <CCardBody> */}
                <CRow>
                  <CCol sm={1} lg={6} className="d-flex align-items-end">
                    <h1 className="d-none d-lg-block">
                      {monthsName[filterMonth.getMonth()]}{" "}
                    </h1>
                    <h3 className="d-lg-none d-block">
                      {monthsName[filterMonth.getMonth()]}{" "}
                    </h3>
                  </CCol>
                  <CCol
                    sm={11}
                    lg={6}
                    className="d-flex align-items-end justify-content-end gap-2"
                  >
                    <div className="h-100" style={{ width: "33%" }}>
                      <CFormText>Filter by Plant</CFormText>
                      <Select
                        options={optionsSelectPlant.list}
                        value={optionsSelectPlant.list.find(
                          (opt) => opt.value === optionsSelectPlant.selectedBar
                        )}
                        onChange={(e) => {
                          setOptionsSelectPlant({
                            ...optionsSelectPlant,
                            selectedBar: e !== null ? e.value : "",
                          });
                        }}
                        placeholder="All plant"
                        isClearable
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            minHeight: "42px",
                          }),
                          option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                            return {
                              ...styles,
                              backgroundColor: isDisabled
                                ? undefined
                                : isSelected ? "rgb(72, 96, 129)"
                                : isFocused ? "#6482AD"
                                : undefined,
                              color: "white",
                              ':active': {
                                ...styles[':active'],
                                backgroundColor: !isDisabled
                                  ? isSelected
                                    ? 'lightgrey'
                                    : 'white'
                                  : undefined,
                              },
                            };
                          },
                        }}
                      />
                    </div>
                    <div>
                      <CFormText>Filter by Month</CFormText>
                      <DatePicker
                        style={{ width: "130px" }}
                        showonecalendar="true"
                        placement="bottomEnd"
                        format="yyyy-MM"
                        placeholder="Select month"
                        oneTap
                        value={filterMonth}
                        onChange={(e) => {
                          console.log(e);
                          setFilterMonth(
                            e !== null ? e : new Date(year, month, 1)
                          );
                        }}
                      />
                    </div>
                  </CCol>
                </CRow>
                {/* </CCardBody>
                    </CCard> */}
              </CCol>
            </CRow>
            {loading ? (
              <CustomTableLoading />
            ) : (
              <CRow className="d-flex">
                <CCol sm="12">
                  <CCard>
                    <CCardBody className="border">
                      <div className="">
                        <Line
                          data={setLineChartRedData()}
                          options={getLineChartRedOptions()}
                          height={150}
                          plugins={[
                            {
                              id: "increase-legend-spacing-1",
                              beforeInit(chart) {
                                // Get reference to the original fit function
                                const originalFit = chart.legend.fit;
                                // Override the fit function
                                chart.legend.fit = function fit() {
                                  // Call original function and bind scope in order to use `this` correctly inside it
                                  originalFit.bind(chart.legend)();
                                  this.height += 20;
                                };
                              },
                            },
                          ]}
                        />
                      </div>
                    </CCardBody>
                    <CCardBody className="border">
                      <div className="" style={{ paddingLeft: "px" }}>
                        <Line
                          data={setLineChartYellowData()}
                          options={getLineChartYellowOptions()}
                          height={150}
                          plugins={[
                            {
                              id: "increase-legend-spacing-2",
                              beforeInit(chart) {
                                // Get reference to the original fit function
                                const originalFit = chart.legend.fit;
                                // Override the fit function
                                chart.legend.fit = function fit() {
                                  // Call original function and bind scope in order to use `this` correctly inside it
                                  originalFit.bind(chart.legend)();
                                  this.height += 20;
                                };
                              },
                            },
                          ]}
                        />
                      </div>
                    </CCardBody>
                    <CCardBody className="border">
                      <div className="">
                        <Bar
                          data={setBarChartData()}
                          options={getBarChartOptions()}
                          height={300}
                          plugins={[
                            {
                              id: "increase-legend-spacing-3",
                              beforeInit(chart) {
                                // Get reference to the original fit function
                                const originalFit = chart.legend.fit;
                                // Override the fit function
                                chart.legend.fit = function fit() {
                                  // Call original function and bind scope in order to use `this` correctly inside it
                                  originalFit.bind(chart.legend)();
                                  this.height += 20;
                                };
                              },
                            },
                          ]}
                        />
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol className="d-flex mt-3" sm="12">
                  <CCard className="overflow-hidden w-100">
                    <CCardBody className="p-0">
                      <DataTable
                        className="p-datatable-sm custom-datatable text-nowrap dashboard"
                        emptyMessage={renderCustomEmptyMsg}
                        loading={loading}
                        loadingIcon={CustomTableLoading}
                        value={dataTableHistory}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[10, 25, 50, 100]}
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                      >
                        <Column
                          header="No"
                          body={(rowBody, { rowIndex }) => rowIndex + 1}
                        />
                        <Column field="supplierCode" header="Vendor Code" />
                        <Column field="supplierName" header="Vendor Name" />
                        <Column
                          field="notDeliveredCount"
                          header="Delayed Material"
                        />
                      </DataTable>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            )}
          </CCardBody>
        </CCard>
      </CRow>

      {/*--------------------------------------------------------------------PIE CHART-------------------------------------------------------------------------------  */}
      <CRow className="mb-3">
        <CCard
          className="px-0 mb-3"
          style={{
            border: "1px solid #6482AD",
            minHeight: "400px",
            overflow: "hidden",
          }}
        >
          <CCardHeader
            className="text-center"
            style={{ backgroundColor: "#6482AD", color: "white" }}
          >
            <CCardTitle className="fs-4">DAILY MATERIALS RECEIVED</CCardTitle>
          </CCardHeader>
          <CCardBody className="px-4">
            <CRow className="mb-3">
              <CCol>
                <CRow>
                  <CCol>
                    <h1 className="d-lg-block d-none">
                      {weekday[filterDate.getDay()]}{" "}
                    </h1>
                    <h3 className="d-block d-lg-none">
                      {weekday[filterDate.getDay()]}{" "}
                    </h3>
                  </CCol>
                  <CCol className=" align-items-center justify-content-center gap-1 d-lg-flex d-none">
                    <h1 className="d-lg-block d-none">
                      {timeState.toLocaleString("en-US", {
                        hour: "2-digit",
                        hourCycle: "h24",
                      })}
                    </h1>
                    {/* <h3 className="d-block d-lg-none">
                      {timeState.toLocaleString("en-US", {
                        hour: "2-digit",
                        hourCycle: "h24",
                      })}
                    </h3> */}
                    <h1 className="d-lg-block d-none">:</h1>
                    {/* <h3 className="d-block d-lg-none">:</h3> */}
                    <h1 className="d-lg-block d-none">
                      {
                        timeState
                          .toLocaleString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hourCycle: "h24",
                          })
                          .split(":")[1]
                      }
                    </h1>
                    {/* <h3 className="d-block d-lg-none">
                      {
                        timeState
                          .toLocaleString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hourCycle: "h24",
                          })
                          .split(":")[1]
                      }
                    </h3> */}
                  </CCol>
                  <CCol className="d-flex align-items-end justify-content-end gap-2">
                    <div className="h-100 w-50">
                      <CFormText>Filter by Plant</CFormText>
                      <Select
                        options={optionsSelectPlant.list}
                        value={optionsSelectPlant.list.find(
                          (opt) => opt.value === optionsSelectPlant.selectedPie
                        )}
                        onChange={(e) => {
                          setOptionsSelectPlant({
                            ...optionsSelectPlant,
                            selectedPie: e !== null ? e.value : "",
                          });
                        }}
                        placeholder="All plant"
                        isClearable
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            minHeight: "42px",
                          }),
                          option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                            return {
                              ...styles,
                              backgroundColor: isDisabled
                                ? undefined
                                : isSelected ? "rgb(72, 96, 129)"
                                : isFocused ? "#6482AD"
                                : undefined,
                              color: "white",
                              ':active': {
                                ...styles[':active'],
                                backgroundColor: !isDisabled
                                  ? isSelected
                                    ? 'lightgrey'
                                    : 'white'
                                  : undefined,
                              },
                            };
                          },
                        }}
                      />
                    </div>
                    <div>
                      <CFormText>Filter by Date</CFormText>
                      <DatePicker
                        style={{ width: "130px" }}
                        format="yyyy-MM-dd"
                        placeholder="Select date"
                        value={filterDate}
                        onChange={(e) =>
                          setFilterDate(e !== null ? e : new Date())
                        }
                        placement="bottomEnd"
                        oneTap
                      />
                    </div>
                  </CCol>
                </CRow>
                {/* </CCardBody>
                    </CCard> */}
              </CCol>
            </CRow>

            {loading ? (
              <CustomTableLoading />
            ) : (
              <CRow className="d-flex align-items-between">
                <CCol sm="12" lg='8'>
                  <CCard>
                    <CCardBody>
                      <div>
                        <Pie
                          // className='p-5' style={{ background: "pink"}}
                          options={getPieChartOption()}
                          data={setPieChartData()}
                          height={550}
                        />
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol className="d-flex flex-column justify-content-between gap-4 gap-lg-0 pt-4 pt-lg-0">
                  <CCard className="px-0">
                    <CCardHeader
                      className="summary d-flex gap-3 align-items-center "
                      style={{
                        backgroundColor: "transparent",
                        borderBottom: "2px solid #00DB42",
                      }}
                    >
                      <FaCircleCheck
                        className="flex-grow-0"
                        style={{ color: "#00DB42", fontSize: "30px" }}
                      />
                      <h6>COMPLETED</h6>
                    </CCardHeader>
                    <CCardBody className="d-flex align-items-end gap-2 w-100">
                      <h2>
                        {dataPieChart.length !== 0 ? dataPieChart.completed : 0}
                      </h2>
                      <h4 className="mb-1">Materials</h4>
                      <div className="d-flex justify-content-end w-100">
                        <FaBoxesPacking style={{ fontSize: "50px" }} />
                      </div>
                    </CCardBody>
                  </CCard>

                  <CCard className="px-0">
                    <CCardHeader
                      className="summary d-flex gap-3 align-items-center "
                      style={{
                        backgroundColor: "transparent",
                        borderBottom: "2px solid #FFD43B",
                      }}
                    >
                      <FaCircleExclamation
                        className="flex-grow-0"
                        style={{ color: "#FFD43B", fontSize: "30px" }}
                      />
                      <h6>NOT COMPLETED</h6>
                    </CCardHeader>
                    <CCardBody className="d-flex align-items-end gap-2">
                      <h2>
                        {dataPieChart.length !== 0
                          ? dataPieChart.notCompleted
                          : 0}
                      </h2>
                      <h4 className="mb-1">Materials</h4>
                      <div className="d-flex justify-content-end w-100">
                        <FaBoxesPacking style={{ fontSize: "50px" }} />
                      </div>
                    </CCardBody>
                  </CCard>

                  <CCard className="px-0">
                    <CCardHeader
                      className="summary d-flex gap-3 align-items-center "
                      style={{
                        backgroundColor: "transparent",
                        borderBottom: "2px solid #FF0000",
                      }}
                    >
                      <FaCircleXmark
                        className="flex-grow-0"
                        style={{ color: "#FF0000", fontSize: "30px" }}
                      />
                      <h6>NOT DELIVERED</h6>
                    </CCardHeader>
                    <CCardBody className="d-flex align-items-end gap-2">
                      <h2>
                        {dataPieChart.length !== 0
                          ? dataPieChart.notDelivered
                          : 0}
                      </h2>
                      <h4 className="mb-1">Materials</h4>
                      <div className="d-flex justify-content-end w-100">
                        <FaBoxesPacking style={{ fontSize: "50px" }} />
                      </div>
                    </CCardBody>
                  </CCard>

                  <CCard className="px-0">
                    <CCardHeader
                      className="summary d-flex gap-3 align-items-center "
                      style={{
                        backgroundColor: "transparent",
                        borderBottom: "2px solid lightblue",
                      }}
                    >
                      <FaCircleInfo
                        className="flex-grow-0"
                        style={{ color: "lightblue", fontSize: "30px" }}
                      />
                      <h6>TOTAL</h6>
                    </CCardHeader>
                    <CCardBody className="d-flex align-items-end gap-2">
                      <h2>
                        {dataPieChart.length !== 0 ? dataPieChart.total : 0}
                      </h2>
                      <h4 className="mb-1">Materials</h4>
                      <div className="d-flex justify-content-end w-100">
                        <FaBoxesPacking style={{ fontSize: "50px" }} />
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            )}
          </CCardBody>
        </CCard>
      </CRow>

      {/* Modal List Materials */}
    </CContainer>
  );
};

export default Summary;
