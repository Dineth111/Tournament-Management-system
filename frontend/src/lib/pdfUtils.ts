import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Player data interface
interface Player {
  id: number;
  name: string;
  email: string;
  belt: string;
  dojo: string;
  age: number;
  weight: number;
  status: string;
}

// Judge data interface
interface Judge {
  id: number;
  name: string;
  email: string;
  phone: string;
  certificationLevel: string;
  licenseNumber: string;
  experience: number;
  status: string;
  assignedMatches: number;
  rating: number;
}

// Tournament report interface
interface TournamentReport {
  id: string;
  name: string;
  date: string;
  participants: number;
  categories: number;
  revenue: number;
  status: string;
}

// Performance report interface
interface PerformanceReport {
  category: string;
  totalMatches: number;
  completed: number;
  pending: number;
  completionRate: number;
}

/**
 * Export players data to PDF
 */
export const exportPlayersToPDF = (players: Player[]) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Players Report', 14, 22);
  
  // Add generation date
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
  
  // Add table
  (doc as any).autoTable({
    startY: 40,
    head: [['Name', 'Email', 'Belt Rank', 'Dojo', 'Age', 'Weight (kg)', 'Status']],
    body: players.map(player => [
      player.name,
      player.email,
      player.belt,
      player.dojo,
      player.age,
      player.weight,
      player.status
    ]),
    theme: 'grid',
    styles: {
      fontSize: 10
    },
    headStyles: {
      fillColor: [99, 102, 241], // indigo-500
      textColor: [255, 255, 255]
    }
  });
  
  // Save the PDF
  doc.save('players-report.pdf');
};

/**
 * Export judges data to PDF
 */
export const exportJudgesToPDF = (judges: Judge[]) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Judges Report', 14, 22);
  
  // Add generation date
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
  
  // Add table
  (doc as any).autoTable({
    startY: 40,
    head: [['Name', 'Email', 'Phone', 'Certification', 'License #', 'Experience (yrs)', 'Status', 'Matches', 'Rating']],
    body: judges.map(judge => [
      judge.name,
      judge.email,
      judge.phone,
      judge.certificationLevel,
      judge.licenseNumber,
      judge.experience,
      judge.status,
      judge.assignedMatches,
      judge.rating
    ]),
    theme: 'grid',
    styles: {
      fontSize: 8
    },
    headStyles: {
      fillColor: [249, 115, 22], // orange-500
      textColor: [255, 255, 255]
    }
  });
  
  // Save the PDF
  doc.save('judges-report.pdf');
};

/**
 * Export tournament reports to PDF
 */
export const exportTournamentReportsToPDF = (reports: TournamentReport[]) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Tournament Reports', 14, 22);
  
  // Add generation date
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
  
  // Add table
  (doc as any).autoTable({
    startY: 40,
    head: [['Tournament', 'Date', 'Participants', 'Categories', 'Revenue ($)', 'Status']],
    body: reports.map(report => [
      report.name,
      report.date,
      report.participants,
      report.categories,
      report.revenue.toLocaleString(),
      report.status
    ]),
    theme: 'grid',
    styles: {
      fontSize: 10
    },
    headStyles: {
      fillColor: [99, 102, 241], // indigo-500
      textColor: [255, 255, 255]
    }
  });
  
  // Save the PDF
  doc.save('tournament-reports.pdf');
};

/**
 * Export performance reports to PDF
 */
export const exportPerformanceReportsToPDF = (reports: PerformanceReport[]) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Performance Reports', 14, 22);
  
  // Add generation date
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
  
  // Add table
  (doc as any).autoTable({
    startY: 40,
    head: [['Category', 'Total Matches', 'Completed', 'Pending', 'Completion Rate (%)']],
    body: reports.map(report => [
      report.category,
      report.totalMatches,
      report.completed,
      report.pending,
      `${report.completionRate}%`
    ]),
    theme: 'grid',
    styles: {
      fontSize: 10
    },
    headStyles: {
      fillColor: [99, 102, 241], // indigo-500
      textColor: [255, 255, 255]
    }
  });
  
  // Save the PDF
  doc.save('performance-reports.pdf');
};

/**
 * Export financial reports to PDF
 */
export const exportFinancialReportsToPDF = (reports: TournamentReport[]) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Financial Reports', 14, 22);
  
  // Add generation date
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
  
  // Calculate totals
  const totalRevenue = reports.reduce((sum, r) => sum + r.revenue, 0);
  const totalParticipants = reports.reduce((sum, r) => sum + r.participants, 0);
  
  // Add summary
  doc.setFontSize(14);
  doc.text('Summary', 14, 45);
  
  doc.setFontSize(12);
  doc.text(`Total Revenue: $${totalRevenue.toLocaleString()}`, 14, 55);
  doc.text(`Total Participants: ${totalParticipants}`, 14, 65);
  doc.text(`Total Tournaments: ${reports.length}`, 14, 75);
  
  // Add table
  (doc as any).autoTable({
    startY: 85,
    head: [['Tournament', 'Date', 'Participants', 'Revenue ($)', 'Status']],
    body: reports.map(report => [
      report.name,
      report.date,
      report.participants,
      report.revenue.toLocaleString(),
      report.status
    ]),
    theme: 'grid',
    styles: {
      fontSize: 10
    },
    headStyles: {
      fillColor: [99, 102, 241], // indigo-500
      textColor: [255, 255, 255]
    }
  });
  
  // Save the PDF
  doc.save('financial-reports.pdf');
};