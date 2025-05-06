import * as XLSX from 'xlsx';

export const handleExport = (dataItems, type) => {
  let dataToExport = [];
  if (type === "schedule") {
    const exportData = dataItems.map((data, index) => ({
      No: index + 1,
      'Vendor ID': data.vendor_id,
      'Vendor Name': data.vendor_name,
      Day: data.day,
      Date: data.date,
      'Schedule Time (From)': data.schedule_from,
      'Schedule Time (To)': data.schedule_to,
      'Arrival Time': data.arrival_time,
      Status: data.status,
      'Delay Time': data.delay_time !== 0 ? `- ${data.delay_time}` : "",
    }));
    dataToExport.push(exportData);
  } else if (type === "receiving") {
    const exportData = dataItems.map((data, index) => ({
      No: index + 1,
      'DN No': data.dn_no,
      'Material No': data.material_no,
      'Material Description': data.material_desc,
      'Planning Quantity': data.req_qty,
      'Actual Quantity': data.actual_qty,
      'Difference': data.req_qty - data.actual_qty,
      Date: data.date,
    }));
    dataToExport.push(exportData);
  }

  // Convert JSON to worksheet
  const worksheet = XLSX.utils.json_to_sheet(dataToExport[0]);

  // Apply conditional styling for rows
  dataItems.forEach((data, index) => {
    const rowIndex = index + 1; // Offset by 1 because header is row 0

    if (type === "schedule" && data.status === "Delayed") {
      // Highlight the row where the status is "Delayed"
      const startCol = XLSX.utils.encode_cell({ r: rowIndex, c: 0 }); // Start cell (first column)
      const endCol = XLSX.utils.encode_cell({ r: rowIndex, c: Object.keys(dataToExport[0][0]).length - 1 }); // Last column

      for (let col = startCol.charCodeAt(0); col <= endCol.charCodeAt(0); col++) {
        const cell = `${String.fromCharCode(col)}${rowIndex + 1}`;
        if (worksheet[cell]) {
          worksheet[cell].s = {
            fill: { fgColor: { rgb: "FF0000" } }, // Red background
            font: { color: { rgb: "FFFFFF" } }, // White text
          };
        }
      }
    }
  });

  // Create a workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Table Data');

  // Export to Excel file
  XLSX.writeFile(workbook, 'TableData.xlsx');
};

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
          fileName + '_export_' + new Date().toLocaleDateString('en-CA') + '_' + new Date().toLocaleTimeString('id-ID').replaceAll(".", "") + EXCEL_EXTENSION,
        )
      }
    }
  })
}

export const exportExcelInquiryVendor = (data) => {
  import('xlsx').then((xlsx) => {
    const mappedData = data.map((item) => ({
      "Movement Date": item.movementDate,
      "Vendor Name": item.supplierName,
      "Rit": item.rit,
      "Truck Station": item.truckStation,
      "Plant": item.plantName,
      "Planning": item.arrivalPlanTime ? `${item.arrivalPlanTime.split("T")[1].slice(0, 5)} - ${item.departurePlanTime.split("T")[1].slice(0, 5)}` : "-",
      "Arrival": item.arrivalActualTime.split("T")[1].slice(0, 5),
      "Status": item.status,
    }))

    // Deklarasikan worksheet hanya sekali
    const worksheet = xlsx.utils.json_to_sheet(mappedData)
    const workbook = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Inquiry Vendor')

    // Tulis workbook ke dalam buffer array
    const excelBuffer = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })

    // Panggil fungsi untuk menyimpan file Excel
    saveAsExcelFile(excelBuffer, 'Inquiry_Vendor')
  })
}

export const exportExcelInquiryDN = (data) => {
  import('xlsx').then((xlsx) => {
    const mappedData = data.map((item) => ({
      "Delivery Date": item.deliveryDate,
      "DN Number": item.dnNumber,
      "Vendor Name": item.supplierName,
      "Plant": item.plantName,
      "Status Received": `${item.completeItems}/${item.totalItems}`,
      "Updated Date": item.updatedAt.split("T")[0],
      "Updated Time": new Date(item?.updatedAt).toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      }).replace('.', ':'),
    }))

    // Deklarasikan worksheet hanya sekali
    const worksheet = xlsx.utils.json_to_sheet(mappedData)
    const workbook = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Inquiry Vendor')

    // Tulis workbook ke dalam buffer array
    const excelBuffer = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })

    // Panggil fungsi untuk menyimpan file Excel
    saveAsExcelFile(excelBuffer, 'Inquiry_DN')
  })
}
