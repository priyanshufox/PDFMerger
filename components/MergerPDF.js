'use client'
import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function MergePDF() {
  const [pdfFiles, setPdfFiles] = useState([]);

  const handleFiles = (event) => {
    setPdfFiles([...event.target.files]);
  };

  const mergePDFs = async () => {
    const mergedPdf = await PDFDocument.create();
    for (const file of pdfFiles) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    const mergedPdfFile = await mergedPdf.save();
    download(mergedPdfFile, 'merged.pdf');
  };

  const download = (blob, filename) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
    link.download = filename;
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-4 bg-gray-100">
    <div className="bg-blue-500 w-full py-4 mb-8">
      <h1 className="text-4xl font-bold text-white text-center">PDF Merge Tool</h1>
      <p className="text-lg text-white text-center">Combine multiple PDF files into one</p>
    </div>
    <input
      type="file"
      accept="application/pdf"
      multiple
      onChange={handleFiles}
      className="block w-11/12 md:w-1/2 lg:w-1/3 mb-4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
    <button
      onClick={mergePDFs}
      disabled={pdfFiles.length === 0}
      className={`w-11/12 md:w-1/2 lg:w-1/3 px-4 py-2 font-bold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
        pdfFiles.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
      }`}
    >
      Merge PDFs
    </button>
  </div>
  );
}
