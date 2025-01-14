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
  console.log("data to export :", dataToExport);

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
