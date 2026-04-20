import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface ReportFinding {
  type: string;
  title: string;
  content: string;
  timestamp: string;
}

export const generateBriefingPDF = async (findings: ReportFinding[]) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = '#00FF41'; // Terminal Green
  const bgColor = '#0A0A0A'; // Obsidian Background

  // Add Background
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, 210, 297, 'F');

  // Title Slide
  doc.setTextColor(primaryColor);
  doc.setFont('courier', 'bold');
  doc.setFontSize(28);
  doc.text('APEXBREACH', 105, 60, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('OFFENSIVE INTELLIGENCE BRIEFING', 105, 75, { align: 'center' });
  
  doc.setDrawColor(primaryColor);
  doc.setLineWidth(0.5);
  doc.line(40, 85, 170, 85);

  doc.setFontSize(10);
  doc.setFont('courier', 'normal');
  doc.text(`GENERATED AT: ${new Date().toLocaleString()}`, 105, 100, { align: 'center' });
  doc.text('CLASSIFICATION: TOP SECRET // ORCON', 105, 105, { align: 'center' });

  let yPos = 130;

  findings.forEach((finding, index) => {
    if (yPos > 250) {
      doc.addPage();
      doc.setFillColor(10, 10, 10);
      doc.rect(0, 0, 210, 297, 'F');
      yPos = 20;
    }

    // Section Header
    doc.setDrawColor(40, 40, 40);
    doc.setFillColor(20, 20, 20);
    doc.rect(20, yPos, 170, 10, 'F');
    
    doc.setTextColor(primaryColor);
    doc.setFontSize(12);
    doc.setFont('courier', 'bold');
    doc.text(`FINDING ${index + 1}: ${finding.type.toUpperCase()}`, 25, yPos + 7);
    
    yPos += 20;

    // Finding Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text(finding.title.toUpperCase(), 20, yPos);
    yPos += 10;

    // Finding Content
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(10);
    doc.setFont('courier', 'normal');
    
    const lines = doc.splitTextToSize(finding.content, 170);
    doc.text(lines, 20, yPos);
    
    yPos += (lines.length * 5) + 15;
  });

  // Footer on each page
  const pageCount = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`PAGE ${i} OF ${pageCount} | APEXBREACH INTEL UNIT`, 105, 285, { align: 'center' });
  }

  doc.save(`APEXBREACH_BRIEFING_${new Date().toISOString().slice(0, 10)}.pdf`);
};
