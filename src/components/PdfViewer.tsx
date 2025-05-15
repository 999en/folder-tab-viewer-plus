
import { useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { file } from "lucide-react";

const PdfViewer = () => {
  const { currentViewingPdf, closeCurrentPdf } = useApp();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // For a real extension, we'd use a PDF.js or similar library
    // to render PDFs from local files
    if (currentViewingPdf && iframeRef.current) {
      // Here we assume currentViewingPdf is a valid URL or data URI
      // In a real extension with local file access, we'd need special handling
    }
  }, [currentViewingPdf]);

  if (!currentViewingPdf) return null;

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center">
          <file className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-medium">
            {currentViewingPdf.split('/').pop()}
          </h2>
        </div>
        <Button onClick={closeCurrentPdf} variant="outline">
          Close
        </Button>
      </div>
      <div className="flex-1 p-4">
        {/* 
          In a real extension, we'd use PDF.js or a similar library to render PDFs.
          For this demo, we'll show a message explaining the limitations.
        */}
        <div className="bg-muted p-6 rounded-lg text-center h-full flex flex-col items-center justify-center">
          <file className="h-16 w-16 mb-4 text-muted-foreground" />
          <h3 className="text-xl font-medium mb-2">PDF Preview</h3>
          <p className="text-muted-foreground max-w-md">
            In a real browser extension, this area would render the PDF file using PDF.js or 
            a similar library. Browser extensions with the appropriate permissions can access 
            local files and render them securely.
          </p>
          <p className="mt-4 text-sm">
            File path: <code className="bg-background p-1 rounded">{currentViewingPdf}</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
