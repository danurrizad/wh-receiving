import React,{useState,Suspense, useEffect} from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormCheck,
  CContainer,
  CCardTitle,
  CFormText,
  CFormLabel,
  CButton,
  CFormInput,
} from '@coreui/react'
import { FaCamera, FaInbox, FaMaskFace, FaTruck } from 'react-icons/fa6'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DatePicker, Input } from 'rsuite';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPeopleCarryBox,
  faTruck,
  faHelmetSafety,
  faFill,
} from "@fortawesome/free-solid-svg-icons";
import { FilterMatchMode } from 'primereact/api'
import Select  from 'react-select';
import { useToast } from '../../App'

const InquiryReq = () => {
  const [loading, setLoading] = useState(false);
  const addToast = useToast()
  const [filterQuery, setFilterQuery] = useState({
    date: new Date(),
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [showModal, setShowModal] = useState(false)
  const [dummyData, setDummyData] = useState([])
  const [modalUpdate, setModalUpdate] = useState(false);
const [modalData, setModalData] = useState(null); 
const [modalUpdate2, setModalUpdate2] = useState(false);
const [modalData2, setModalData2] = useState(null); 
const [modalUpdate3, setModalUpdate3] = useState(false);
const [modalData3, setModalData3] = useState(null); 
const [modalUpdate4, setModalUpdate4] = useState(false);
const [modalData4, setModalData4] = useState(null); 
  // Fungsi untuk menampilkan modal


  const exampleData = [
    {
    idSupplier: 1211134,
    supplierName: "Argamanunggal Abadi Utama PT",
    driverName: "Justin Beiber",
    typeMaterial: "Consumable",
    vehicleType: "Truck",
    receiveType: "Vendor",
    drivingEquipment: {
      licenseNumber: "",
      stnk: "",
      sim: ""
    },
    ppeEquipment: {
      safetyShoes: "",
      apd: ""
    },
    questionStatus:{
      questionSatu:"Finished",
      questionDua:"Unfinished",
      questionTiga:"Unfinished",
    },
    questionSum: "1/3",
    updatedAt: "2025-02-14"
  },
  {
    idSupplier: 1211138,
    supplierName: "Zeus",
    driverName: "Asep",
    typeMaterial: "Chemical",
    vehicleType: "Truck",
    receiveType: "Vendor",
    drivingEquipment: {
      licenseNumber: "",
      stnk: "",
      sim: ""
    },
    ppeEquipment: {
      safetyShoes: "",
      apd: ""
    },
    questionStatus:{
      questionSatu:"Finished",
      questionDua:"Finished",
      questionTiga:"Finished",
      questionEmpat:"Unfinished",
    },
    questionSum: "3/4",
    updatedAt: "2025-02-14"
  }
]

  const getData = async() => {
    setDummyData(exampleData)}

  useEffect(()=>{
    getData()
  }, [])
  
  const onGlobalFilterChange = (e) => {
    const value = e;
    let _filters = { ...filterQuery };

    _filters['global'].value = value;

    setFilterQuery(_filters);
    setGlobalFilterValue(value);
  };

  const renderCustomEmptyMsg = () => {
    return(
      <div className='empty-msg w-100 d-flex flex-column align-items-center justify-content-center py-3' style={{ color: "black", opacity: "50%"}}>
        <FaInbox size={40}/>
        <p>DATA NOT FOUND!</p>
      </div>
    )
  }

  const Question1Template = (rowBody) => {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center">
        <CButton
          onClick={() => {
            setModalData(rowBody); // Set data sebelum menampilkan modal
            setModalUpdate(true);  // Tampilkan modal
          }}
          color="info"
          className="d-flex justify-content-center align-items-center p-2"
        >
          <FontAwesomeIcon icon={faPeopleCarryBox} style={{ color: "white" }} />
        </CButton>
        <span style={{ color: "red", fontSize: "8px", marginTop: "5px" }}>
        {rowBody.questionStatus?.questionSatu}
        </span>
      </div>
    );
  };

  const Question2Template = (rowBody) => {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center">
        <CButton
          onClick={() => {
            setModalData2(rowBody); // Set data sebelum menampilkan modal
            setModalUpdate2(true);  // Tampilkan modal
          }}
          color="info"
          className="d-flex justify-content-center align-items-center p-2"
        >
          <FontAwesomeIcon icon={faTruck} style={{ color: "white" }} />
        </CButton>
        <span style={{ color: "red", fontSize: "8px", marginTop: "5px" }}>
        {rowBody.questionStatus?.questionDua}
        </span>
      </div>
    );
  };
  const Question3Template = (rowBody) => {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center">
        <CButton
          onClick={() => {
            setModalData3(rowBody); // Set data sebelum menampilkan modal
            setModalUpdate3(true);  // Tampilkan modal
          }}
          color="info"
          className="d-flex justify-content-center align-items-center p-2"
        >
          <FontAwesomeIcon icon={faHelmetSafety} style={{ color: "white" }} />
        </CButton>
        <span style={{ color: "red", fontSize: "8px", marginTop: "5px" }}>
        {rowBody.questionStatus?.questionTiga}
        </span>
      </div>
    );
  };
  const Question4Template = (rowBody) => {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center">
        <CButton
          onClick={() => {
            setModalData4(rowBody); // Set data sebelum menampilkan modal
            setModalUpdate4(true);  // Tampilkan modal
          }}
          color="info"
          className="d-flex justify-content-center align-items-center p-2"
        >
          <FontAwesomeIcon icon={faFill} style={{ color: "white" }} />
        </CButton>
        <span style={{ color: "red", fontSize: "8px", marginTop: "5px" }}>
        {rowBody.questionStatus?.questionEmpat}
        </span>
      </div>
    );
  };
  const apdData = [
    { item: "Helmet", status: "Pakai", statusColor: "text-success" },
    { item: "Vest", status: "Pakai", statusColor: "text-success" },
    { item: "Perlengkapan lain", status: "Tidak Pakai", statusColor: "text-danger" }
  ];
  

  return (
    <CContainer fluid>
      <CRow>
        <CCard className='p-0 mb-4' style={{ border: "1px solid #6482AD"}}>
          <CCardHeader style={{ backgroundColor: "rgb(100, 130, 173)", color: "white"}}>
            <CCardTitle className="text-center">INQUIRY VENDOR REQUIREMENT</CCardTitle>
          </CCardHeader>
          <CCardBody>
            <CRow className='d-flex align-items-end justify-content-between'>
              <CCol>
              <Button
                type="button"
                label="Export To Excel"
                icon="pi pi-file-excel"
                severity="success"
                className="rounded-2 me-2 mb-1 py-2 text-white"
                data-pr-tooltip="XLS"
              />
              </CCol>
              <CCol className='d-flex justify-content-end gap-3'>
                <div>
                  <CFormText>Search</CFormText>
                  <Input value={globalFilterValue} onChange={onGlobalFilterChange} placeholder='Keyword search'/>
                </div>
                <div>
                  <CFormText>Filter by Updated Date</CFormText>
                  <DatePicker 
                    format='yyyy-MM-dd'
                    oneTap
                    value={filterQuery.date ? filterQuery.date : null} 
                    placeholder="All time"
                    onChange={(e)=>{
                      console.log(e)
                      setFilterQuery({ ...filterQuery, date: e !== null ? e.toLocaleDateString('en-CA') : ""})
                    }} />
                </div>
              </CCol>
            </CRow>
            <CRow className='mt-4'>
              <DataTable 
                className='p-datatable-gridlines p-datatable-sm custom-datatable text-nowrap' 
                loading={loading} 
                emptyMessage={renderCustomEmptyMsg} 
                filters={filterQuery}
                value={dummyData} 
                removableSort
                scrollable 
                scrollHeight="500px" 
                showGridlines  
                stripedRows
                paginator 
                rows={10} 
                rowsPerPageOptions={[10, 25, 50, 100]} 
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                tableStyle={{ minWidth: '50rem' }}
              >
                {/* <Column field="no" header="No" body={(rowData, { rowIndex }) => rowIndex + 1}></Column> */}
                <Column field="idSupplier" sortable header="Id Vendor"></Column> 
                <Column field="supplierName" sortable header="Vendor Name"></Column> 
                <Column field="typeMaterial"  header="Type Material"></Column> 

                <Column field="vehicleType"  header="Question 1" body={Question1Template} ></Column>
                <Column field="vehicleType"  header="Question 2" body={Question2Template}></Column>
                <Column field="vehicleType"  header="Question 3" body={Question3Template}></Column>  
                <Column field="vehicleType"  header="Question 4" body={Question4Template}></Column>  

                <Column field="questionSum"sortable header="Status " align='center' ></Column>
                <Column field="" sortable header="Adjust" align='center' ></Column>
                
                <Column field="updatedAt" sortable header="Updated At"></Column>
              </DataTable>
            </CRow>
          </CCardBody>
        </CCard>
      </CRow>
  {/* Modal  1*/}
        <CModal size="xl" visible={modalUpdate} onClose={() => setModalUpdate(false)} backdrop="static">
        <CModalHeader closeButton>
          <CModalTitle className="fw-bold fs-5">Modal Summary Requirement</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <span className="fw-bold fs-6">Identitas Vendor Driver</span>
          {/* Form Identitas */}
          <CRow className="mt-3">
            <CFormText className="fw-bold" style={{ fontStyle: "italic", fontSize: "13px" }}>
              1. Vendor
            </CFormText>
            <CCol md="3">
              <CFormText>Vendor Code</CFormText>
              <CFormInput type="text" inputMode="numeric" placeholder="Masukkan kode vendor" />
            </CCol>
            <CCol md="5">
              <CFormText>Vendor Name</CFormText>
              <CFormInput type="text" inputMode="numeric" disabled placeholder="Masukkan kode vendor terlebih dahulu" />
            </CCol>
            <CCol md="3">
              <CFormText>Truck Station</CFormText>
              <CFormInput type="text" inputMode="numeric" placeholder="Masukkan truck station" />
            </CCol>
            <CCol md="1">
            <CFormCheck id="checkboxNoLabel" value=""  />
            </CCol>

          </CRow>
          <hr />

          {/* Form Driver */}
          <CRow className="my-2">
            <CFormText className="fw-bold" style={{ fontStyle: "italic", fontSize: "13px" }}>
              2. Driver
            </CFormText>
            <CCol md="5">
              <CFormText>Nama Driver</CFormText>
              <CFormInput type="text" placeholder="Masukkan nama Anda" />
            </CCol>
            <CCol md="3">
              <CFormText>Apakah Anda Dalam Kondisi Sehat?</CFormText>
              <div>
                <CButton color="success" variant="outline" className="mx-2">
                  Yes
                </CButton>
                <CButton color="danger" variant="outline" className="mx-2">
                  No
                </CButton>
              </div>
            </CCol>
            <CCol md="3">
              <CFormText>Kondisi yang dirasakan apabila Tidak Sehat</CFormText>
              <CFormInput type="text" inputMode="numeric" placeholder="..." />
            </CCol>
            <CCol md="1">
            <CFormCheck id="checkboxNoLabel" value=""  />
            </CCol>
          </CRow>
          <hr />

          {/* Form Vehicle */}
          <CRow className="mb-2">
            <CFormText className="fw-bold" style={{ fontStyle: "italic", fontSize: "13px" }}>
              3. Vehicle
            </CFormText>
            <CCol md="6">
              <CFormText>Tipe Pengiriman</CFormText>
              <CFormInput type="text" inputMode="numeric" placeholder="Insert delivery type" />
            </CCol>
            <CCol md="5">
              <CFormText>Jenis Kendaraan</CFormText>
              <CFormInput type="text" inputMode="numeric" placeholder="Insert vehicle type" />
            </CCol>
            <CCol md="1">
            <CFormCheck id="checkboxNoLabel" value=""  />
            </CCol>
          </CRow>
        </CModalBody>
      </CModal>
       {/* Modal  2*/}
       <CModal size="xl" visible={modalUpdate2} onClose={() => setModalUpdate2(false)} backdrop="static">
        <CModalHeader closeButton>
          <CModalTitle className="fw-bold fs-4">Identitas Vendor Driver</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <span>Silahkan lengkapi identitas Anda</span>
         <CRow>
          <CFormText
            style={{
              fontStyle: "italic",
              fontSize: "13px",
              fontWeight: "bold",
              marginTop: "10px",
            }}
          >
            1. SIM
          </CFormText>
          <CCol md="3">
            <CFormText>Apakah Anda Membawa SIM?</CFormText>
            <div>
              <CButton
                color="success"
                variant="outline"
                className="mx-2"
              >
                Ya
              </CButton>
              <CButton
                color="danger"
                variant="outline"
                className="mx-2"
              >
                Tidak
              </CButton>
            </div>
          </CCol>
          <CCol md="5">
            <CFormText>Berapa Jangka Waktu SIM Anda?</CFormText>
            <CFormInput
              type="text"
              inputMode="numeric"
              placeholder="Silahkan isi"
            />
          </CCol>
          <CCol md="1">
            <CFormCheck id="checkboxNoLabel" value=""  />
            </CCol>
        </CRow>
        <hr />
        <CRow className="mb-2">
            <CFormText
              style={{
                fontStyle: "italic",
                fontSize: "13px",
                fontWeight: "bold",
                marginTop: "10px",
              }}
            >
              2. STNK
            </CFormText>
            <CCol md="3">
              <CFormText>Apakah Anda Membawa STNK</CFormText>
              <div>
                <CButton
                  color="success"
                  variant="outline"
                  className="mx-2"
                  // onClick={() => setIsSTNKButtonDisabled(false)}
                >
                  Ya
                </CButton>
                <CButton
                  color="danger"
                  variant="outline"
                  className="mx-2"
                  // onClick={() => setIsSTNKButtonDisabled(true)}
                >
                  Tidak
                </CButton>
              </div>
            </CCol>

            <CCol md="3">
              <CFormText>
                Kondisi pajak SIM Anda
              </CFormText>
              <div>
                <CButton
                  color="success"
                  variant="outline"
                  // onClick={() => setIsInputSTNKDisabled(false)}
                  // disabled={isSTNKButtonDisabled}
                  className="mx-2"
                >
                  Hidup
                </CButton>
                <CButton
                  color="danger"
                  variant="outline"
                  // onClick={() => setIsInputSTNKDisabled(true)}
                  // disabled={isSTNKButtonDisabled}
                  className="mx-2"
                >
                  Mati
                </CButton>
              </div>
            </CCol>
            <CCol md="5">
              <CFormText>
                Berapa lama Jangka Pajak STNK anda
              </CFormText>
              <CFormInput
                type="text"
                inputMode="numeric"
                placeholder="Insert DN Number"
                // disabled={isInputSTNKDisabled}
              />
            </CCol>
            <CCol md="1">
            <CFormCheck id="checkboxNoLabel" value=""  />
            </CCol>
        </CRow>
        <hr />
        <CRow className="mb-2">
          <CFormText
            style={{
              fontStyle: "italic",
              fontSize: "13px",
              fontWeight: "bold",
              marginTop: "10px",
            }}
          >
            2. Plat No
          </CFormText>
          <CCol md="5">
            <CFormText>
              Apakah Plat No Polisi Anda Terpasang?
            </CFormText>
            <div>
              <CButton
                color="success"
                variant="outline"
                className="mx-2"
                // onClick={() => setIsInputPlatDisabled(false)}
              >
                Ya
              </CButton>
              <CButton
                color="danger"
                variant="outline"
                className="mx-2"
                // onClick={() => setIsInputPlatDisabled(true)}
              >
                Tidak
              </CButton>
            </div>
          </CCol>
          <CCol md="5">
            <CFormText>
              Berapakah Akhir Periode Plat No Polisi anda?
            </CFormText>
            <CFormInput
              type="text"
              inputMode="numeric"
              placeholder="Silahkan isi"
              // disabled={isInputPlatDisabled}
            />
          </CCol>
          <CCol md="1">
            <CFormCheck id="checkboxNoLabel" value=""  />
            </CCol>
        </CRow>
        </CModalBody>
      </CModal>

  {/* Modal  3*/}
  <CModal size="xl" visible={modalUpdate3} onClose={() => setModalUpdate3(false)} backdrop="static">
  <CModalHeader closeButton>
    <CModalTitle className="fw-bold fs-4">Identitas Vendor Driver</CModalTitle>
  </CModalHeader>
  <CModalBody>
    <span className="fw-bold fs-5">Identitas Vendor Driver</span>
    <CRow className="mt-3">
      {/* Kartu di pojok kiri */}
      <CCol md="6">
        <CCard className="shadow-sm">
          <CCardHeader className="fw-bold">APD Requirement Info</CCardHeader>
          <CCardBody>
            <CCard className="shadow-sm text-center">
            <CCardBody className="d-flex flex-column align-items-center justify-content-center" style={{ height: "400px" }}>
              <img 
                src="https://via.placeholder.com/150" // Ganti dengan URL gambar orang pakai APD
                alt="Foto APD"
                style={{ width: "150px", height: "200px", objectFit: "cover", borderRadius: "8px" }}
              />
            </CCardBody>
          </CCard>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Bagian kanan dengan 3 row */}
      <CCol className='mt-3' >
      <CRow>
          <CCol md="12">
          <span className="fs-5 fw-bold fst-italic">Info Kelengkapan APD</span>

          </CCol>
        </CRow>
        <DataTable value={apdData} showGridlines responsiveLayout="scroll">
          <Column field="item" header="Kelengkapan APD" body={(rowData) => (
            <span className="fs-6 fw-bold">{rowData.item}</span>
          )} />
          <Column field="status" header="Status" body={(rowData) => (
            <span className={`fs-6 fw-bold ${rowData.statusColor}`}>{rowData.status}</span>
          )} />
          
        </DataTable>
      </CCol>
    </CRow>
  </CModalBody>
</CModal>


<CModal size="xl" visible={modalUpdate4} onClose={() => setModalUpdate4(false)} backdrop="static">
  <CModalHeader closeButton>
    <CModalTitle className="fw-bold fs-4">Identitas Vendor Driver</CModalTitle>
  </CModalHeader>
  <CModalBody>
    <CRow>
    <CCol md='5'>
      <CFormText >Apakah Anda Membawa Seal ?</CFormText>
      <div>
        <CButton color="success" variant="outline" className="mx-2">Ya</CButton>
        <CButton color="danger" variant="outline"  className="mx-2">Tidak</CButton>
      </div>
    </CCol>
  </CRow>
  
  <hr/>
  <CRow>
    <CCol md='5'>
      <CFormText >Apakah Anda Membawa Barang Tidak Tumpah?</CFormText>
      <div>
        <CButton color="success" variant="outline" className="mx-2">Ya</CButton>
        <CButton color="danger" variant="outline"  className="mx-2">Tidak</CButton>
      </div>
    </CCol>
  </CRow>
  <hr/>
  <CRow>
    <CCol md='5'>
      <CFormText >Apakah Anda Memastikan tidak memebawa alat/barang yang dapat menyebabkan kebakaran
        ?</CFormText>
      <div>
        <CButton color="success" variant="outline" className="mx-2">Ya</CButton>
        <CButton color="danger" variant="outline"  className="mx-2">Tidak</CButton>
      </div>
    </CCol>
  </CRow>
  <hr/>
  <CRow>
    <CCol md='5'>
      <CFormText >Apakah Anda Memastikan Barang Chemical yang ada bawa  tidak membuang ke saluran air
        ?</CFormText>
      <div>
        <CButton color="success" variant="outline" className="mx-2">Ya</CButton>
        <CButton color="danger" variant="outline"  className="mx-2">Tidak</CButton>
      </div>
    </CCol>
  </CRow>
  </CModalBody>
</CModal>
    

    </CContainer>
  )
}

export default InquiryReq