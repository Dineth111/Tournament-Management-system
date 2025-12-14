import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaFilePdf, FaDownload } from 'react-icons/fa';

const TestPDF = () => {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(24);
    doc.setTextColor(220, 38, 38); // Red color
    doc.text('Expert Karate', 20, 25);
    
    // Add subtitle
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Tournament Management System', 20, 35);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
    
    // Add horizontal line
    doc.setDrawColor(220, 38, 38);
    doc.line(20, 50, 190, 50);
    
    // Add section title
    doc.setFontSize(18);
    doc.setTextColor(220, 38, 38);
    doc.text('Tournament Report', 20, 65);
    
    // Add a table using autotable
    doc.autoTable({
      startY: 75,
      head: [['ID', 'Tournament Name', 'Category', 'Status', 'Date']],
      body: [
        ['1', 'Summer Championship', 'Black Belt', 'Active', '2025-06-15'],
        ['2', 'Winter League', 'All Levels', 'Planning', '2025-12-10'],
        ['3', 'Youth Tournament', 'Youth', 'Full', '2025-08-22'],
        ['4', 'Master\'s Cup', 'Master', 'Completed', '2025-03-18'],
        ['5', 'Beginner Open', 'White/Yellow', 'Registration', '2025-07-05']
      ],
      theme: 'grid',
      styles: { 
        fontSize: 10,
        cellPadding: 3
      },
      headStyles: { 
        fillColor: [220, 38, 38],
        textColor: [255, 255, 255]
      },
      alternateRowStyles: { 
        fillColor: [245, 245, 245] 
      },
      margin: { horizontal: 20 }
    });
    
    // Add summary section
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(16);
    doc.setTextColor(220, 38, 38);
    doc.text('Summary', 20, finalY);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Total Tournaments: 5', 20, finalY + 10);
    doc.text('Active Tournaments: 2', 20, finalY + 17);
    doc.text('Completed Tournaments: 1', 20, finalY + 24);
    
    // Save the PDF
    doc.save('tournament-report.pdf');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 w-full max-w-2xl">
        <div className="px-8 py-10">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500 bg-opacity-20">
              <FaFilePdf className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="mt-6 text-3xl font-extrabold text-white">
              PDF Generation Test
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              Test the PDF report generation functionality
            </p>
          </div>
          
          <div className="mt-10 bg-gray-900 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Report Preview</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div>
                  <h3 className="font-medium text-white">Tournament Report</h3>
                  <p className="text-sm text-gray-400">Detailed tournament data and statistics</p>
                </div>
                <div className="bg-gradient-to-r from-red-600 to-yellow-500 w-10 h-10 rounded-full flex items-center justify-center">
                  <FaFilePdf className="text-white" />
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div>
                  <h3 className="font-medium text-white">Player Statistics</h3>
                  <p className="text-sm text-gray-400">Performance metrics and rankings</p>
                </div>
                <div className="bg-gradient-to-r from-red-600 to-yellow-500 w-10 h-10 rounded-full flex items-center justify-center">
                  <FaFilePdf className="text-white" />
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div>
                  <h3 className="font-medium text-white">Match Results</h3>
                  <p className="text-sm text-gray-400">Complete match history and outcomes</p>
                </div>
                <div className="bg-gradient-to-r from-red-600 to-yellow-500 w-10 h-10 rounded-full flex items-center justify-center">
                  <FaFilePdf className="text-white" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-10">
            <button
              onClick={generatePDF}
              className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <FaDownload className="mr-2" />
              Generate Tournament Report PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPDF;