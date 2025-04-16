// exportStudents.js
import { db, collection, getDocs } from "./firebase-config.js";

export async function exportStudentsToExcel() {
  try {
    // Fetching all student data from Firestore collection
    const snapshot = await getDocs(collection(db, "students"));
    const students = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      const processedData = { id: doc.id };

      // Loop through all fields and check for Timestamp
      for (const [key, value] of Object.entries(data)) {
        if (value && typeof value.toDate === "function") {
          // If it's a Firestore Timestamp, convert it to a readable date format
          processedData[key] = value.toDate().toLocaleString(); // You can change format here if needed
        } else {
          // If it's not a timestamp, just assign the value as-is
          processedData[key] = value !== undefined ? value : ""; // Handling empty or null fields
        }
      }

      // Add the processed student data to the list
      students.push(processedData);
    });

    // If there are no students, alert the user
    if (students.length === 0) {
      alert("No student data found.");
      return;
    }

    // Convert student data to Excel format using SheetJS
    const worksheet = XLSX.utils.json_to_sheet(students);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    // Download the Excel file
    XLSX.writeFile(workbook, "student_list.xlsx");
  } catch (error) {
    console.error("Export Error:", error);
    alert("Failed to export student data.");
  }
}
