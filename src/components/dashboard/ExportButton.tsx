'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

export default function ExportButton() {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      // Dynamically import to keep bundle small
      const [html2canvasModule, jsPDFModule] = await Promise.all([
        import('html2canvas').catch(() => null),
        import('jspdf').catch(() => null),
      ]);

      if (!html2canvasModule || !jsPDFModule) {
        // Fallback: simple text-based PDF export using native print
        window.print();
        return;
      }

      const html2canvas = html2canvasModule.default;
      const { jsPDF } = jsPDFModule;

      const element = document.getElementById('pdf-export-target');
      if (!element) {
        window.print();
        return;
      }

      const canvas = await html2canvas(element, {
        backgroundColor: '#050510',
        scale: 1.5,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = (canvas.height * pdfW) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
      pdf.save(`mindflow-report-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (e) {
      console.error('Export failed:', e);
      window.print();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl font-semibold text-sm text-white shadow-lg shadow-violet-900/40 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-wait"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      {loading ? 'Generating PDF…' : 'Download Report'}
    </button>
  );
}
