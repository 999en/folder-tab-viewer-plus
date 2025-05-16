
import { useApp } from "@/context/AppContext";
import Clock from "@/components/Clock";
import Bookmarks from "@/components/Bookmarks";
import Settings from "@/components/Settings";
import PdfViewer from "@/components/PdfViewer";
import SearchBar from "@/components/SearchBar";

const Index = () => {
  const { settings } = useApp();
  
  const getWallpaperStyle = () => {
    if (settings.selectedWallpaper === "default") {
      return {};
    }
    
    if (settings.selectedWallpaper === "custom" && settings.customWallpaperUrl) {
      return {
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)), url(${settings.customWallpaperUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed"
      };
    }
    
    // Get wallpaper from predefined list
    const wallpaperUrls = {
      mountains: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      ocean: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
      forest: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843",
      city: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a",
      architecture: "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
      coding: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
      tech: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    };
    
    const url = wallpaperUrls[settings.selectedWallpaper as keyof typeof wallpaperUrls];
    if (url) {
      return {
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)), url(${url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed"
      };
    }
    
    return {};
  };
  
  const wallpaperStyle = getWallpaperStyle();

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-background to-muted p-8 bg-fixed"
      style={wallpaperStyle}
    >
      <Settings />
      <div className="max-w-5xl mx-auto pt-16">
        {(settings.name || settings.welcomeMessage) && (
          <div className="text-center mb-4 animate-fade-in glass-dark p-3 rounded-lg inline-block mx-auto">
            {settings.welcomeMessage ? (
              <h2 className="text-xl font-medium">{settings.welcomeMessage}</h2>
            ) : settings.name ? (
              <h2 className="text-xl font-medium">Welcome, {settings.name}</h2>
            ) : null}
          </div>
        )}
        <Clock />
        <SearchBar />
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
