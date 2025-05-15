
import { useApp } from "@/context/AppContext";
import Clock from "@/components/Clock";
import Bookmarks from "@/components/Bookmarks";
import Settings from "@/components/Settings";
import PdfViewer from "@/components/PdfViewer";

const Index = () => {
  const { settings } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-8">
      <Settings />
      <div className="max-w-5xl mx-auto pt-16">
        {settings.name && (
          <h2 className="text-xl font-medium text-center mb-4 animate-fade-in">
            Welcome, {settings.name}
          </h2>
        )}
        <Clock />
        {settings.showBookmarks && <Bookmarks />}
        <PdfViewer />
      </div>
      <footer className="absolute bottom-4 left-0 right-0 text-center text-xs text-muted-foreground">
        mtab+ • A minimal new tab extension
      </footer>
    </div>
  );
};

export default Index;
