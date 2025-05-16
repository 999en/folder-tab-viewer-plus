
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookmarkFolder, Bookmark } from "@/types";
import { File, Folder, FolderInput, Plus, Upload } from "lucide-react";

const Bookmarks = () => {
  const { bookmarkFolders, addBookmark, addBookmarkFolder, removeBookmark, removeFolder, importLocalFolder, viewPdf } = useApp();
  const [newFolderName, setNewFolderName] = useState("");
  const [newBookmarkTitle, setNewBookmarkTitle] = useState("");
  const [newBookmarkUrl, setNewBookmarkUrl] = useState("");
  const [newBookmarkFavicon, setNewBookmarkFavicon] = useState("");
  const [importFolderName, setImportFolderName] = useState("");
  const [importFolderPath, setImportFolderPath] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isAddFolderOpen, setIsAddFolderOpen] = useState(false);
  const [isAddBookmarkOpen, setIsAddBookmarkOpen] = useState(false);
  const [isImportFolderOpen, setIsImportFolderOpen] = useState(false);

  const handleCreateFolder = () => {
    if (!newFolderName) return;

    const newFolder: BookmarkFolder = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
      bookmarks: [],
      dateAdded: new Date(),
    };

    addBookmarkFolder(newFolder);
    setNewFolderName("");
    setIsAddFolderOpen(false);
  };

  const handleAddBookmark = () => {
    if (!newBookmarkTitle || !newBookmarkUrl || !selectedFolderId) return;

    const isPdf = newBookmarkUrl.toLowerCase().endsWith('.pdf');
    let favicon = newBookmarkFavicon;
    
    // If no custom favicon is provided, try to generate one from the domain
    if (!favicon && !isPdf) {
      try {
        const url = new URL(newBookmarkUrl);
        favicon = `${url.protocol}//${url.hostname}/favicon.ico`;
      } catch (e) {
        // If URL parsing fails, leave favicon empty
        console.error("Invalid URL format");
      }
    }

    const newBookmark: Bookmark = {
      id: `bookmark-${Date.now()}`,
      title: newBookmarkTitle,
      url: newBookmarkUrl,
      isPdf,
      dateAdded: new Date(),
      folderId: selectedFolderId,
      favicon: favicon || undefined
    };

    addBookmark(newBookmark);
    setNewBookmarkTitle("");
    setNewBookmarkUrl("");
    setNewBookmarkFavicon("");
    setIsAddBookmarkOpen(false);
  };

  const handleImportFolder = async () => {
    if (!importFolderName || !importFolderPath) return;
    
    await importLocalFolder(importFolderName, importFolderPath);
    setImportFolderName("");
    setImportFolderPath("");
    setIsImportFolderOpen(false);
  };

  return (
    <div className="mt-8 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-medium">Bookmarks</h2>
        <div className="flex space-x-2">
          <Dialog open={isAddFolderOpen} onOpenChange={setIsAddFolderOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="glass-dark hover:bg-white/10">
                <Folder className="mr-2 h-4 w-4" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/10">
              <DialogHeader>
                <DialogTitle>Create new folder</DialogTitle>
                <DialogDescription>
                  Add a new bookmark folder to organize your links.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="folderName" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="folderName"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="col-span-3 glass-input"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateFolder} className="glass hover:bg-white/20">Create Folder</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isImportFolderOpen} onOpenChange={setIsImportFolderOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="glass-dark hover:bg-white/10">
                <FolderInput className="mr-2 h-4 w-4" />
                Import Folder
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/10">
              <DialogHeader>
                <DialogTitle>Import local folder</DialogTitle>
                <DialogDescription>
                  Import a local folder to access PDF files directly.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="importName" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="importName"
                    value={importFolderName}
                    onChange={(e) => setImportFolderName(e.target.value)}
                    className="col-span-3 glass-input"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="importPath" className="text-right">
                    Path
                  </Label>
                  <Input
                    id="importPath"
                    value={importFolderPath}
                    onChange={(e) => setImportFolderPath(e.target.value)}
                    className="col-span-3 glass-input"
                    placeholder="C:/Documents/PDFs"
                  />
                </div>
                <p className="text-xs text-muted-foreground col-span-4 px-4">
                  Note: In a browser extension, you would select a folder using a file picker.
                  For this demo, just enter a path.
                </p>
              </div>
              <DialogFooter>
                <Button onClick={handleImportFolder} className="glass hover:bg-white/20">Import Folder</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {bookmarkFolders.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No bookmarks yet. Create a folder to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue={bookmarkFolders[0]?.id}>
          <TabsList className="mb-4 glass-dark">
            {bookmarkFolders.map((folder) => (
              <TabsTrigger key={folder.id} value={folder.id} className="data-[state=active]:bg-white/20">
                {folder.isLocalFolder ? (
                  <FolderInput className="mr-2 h-4 w-4" />
                ) : (
                  <Folder className="mr-2 h-4 w-4" />
                )}
                {folder.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {bookmarkFolders.map((folder) => (
            <TabsContent key={folder.id} value={folder.id}>
              <Card className="glass-card border-white/10">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle>{folder.name}</CardTitle>
                      <CardDescription>
                        {folder.isLocalFolder ? "Local folder" : "Bookmark folder"} • {folder.bookmarks.length} items
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Dialog open={isAddBookmarkOpen && selectedFolderId === folder.id} onOpenChange={(open) => {
                        setIsAddBookmarkOpen(open);
                        if (open) setSelectedFolderId(folder.id);
                      }}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="hover:bg-white/10">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card border-white/10">
                          <DialogHeader>
                            <DialogTitle>Add bookmark</DialogTitle>
                            <DialogDescription>
                              Add a new bookmark to {folder.name}.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="bookmarkTitle" className="text-right">
                                Title
                              </Label>
                              <Input
                                id="bookmarkTitle"
                                value={newBookmarkTitle}
                                onChange={(e) => setNewBookmarkTitle(e.target.value)}
                                className="col-span-3 glass-input"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="bookmarkUrl" className="text-right">
                                URL
                              </Label>
                              <Input
                                id="bookmarkUrl"
                                value={newBookmarkUrl}
                                onChange={(e) => setNewBookmarkUrl(e.target.value)}
                                className="col-span-3 glass-input"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="bookmarkFavicon" className="text-right">
                                Favicon URL
                              </Label>
                              <Input
                                id="bookmarkFavicon"
                                value={newBookmarkFavicon}
                                onChange={(e) => setNewBookmarkFavicon(e.target.value)}
                                className="col-span-3 glass-input"
                                placeholder="https://example.com/favicon.ico (optional)"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleAddBookmark} className="glass hover:bg-white/20">Add Bookmark</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="ghost" className="text-destructive hover:bg-white/10 hover:text-destructive" onClick={() => removeFolder(folder.id)}>
                        <File className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {folder.bookmarks.length === 0 ? (
                      <p className="text-muted-foreground col-span-full text-center">
                        No bookmarks in this folder yet.
                      </p>
                    ) : (
                      folder.bookmarks.map((bookmark) => (
                        <Card key={bookmark.id} className="glass-dark border border-white/10 overflow-hidden hover:bg-white/5 transition-all duration-200">
                          <div className="p-4 flex justify-between items-center">
                            <div className="flex items-center">
                              {bookmark.favicon ? (
                                <img 
                                  src={bookmark.favicon} 
                                  alt="" 
                                  className="w-4 h-4 mr-2"
                                  onError={(e) => {
                                    // If favicon doesn't load, hide the img element and show the default icon
                                    const target = e.currentTarget;
                                    target.style.display = 'none';
                                    // Use nextElementSibling to access the next element (the File icon)
                                    if (target.nextElementSibling instanceof HTMLElement) {
                                      target.nextElementSibling.style.display = 'inline-block';
                                    }
                                  }}
                                />
                              ) : null}
                              {bookmark.isPdf ? (
                                <File className="inline-block mr-2 h-4 w-4" style={{display: bookmark.favicon ? 'none' : 'inline-block'}} />
                              ) : null}
                              <div>
                                <h3 className="font-medium truncate" title={bookmark.title}>
                                  {bookmark.title}
                                </h3>
                                <p className="text-xs text-muted-foreground truncate">
                                  {bookmark.url}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              {bookmark.isPdf ? (
                                <Button size="sm" variant="ghost" className="hover:bg-white/10" onClick={() => viewPdf(bookmark.url)}>
                                  View
                                </Button>
                              ) : (
                                <Button size="sm" variant="ghost" className="hover:bg-white/10" asChild>
                                  <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                                    Open
                                  </a>
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:bg-white/10 hover:text-destructive"
                                onClick={() => removeBookmark(bookmark.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default Bookmarks;
