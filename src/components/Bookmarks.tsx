
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookmarkFolder, Bookmark } from "@/types";
import { file, folder, folderInput, plus } from "lucide-react";

const Bookmarks = () => {
  const { bookmarkFolders, addBookmark, addBookmarkFolder, removeBookmark, removeFolder, importLocalFolder, viewPdf } = useApp();
  const [newFolderName, setNewFolderName] = useState("");
  const [newBookmarkTitle, setNewBookmarkTitle] = useState("");
  const [newBookmarkUrl, setNewBookmarkUrl] = useState("");
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

    const newBookmark: Bookmark = {
      id: `bookmark-${Date.now()}`,
      title: newBookmarkTitle,
      url: newBookmarkUrl,
      isPdf,
      dateAdded: new Date(),
      folderId: selectedFolderId,
    };

    addBookmark(newBookmark);
    setNewBookmarkTitle("");
    setNewBookmarkUrl("");
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
              <Button size="sm" variant="outline">
                <folder className="mr-2 h-4 w-4" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
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
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateFolder}>Create Folder</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isImportFolderOpen} onOpenChange={setIsImportFolderOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <folderInput className="mr-2 h-4 w-4" />
                Import Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
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
                    className="col-span-3"
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
                    className="col-span-3"
                    placeholder="C:/Documents/PDFs"
                  />
                </div>
                <p className="text-xs text-muted-foreground col-span-4 px-4">
                  Note: In a browser extension, you would select a folder using a file picker.
                  For this demo, just enter a path.
                </p>
              </div>
              <DialogFooter>
                <Button onClick={handleImportFolder}>Import Folder</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {bookmarkFolders.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No bookmarks yet. Create a folder to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue={bookmarkFolders[0]?.id}>
          <TabsList className="mb-4">
            {bookmarkFolders.map((folder) => (
              <TabsTrigger key={folder.id} value={folder.id}>
                {folder.isLocalFolder ? (
                  <folderInput className="mr-2 h-4 w-4" />
                ) : (
                  <folder className="mr-2 h-4 w-4" />
                )}
                {folder.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {bookmarkFolders.map((folder) => (
            <TabsContent key={folder.id} value={folder.id}>
              <Card>
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
                          <Button size="sm" variant="ghost">
                            <plus className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
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
                                className="col-span-3"
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
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleAddBookmark}>Add Bookmark</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => removeFolder(folder.id)}>
                        <file className="h-4 w-4" />
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
                        <Card key={bookmark.id} className="overflow-hidden">
                          <div className="p-4 flex justify-between items-center">
                            <div>
                              <h3 className="font-medium truncate" title={bookmark.title}>
                                {bookmark.isPdf && <file className="inline-block mr-1 h-4 w-4" />}
                                {bookmark.title}
                              </h3>
                              <p className="text-xs text-muted-foreground truncate">
                                {bookmark.url}
                              </p>
                            </div>
                            <div className="flex space-x-1">
                              {bookmark.isPdf ? (
                                <Button size="sm" variant="ghost" onClick={() => viewPdf(bookmark.url)}>
                                  View
                                </Button>
                              ) : (
                                <Button size="sm" variant="ghost" asChild>
                                  <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                                    Open
                                  </a>
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
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
