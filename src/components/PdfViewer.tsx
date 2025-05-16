
import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { File } from "lucide-react";

const PdfViewer = () => {
  const { currentViewingPdf, closeCurrentPdf } = useApp();
  const [pdfName, setPdfName] = useState("");
  
  useEffect(() => {
    if (currentViewingPdf) {
      // Extract the file name from the path
      const parts = currentViewingPdf.split(/[\/\\]/);
      setPdfName(parts[parts.length - 1]);
    }
  }, [currentViewingPdf]);
  
  if (!currentViewingPdf) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] flex flex-col glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium flex items-center">
            <File className="mr-2 h-4 w-4" />
            {pdfName || "PDF Viewer"}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={closeCurrentPdf} className="glass-dark hover:bg-white/10">
            Close
          </Button>
        </CardHeader>
        <CardContent className="flex-1 p-0 relative min-h-[70vh]">
          {currentViewingPdf.startsWith('http') ? (
            <iframe 
              src={currentViewingPdf} 
              className="w-full h-full min-h-[70vh]" 
              title="PDF Viewer"
            />
          ) : (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center">
                <File className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium">Local PDF Viewer</p>
                <p className="mt-2 text-sm text-muted-foreground max-w-md">
                  In a real extension, this would display the local PDF file.
                  For this demo, we're just showing this placeholder.
                </p>
                <p className="mt-4 text-xs text-muted-foreground border border-dashed p-2 rounded glass-dark">
                  {currentViewingPdf}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PdfViewer;
