import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Settings, Bookmark, BookmarkFolder } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface AppContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  bookmarkFolders: BookmarkFolder[];
  addBookmarkFolder: (folder: BookmarkFolder) => void;
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (bookmarkId: string) => void;
  removeFolder: (folderId: string) => void;
  importLocalFolder: (name: string, path: string) => Promise<void>;
  viewPdf: (pdfUrl: string) => void;
  currentViewingPdf: string | null;
  closeCurrentPdf: () => void;
}

const defaultSettings: Settings = {
  name: "User",
  showClock: true,
  use24HourFormat: false,
  showDate: true,
  showBookmarks: true,
  welcomeMessage: null,
  selectedWallpaper: "default",
  customWallpaperUrl: "",
};

// The browser extension API would be used in a real extension
// For demo purposes, we'll use localStorage
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [bookmarkFolders, setBookmarkFolders] = useState<BookmarkFolder[]>([]);
  const [currentViewingPdf, setCurrentViewingPdf] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load settings from storage
    const savedSettings = localStorage.getItem("mtab_settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Load bookmarks from storage
    const savedBookmarks = localStorage.getItem("mtab_bookmarks");
    if (savedBookmarks) {
      setBookmarkFolders(JSON.parse(savedBookmarks));
    }
  }, []);

  // Save settings to storage whenever they change
  useEffect(() => {
    localStorage.setItem("mtab_settings", JSON.stringify(settings));
  }, [settings]);

  // Save bookmarks to storage whenever they change
  useEffect(() => {
    localStorage.setItem("mtab_bookmarks", JSON.stringify(bookmarkFolders));
  }, [bookmarkFolders]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const addBookmarkFolder = (folder: BookmarkFolder) => {
    setBookmarkFolders((prev) => [...prev, folder]);
    toast({
      title: "Folder created",
      description: `${folder.name} has been added to your bookmarks.`
    });
  };

  const addBookmark = (bookmark: Bookmark) => {
    setBookmarkFolders((prev) =>
      prev.map((folder) =>
        folder.id === bookmark.folderId
          ? { ...folder, bookmarks: [...folder.bookmarks, bookmark] }
          : folder
      )
    );
    toast({
      title: "Bookmark added",
      description: `${bookmark.title} has been added to your bookmarks.`
    });
  };

  const removeBookmark = (bookmarkId: string) => {
    setBookmarkFolders((prev) =>
      prev.map((folder) => ({
        ...folder,
        bookmarks: folder.bookmarks.filter((bm) => bm.id !== bookmarkId),
      }))
    );
    toast({
      title: "Bookmark removed",
      description: "The bookmark has been removed."
    });
  };

  const removeFolder = (folderId: string) => {
    setBookmarkFolders((prev) => prev.filter((folder) => folder.id !== folderId));
    toast({
      title: "Folder removed",
      description: "The folder and all its bookmarks have been removed."
    });
  };

  // In a real extension, this would use the File System Access API
  // For demo purposes, we'll simulate it
  const importLocalFolder = async (name: string, path: string): Promise<void> => {
    // In a real extension, you'd scan the folder for PDFs and other files
    // Here we'll simulate adding a local folder
    const newFolder: BookmarkFolder = {
      id: `folder-${Date.now()}`,
      name: name,
      bookmarks: [],
      dateAdded: new Date(),
      isLocalFolder: true,
      localPath: path,
    };

    // Simulate finding PDF files in the folder
    const simulatedPdfs = [
      { name: "Document1.pdf", path: `${path}/Document1.pdf` },
      { name: "Report.pdf", path: `${path}/Report.pdf` },
      { name: "Manual.pdf", path: `${path}/Manual.pdf` },
    ];

    // Add simulated PDFs as bookmarks
    simulatedPdfs.forEach((pdf) => {
      newFolder.bookmarks.push({
        id: `bookmark-${Date.now()}-${Math.random()}`,
        title: pdf.name,
        url: pdf.path,
        isPdf: true,
        localPath: pdf.path,
        dateAdded: new Date(),
        folderId: newFolder.id,
      });
    });

    setBookmarkFolders((prev) => [...prev, newFolder]);
    
    toast({
      title: "Folder imported",
      description: `${name} with ${simulatedPdfs.length} PDFs has been imported.`,
    });
  };

  const viewPdf = (pdfUrl: string) => {
    setCurrentViewingPdf(pdfUrl);
  };

  const closeCurrentPdf = () => {
    setCurrentViewingPdf(null);
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        bookmarkFolders,
        addBookmarkFolder,
        addBookmark,
        removeBookmark,
        removeFolder,
        importLocalFolder,
        viewPdf,
        currentViewingPdf,
        closeCurrentPdf,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
