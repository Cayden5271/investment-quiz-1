import jsPDF from 'jspdf';
import { UserInputs, PortfolioPlan } from '../types';

export function exportToPDF(plan: PortfolioPlan, inputs: UserInputs): void {
  const doc = new jsPDF();
  let yPos = 20;
  
  // Title
  doc.setFontSize(20);
  doc.text('Personalized Investment Plan', 20, yPos);
  yPos += 15;
  
  // Disclaimer
  doc.setFontSize(10);
  doc.setTextColor(150, 0, 0);
  doc.text('This tool is for educational purposes only and is not financial advice.', 20, yPos);
  yPos += 8;
  doc.text('Investing involves risk, including loss of principal.', 20, yPos);
  yPos += 8;
  doc.text('Consider consulting a fiduciary financial professional for personalized advice.', 20, yPos);
  yPos += 15;
  doc.setTextColor(0, 0, 0);
  
  // Risk Profile
  doc.setFontSize(16);
  doc.text(`Risk Profile: ${plan.riskProfile} (Score: ${plan.riskScore}/100)`, 20, yPos);
  yPos += 10;
  
  // Asset Allocation
  doc.setFontSize(14);
  doc.text('Asset Allocation:', 20, yPos);
  yPos += 8;
  doc.setFontSize(11);
  
  plan.allocations.forEach(allocation => {
    doc.text(
      `${allocation.label}: ${allocation.percentage.toFixed(1)}% ($${allocation.monthlyDollars.toFixed(2)}/month)`,
      25,
      yPos
    );
    yPos += 7;
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
  });
  
  yPos += 5;
  
  // Action Plan
  doc.setFontSize(14);
  doc.text('Action Plan:', 20, yPos);
  yPos += 8;
  doc.setFontSize(11);
  
  plan.actionPlan.forEach(item => {
    doc.text(
      `${item.priority}. ${item.title}: $${item.monthlyAmount.toFixed(2)}/month`,
      25,
      yPos
    );
    yPos += 7;
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
  });
  
  // Save
  doc.save('investment-plan.pdf');
}

export function exportToCSV(plan: PortfolioPlan): void {
  const rows: string[] = [];
  
  // Header
  rows.push('Asset Class,Percentage,Monthly Dollars,Ticker');
  
  // Allocations
  plan.allocations.forEach(allocation => {
    rows.push(
      `"${allocation.label}",${allocation.percentage.toFixed(2)},${allocation.monthlyDollars.toFixed(2)},"${allocation.ticker || ''}"`
    );
  });
  
  // Action Plan
  rows.push('');
  rows.push('Priority,Action,Monthly Amount,Timeline');
  plan.actionPlan.forEach(item => {
    rows.push(
      `${item.priority},"${item.title}",${item.monthlyAmount.toFixed(2)},"${item.timeline || ''}"`
    );
  });
  
  const csv = rows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'investment-plan.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToJSON(plan: PortfolioPlan, inputs: UserInputs): void {
  const data = {
    inputs,
    plan,
    generatedAt: new Date().toISOString(),
  };
  
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'investment-plan.json';
  a.click();
  URL.revokeObjectURL(url);
}

