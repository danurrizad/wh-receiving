import React,{useState,Suspense, useEffect} from 'react'

import { Button } from 'primereact/button'
import Flatpickr from 'react-flatpickr'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CRow,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CSpinner,
  CFormLabel,
  CContainer,
  CCardTitle,
  CFormText,
} from '@coreui/react'
import { FaInbox, FaPenToSquare, FaTrashCan } from 'react-icons/fa6'
import useScheduleDataService from '../../services/ScheduleDataService'
import useMasterDataService from '../../services/MasterDataService'
import { useToast } from '../../App'
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import Select from 'react-select';
import Swal from 'sweetalert2'
import { TimePicker } from 'rsuite'
import CustomTableLoading from '../../components/LoadingTemplate'
// import templateDeliverySchedule from '../../assets/files/template_delivery_schedule.xlsx'


const VendorSetup = () => {
      const colorMode = localStorage.getItem('coreui-free-react-admin-template-theme')
      const addToast = useToast()
      const [modalUpload, setModalUpload] = useState(false)
      const [modalAdd, setModalAdd] = useState(false)
      const [modalUpdate, setModalUpdate] = useState(false)
      const [formModal, setFormModal] = useState({})
      const [formModalId, setFormModalId] = useState()

      const [date, setDate] = useState(new Date().toLocaleDateString('en-GB'))
      const [loadingImport, setLoadingImport] = useState(false)
      const [uploadData, setUploadData] = useState({
        file: null,
        importDate: new Date()
      })
      const { getScheduleAllData } = useScheduleDataService()
      const { getMasterData, postMasterData, updateMasterDataById, deleteMasterDataById, uploadMasterData } = useMasterDataService()
      const [dataSchedule, setDataSchedule] = useState([])

      const getScheduleAll = async(plantId, day) => {
        try {
          setLoading(true)
          const response = await getScheduleAllData(plantId, day)
          setDataSchedule(response.data.data)
        } catch (error) {
          console.error(error)
          setDataSchedule([])
        } finally{
          setLoading(false)
        }
      }
      
      const [loading, setLoading] = useState(true);
      const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        day: "",
        plant: "",
      });
      const [globalFilterValue, setGlobalFilterValue] = useState('');
      const [ optionsWarehouse, setOptionsWarehouse ] = useState({
        list: [],
        selected: ""
      })
      const [ optionsPlant, setOptionsPlant ] = useState({
        list: [],
        selected: ""
      })
      const [ optionsSupplier, setOptionsSupplier ] = useState({
        list: [],
        selected: ""
      })
      const optionsDay = [
        { value: 0, label: 'Sunday' },
        { value: 1, label: 'Monday' },
        { value: 2, label: 'Tuesday' },
        { value: 3, label: 'Wednesday' },
        { value: 4, label: 'Thursday' },
        { value: 5, label: 'Friday' },
        { value: 6, label: 'Saturday'},
      ]
      const [selectedOptionsDay, setSelectedOptionsDay] = useState(new Date().getDay()) 
      
      const getDays = (day) => {
        switch (day) {
          case 0:
            return 'Sunday'
          case 1:
            return 'Monday'
          case 2:
            return 'Tuesday'
          case 3:
            return 'Wednesday'
          case 4:
            return 'Thursday'
          case 5:
            return 'Friday'
          case 6:
            return 'Saturday'
        }
      } 

      const getOptionsWarehouse = async() => {
        try {
          const response = await getMasterData(`warehouse-public`)
          setOptionsWarehouse({
            ...optionsWarehouse,
            list: response.data.map((data)=>{
              return{
                value: data.id,
                label: data.warehouseName
              }
            })
          })
        } catch (error) {
         console.error(error) 
        }
      }

      const getOptionsPlant = async() => {
        try {
          const response = await getMasterData(`plant-public`)
          setOptionsPlant({
            ...optionsPlant,
            list: response.data.map((data)=>{
              return{
                value: data.id,
                label: data.plantName
              }
            })
          })
        } catch (error) {
          console.error(error)
        }
      }

      const getOptionsSupplier = async() => {
        try {
          const response = await getMasterData('supplier-public')
          setOptionsSupplier({
            ...optionsSupplier,
            list: response.data.map((data)=>{
              return{
                value: Number(data.id),
                label: `${data.supplierCode} - ${data.supplierName}`
              }
            })
          })
        } catch (error) {
          console.error(error)
        }
      }

      useEffect(()=>{
        getOptionsPlant()
        getOptionsWarehouse()
        getOptionsSupplier()
      }, [])

      const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
    
        _filters['global'].value = value;
    
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

      useEffect(()=>{
        getScheduleAll(optionsPlant.selected, selectedOptionsDay)
      }, [selectedOptionsDay, optionsPlant.selected])


      const exportExcel = () => {
        import('xlsx').then((xlsx) => {
          const mappedData = dataSchedule.map((item) => ({
            "Vendor Code": item.Supplier.supplierCode,
            "Vendor Name": item.Supplier.SupplierName,
            "Day": getDays(item.schedule),
            "Arrival Time": formatTime(item.arrival),
            "Departure Time": formatTime(item.departure),
            "Rit": item.rit,
            "Plant": item.Plant.PlantName,
            "Truck Station": item.truckStation,
          }))
    
          // Deklarasikan worksheet hanya sekali
          const worksheet = xlsx.utils.json_to_sheet(mappedData)
          const workbook = xlsx.utils.book_new()
          xlsx.utils.book_append_sheet(workbook, worksheet, 'Vendor Setup')
    
          // Tulis workbook ke dalam buffer array
          const excelBuffer = xlsx.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
          })
    
          // Panggil fungsi untuk menyimpan file Excel
          saveAsExcelFile(excelBuffer, 'vendor_setup')
        })
      }

      const downloadTemplate = (fileName) => {
        const fileUrl = `/files/${fileName}`; // Access files in public/files/
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      const handleDateChange = (selectedDate) => {
        setDate(selectedDate[0])
        setUploadData((prevData) => ({
          ...prevData,
          importDate: selectedDate[0],
        }))
      }
    
      const handleFileChange = (e) => {
        const file = e.target.files[0]
        setUploadData((prevData) => ({
          ...prevData,
          file: file,
        }))
      }
    
      const showModalUpload = () => {
        setModalUpload(true)
      } 
    
      const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then((module) => {
          if (module && module.default) {
            let EXCEL_TYPE =
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
            let EXCEL_EXTENSION = '.xlsx'
            const data = new Blob([buffer], {
              type: EXCEL_TYPE,
            })
    
            if (fileName === 'template_master_data_material') {
              module.default.saveAs(
                data,
                fileName + '_download_' + new Date().getTime() + EXCEL_EXTENSION,
              )
            } else {
              module.default.saveAs(
                data,
                fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION,
              )
            }
          }
        })
      }


      const handleUploadFileSchedule = async(file, importDate) => {
        try {
          setLoading(true)
          const warehouseId = optionsWarehouse.selected

          const formData = new FormData()
          formData.append('file', file)
          formData.append('importDate', importDate)

          const response = await uploadMasterData(`upload-delivery-schedule/${warehouseId}`, formData)
          addToast(response.data.message, 'success', 'success')
          if (response?.data?.errors) {
            response.data.errors.forEach((err) => {
              addToast(err.error, 'danger', 'error')
            });
          }
          setModalUpload(false)
          getScheduleAll(optionsPlant.selected, selectedOptionsDay)
        } catch (error) {
          console.error("Error response upload :", error)          
        } finally{
          setLoading(false)
        }
      }

      const formatTime = (dateStr) => {
        return dateStr.split("T")[1].slice(0, 5); 
      };

      const formatTimeOnly = (dateStr) => {
        const timeParts = dateStr.split(":");
        const formattedTime = `${timeParts[0]}:${timeParts[1]}`;
        return formattedTime; 
      };

  
    const renderCustomEmptyMsg = () => {
        return(
          <div className='empty-msg w-100 d-flex flex-column align-items-center justify-content-center py-3' style={{ color: "black", opacity: "50%"}}>
            <FaInbox size={40}/>
            <p>Schedules Data Not Found!</p>
          </div>
        )
      }

    const showModalUpdate = (data) => {
      setFormModal({
        ...formModal,
        supplierId: Number(data?.Supplier?.id),
        schedule: data?.schedule,
        arrival: formatTime(data?.arrival),
        departure: formatTime(data?.departure),
        rit: data?.rit,
        plantId: data?.plantId,
        truckStation: data?.truckStation
      })
      setFormModalId(data?.id)
      setModalUpdate(true)
    }

    const showSwalDelete = (data) => {
      Swal.fire({
        title: "Delete Confirmation",
        html: `
          <div>
            <p>Are you sure want to delete this schedule? </p>
            <p>${data?.Supplier?.SupplierName} </p>
            <p>Rit : ${data?.rit} </p>
          </div>`,
        icon: "warning",
        showCancelButton: true,
        // confirmButtonColor: "#3085d6",
        confirmButtonColor: 'rgb(246, 66, 66)',
        // cancelButtonColor: "#d33",
        confirmButtonText: "Delete",
        preConfirm: async () => {
          try {
            Swal.showLoading();
            const response = await deleteMasterDataById(`delivery-schedule-delete`, data?.id)            
            return "Schedule deleted!"
          } catch (error) {
            console.error(error)
            return error
          }
        }
      }).then(async(result) => {
        if (result.isConfirmed) {
          getScheduleAll(optionsPlant.selected, selectedOptionsDay)
          if(result.value === "Schedule deleted!"){
            Swal.fire({
              title: "Deleted!",
              text: result.value,
              icon: "success",
              confirmButtonColor: "#3085d6",
            });
          } else {
            Swal.fire({
              title: "Failed!",
              text: result.value,
              icon: "error",
              confirmButtonColor: "#3085d6",
            });
          }
        }
      });
    }

    const actionBodyTemplate = (rowData, rowIndex) => {
      return(
        <div className='d-flex align-items-center justify-content-center gap-3'>
          <CButton onClick={()=>showModalUpdate(rowData)} color='info' className='d-flex align-items-center justify-content-center'><FaPenToSquare style={{ color: "white"}}/></CButton>
          <CButton onClick={()=>showSwalDelete(rowData)} color='danger' className='d-flex align-items-center justify-content-center'><FaTrashCan style={{ color: "white"}}/></CButton>
        </div>
      )
    }

    const handleClickAdd = async() => {
      try {
        setLoadingImport(true)
        const response = await postMasterData('delivery-schedule', formModal)
        addToast(response.data.message, 'success', 'success')
        getScheduleAll(optionsPlant.selected, selectedOptionsDay)
        setModalAdd(false)
      } catch (error) {
        console.error(error)
      } finally{
        setLoadingImport(false)
      }
    }

    const handleClickUpdate = async() => {
      try {
        setLoadingImport(true)
        const response = await updateMasterDataById(`delivery-schedule`, formModalId, formModal)
        addToast(response.message, 'success', 'success')
        getScheduleAll(optionsPlant.selected, selectedOptionsDay)
        setModalUpdate(false)
      } catch (error) {
        console.error(error)
      } finally{
        setLoadingImport(false)
      }
    }

    const convertToDateTime = (timeString) => {
      const [hours, minutes] = timeString.split(":").map(Number); // Extract hours & minutes
      const date = new Date(2025, 1, 7, hours, minutes, 0); // Month is zero-based (1 = February)
      return date;
    };

    const styleSelect = {
      option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        return {
          ...styles,
          backgroundColor: isDisabled
            ? undefined
            : isSelected ? "rgb(72, 96, 129)"
            : isFocused ? "#6482AD"
            : undefined,
          color: colorMode === 'dark' && (!isFocused || isSelected) ? "white" : 
          isFocused ? "white" : 
          isSelected ? "white" :
          colorMode === 'light' && (!isFocused) ? "black" : "",
          ':active': {
            ...styles[':active'],
            color: "white",
            backgroundColor: !isDisabled
              ? isSelected
                ? 'rgb(37, 50, 70)'
                : 'rgb(37, 50, 70)'
              : undefined,
          },
          ':hover': {
            ...styles[':hover'],
            color: "white"
          }
        };
      },
    }

  return (
    <CContainer fluid>
      <CRow className=''>
          <CCard className='p-0 mb-3' style={{ border: "1px solid #6482AD"}}>
              <CCardHeader style={{ backgroundColor: "rgb(100, 130, 173)", color: "white"}}>
                  <CCardTitle className="text-center">VENDOR SCHEDULE DATA</CCardTitle>
              </CCardHeader>
              <CCardBody>
              <CRow className='mb-3'>
                <CCol xs={4} lg={8}>
                  <CFormText>Search</CFormText>
                  <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder='Keyword search' style={{ borderRadius: '5px', padding: "8px"}}/>
                </CCol>
                <CCol xs={4} lg={2}>
                  <CFormText>Filter by Plant</CFormText>
                  <Select 
                    isClearable
                    placeholder="All plant"
                    options={optionsPlant.list} 
                    value={optionsPlant?.list?.find((data)=>data.value === optionsPlant.selected) || ""}
                    styles={styleSelect}
                    onChange={(e)=>{
                      setOptionsPlant({
                        ...optionsPlant,
                        selected: e !== null ? e.value : ""
                      })
                    }}  
                  />
                </CCol>
                <CCol xs={4} lg={2}>
                  <CFormText>Filter by Day</CFormText>
                  <Select 
                    placeholder='All day'
                    options={optionsDay}
                    isClearable
                    value={optionsDay.find((opt)=>opt.value === selectedOptionsDay) || ""}
                    onChange={(e)=>{
                      setSelectedOptionsDay(e !== null ? Number(e.value) : "")
                    }}
                    styles={styleSelect}
                  />
                </CCol>
              </CRow>
              <hr/>
              <CRow className='mb-3'>
                <CCol className='d-flex align-items-center'>
                  <Button
                    type="button"
                    label="Add Data "
                    icon="pi pi-plus"
                    severity=""
                    className="rounded-2 me-2 mb-1 py-2 text-white"
                    onClick={()=>{
                      setFormModal({})
                      setModalAdd(true)
                    }}
                    data-pr-tooltip="XLS"
                  /> 
                  <Button
                    type="button"
                    label="Upload Data "
                    icon="pi pi-file-import"
                    severity="warning"
                    className="rounded-2 me-2 mb-1 py-2 text-white"
                    onClick={showModalUpload}
                    data-pr-tooltip="XLS"
                  /> 
                  <Button
                    type="button"
                    label="Export To Excel"
                    icon="pi pi-file-excel"
                    severity="success"
                    className="rounded-2 me-2 mb-1 py-2 text-white"
                    onClick={exportExcel}
                    data-pr-tooltip="XLS"
                  />
                  <Button
                    type="button"
                    label="Download Template"
                    icon="pi pi-file-export"
                    severity="success"
                    className="rounded-2 me-2 mb-1 py-2 text-white"
                    onClick={() => downloadTemplate('template_delivery_schedule.xlsx')}
                    data-pr-tooltip="XLS"
                  />
                </CCol>
              </CRow>
              <CRow className='px-3'>
                <CCard className='p-0 overflow-hidden' >
                  <CCardBody className="p-0">
                    <DataTable
                      loading={loading}
                      loadingIcon={<CustomTableLoading/>}
                      className='p-datatable-gridlines p-datatable-sm custom-datatable text-nowrap'
                      style={{ minHeight: "140px"}}
                      removableSort
                      filters={filters}
                      size='small'
                      emptyMessage={renderCustomEmptyMsg}
                      scrollable
                      scrollHeight="500px"
                      showGridlines
                      stripedRows
                      paginator
                      rows={10}
                      rowsPerPageOptions={[10, 25, 50, 100]}
                      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                      currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                      value={dataSchedule}
                      dataKey="id"
                      onFilter={(e) => setFilters(e.filters)}
                      filterDisplay="row"
                    >
                      <Column className='' header="No" body={(rowData, { rowIndex }) => rowIndex + 1} />
                      <Column className='' field='Supplier.supplierCode' sortable header="Vendor Code" />
                      <Column className='' field='Supplier.SupplierName' filterField='Supplier.SupplierName' sortable header="Vendor Name" />
                      <Column className='' field="schedule" filterField='schedule' sortable header="Day" body={(rowData) => getDays(rowData.schedule)} />
                      {/* <Column className='' field="arrival" sortable header="Arrival Time" dataType="date" body={(rowData) => rowData.arrival} /> */}
                      <Column className='' field="arrival" sortable header="Arrival Time" dataType="date" body={(rowData) => formatTime(rowData.arrival)} />
                      <Column className='' field="departure" sortable header="Departure Time" dataType="date" body={(rowData) => formatTime(rowData.departure)} />
                      <Column className='' field="rit" sortable header="Rit" dataType="number" />
                      <Column className='' field="Plant.PlantName" sortable header="Plant" />
                      <Column className='' field="truckStation" sortable header="Truck Station" />
                      <Column className='' header="Action" body={actionBodyTemplate} />
                    </DataTable>
                  </CCardBody>
                </CCard>
              </CRow>
                  


              {/* ---------------------------------------------------------------------MODAL----------------------------------------------------------------------------- */}
              {/* MODAL ADD */}
              <CModal visible={modalAdd} onClose={() => setModalAdd(false)} backdrop="static">
                <CModalHeader>
                  <CModalTitle id="LiveDemoExampleLabel">Add Vendor Schedule</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CRow className='mb-3'>
                    <CCol>
                      <CFormText>Vendor</CFormText>
                      <Select
                        options={optionsSupplier.list}
                        isClearable
                        value={optionsSupplier.list.find((data)=>data.value === formModal.supplierId) || ""}
                        onChange={(e)=>{
                          setFormModal({ ...formModal, supplierId: e !== null ? e.value : ""})
                        }}
                        styles={styleSelect}
                      />
                    </CCol>
                  </CRow>
                  <CRow className='mb-3'>
                    <CCol>
                      <CFormText>Day</CFormText>
                      <Select 
                        options={optionsDay} 
                        isClearable
                        value={optionsDay?.find((data)=>data.value === formModal.schedule) || ""}
                        onChange={(e)=>setFormModal({...formModal, schedule: e !== null ? Number(e.value) : ""})}
                        styles={styleSelect}
                      />
                    </CCol>
                    <CCol>
                      <CFormText>Rit</CFormText>
                      <CFormInput type='number' value={formModal.rit} onChange={(e)=>setFormModal({ ...formModal, rit: Number(e.target.value)})}/>
                    </CCol>
                  </CRow>
                  <CRow className='mb-3'>
                    <CCol>
                      <CFormText>Arrival Time</CFormText>
                      <TimePicker 
                        format="HH:mm" 
                        placeholder="Select time"
                        value={formModal?.arrival ? convertToDateTime(formModal?.arrival) : null}
                        onChange={(e)=>{
                          setFormModal({ ...formModal, arrival: formatTimeOnly(e.toLocaleTimeString())})
                        }}/>
                    </CCol>
                    <CCol>
                      <CFormText>Departure Time</CFormText>
                      <TimePicker 
                        format="HH:mm" 
                        placeholder="Select time"
                        value={formModal?.departure ? convertToDateTime(formModal?.departure) : null}
                        onChange={(e)=>{
                          setFormModal({ ...formModal, departure: formatTimeOnly(e.toLocaleTimeString())})
                        }}/>
                    </CCol>
                  </CRow>
                  <CRow className='mb-3'>
                    <CCol>
                      <CFormText>Plant</CFormText>
                      <Select
                        options={optionsPlant.list}
                        isClearable
                        value={optionsPlant?.list?.find((data)=>data.value === formModal.plantId) || ""}
                        onChange={(e)=>setFormModal({ ...formModal, plantId: e !== null ? Number(e.value) : ""})}
                        styles={styleSelect}
                      />
                    </CCol>
                    <CCol>
                      <CFormText>Truck Station</CFormText>
                      <CFormInput value={formModal.truckStation} onChange={(e)=>setFormModal({ ...formModal, truckStation: e.target.value})}/>
                    </CCol>
                  </CRow>
                </CModalBody>
                <CModalFooter>
                  <Suspense
                    fallback={
                    <div className="pt-3 text-center">
                      <CSpinner color="primary" variant="grow" />
                    </div>
                    }
                  >
                    <CButton color="success" disabled={loadingImport} className='text-white' onClick={handleClickAdd}>
                      {loadingImport ? (

                          <>
                            <CSpinner component="span" size="sm" variant="grow" className="me-2" />
                            Add...
                          </>
                        ) : (
                        'Add'
                      )}
                    </CButton>
                  </Suspense>
                </CModalFooter>
              </CModal>
              
              {/* MODAL UPDATE */}
              <CModal visible={modalUpdate} onClose={() => setModalUpdate(false)} backdrop="static">
                <CModalHeader>
                  <CModalTitle id="LiveDemoExampleLabel">Update Vendor Schedule</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CRow className='mb-3'>
                    <CCol>
                      <CFormText>Vendor Code</CFormText>
                      <Select
                        options={optionsSupplier.list}
                        isClearable
                        value={optionsSupplier.list.find((data)=>data.value === formModal.supplierId) || ""}
                        onChange={(e)=>{
                          setFormModal({ ...formModal, supplierId: e !== null ? e.value : ""})
                        }}
                      />
                    </CCol>
                  </CRow>
                  <CRow className='mb-3'>
                    <CCol>
                      <CFormText>Day</CFormText>
                      <Select 
                        options={optionsDay} 
                        isClearable
                        value={optionsDay?.find((data)=>data.value === formModal.schedule) || ""}
                        onChange={(e)=>setFormModal({...formModal, schedule: e !== null ? Number(e.value) : ""})}
                      />
                    </CCol>
                    <CCol>
                      <CFormText>Rit</CFormText>
                      <CFormInput value={formModal.rit} onChange={(e)=>setFormModal({ ...formModal, rit: Number(e.target.value)})}/>
                    </CCol>
                  </CRow>
                  <CRow className='mb-3'>
                    <CCol>
                      <CFormText>Arrival Time</CFormText>
                      <TimePicker 
                        format="HH:mm" 
                        placeholder="Select time"
                        value={formModal?.arrival ? convertToDateTime(formModal?.arrival) : null}
                        onChange={(e)=>{
                          setFormModal({ ...formModal, arrival: e !== null ? formatTimeOnly(e.toLocaleTimeString()) : ""})
                        }}/>
                    </CCol>
                    <CCol>
                      <CFormText>Departure Time</CFormText>
                      <TimePicker 
                        format="HH:mm" 
                        placeholder="Select time"
                        value={formModal?.departure ? convertToDateTime(formModal?.departure) : null}
                        onChange={(e)=>{
                          setFormModal({ ...formModal, departure: e !== null ? formatTimeOnly(e.toLocaleTimeString()) : ""})
                        }}/>
                    </CCol>
                  </CRow>
                  <CRow className='mb-3'>
                    <CCol>
                      <CFormText>Plant</CFormText>
                      <Select
                        options={optionsPlant.list}
                        isClearable
                        value={optionsPlant?.list?.find((data)=>data.value === formModal.plantId) || ""}
                        onChange={(e)=>setFormModal({ ...formModal, plantId: e !== null ? Number(e.value) : ""})}
                      />
                    </CCol>
                    <CCol>
                      <CFormText>Truck Station</CFormText>
                      <CFormInput value={formModal.truckStation} onChange={(e)=>setFormModal({ ...formModal, truckStation: e.target.value})}/>
                    </CCol>
                  </CRow>
                </CModalBody>
                <CModalFooter>
                  <Suspense
                    fallback={
                    <div className="pt-3 text-center">
                      <CSpinner color="primary" variant="grow" />
                    </div>
                    }
                  >
                    <CButton color="success" disabled={loadingImport} className='text-white' onClick={handleClickUpdate}>
                      {loadingImport ? (

                          <>
                            <CSpinner component="span" size="sm" variant="grow" className="me-2" />
                            Updating...
                          </>
                        ) : (
                        'Update'
                      )}
                    </CButton>
                  </Suspense>
                </CModalFooter>
              </CModal>

              {/* MODAL UPLOAD */}
              <CModal visible={modalUpload} onClose={() => setModalUpload(false)} backdrop='static'>
                <CModalHeader>
                  <CModalTitle id="LiveDemoExampleLabel">Upload Vendor Schedule</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <div className="mb-3">
                    <CFormLabel>Date</CFormLabel>
                    <Flatpickr
                      value={date}
                      options={{
                        dateFormat: 'Y-m-d',
                        maxDate: new Date(),
                        allowInput: true,
                      }}
                      onChange={handleDateChange}
                      disabled
                      className="form-control"
                      placeholder="Select a date"
                    />
                  </div>
                  <div className='mb-3'>
                    <CFormLabel>Warehouse</CFormLabel>
                    <Select
                      options={optionsWarehouse.list}
                      styles={styleSelect}
                      isClearable
                      value={optionsWarehouse.list.find((data)=>data.value === optionsWarehouse.selected) || ""}
                      onChange={(e)=>{
                        setOptionsWarehouse({
                          ...optionsWarehouse,
                          selected: e !== null ? e.value : ""
                        })
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <CFormInput
                      onChange={handleFileChange} // Handle perubahan file
                      type="file"
                      label="Excel File"
                      accept=".xlsx" // Hanya menerima file Excel
                    />
                  </div>
                </CModalBody>
                <CModalFooter>
                  <Suspense
                    fallback={
                    <div className="pt-3 text-center">
                      <CSpinner color="primary" variant="grow" />
                    </div>
                    }
                  >
                    <CButton color="success" disabled={loadingImport || !optionsWarehouse.selected || !uploadData.file} className='text-white' onClick={() => handleUploadFileSchedule(uploadData.file, uploadData.importDate)}>
                      {loadingImport ? (

                          <>
                            <CSpinner component="span" size="sm" variant="grow" className="me-2" />
                            Importing...
                          </>
                        ) : (
                        'Import'
                      )}
                    </CButton>
                  </Suspense>
                </CModalFooter>
              </CModal>
            </CCardBody>
          </CCard>
      </CRow>
    </CContainer>
  )
}
export default VendorSetup