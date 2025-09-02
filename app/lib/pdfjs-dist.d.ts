declare module 'pdfjs-dist/build/pdf.mjs' {
  export * from 'pdfjs-dist';
  const pdfjs: typeof import('pdfjs-dist');
  export default pdfjs;
}

declare module 'pdfjs-dist/build/pdf.worker.mjs' {
  const workerSrc: string;
  export default workerSrc;
}