
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const WALLPAPERS = [
  { id: "default", name: "Default", url: "" },
  { id: "mountains", name: "Mountains", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" },
  { id: "ocean", name: "Ocean", url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21" },
  { id: "forest", name: "Forest", url: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843" },
  { id: "city", name: "City", url: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a" },
  { id: "architecture", name: "Architecture", url: "https://images.unsplash.com/photo-1487958449943-2429e8be8625" },
  { id: "coding", name: "Coding", url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6" },
  { id: "tech", name: "Technology", url: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7" },
];

const Settings = () => {
  const { settings, updateSettings } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [nameInput, setNameInput] = useState(settings.name);
  const [welcomeMessageInput, setWelcomeMessageInput] = useState(settings.welcomeMessage || "");
  const [customWallpaperUrl, setCustomWallpaperUrl] = useState(settings.customWallpaperUrl || "");
  const [showCustomWallpaperInput, setShowCustomWallpaperInput] = useState(!!settings.customWallpaperUrl);

  const handleSave = () => {
    updateSettings({ 
      name: nameInput,
      welcomeMessage: welcomeMessageInput.trim() ? welcomeMessageInput : null,
      customWallpaperUrl: showCustomWallpaperInput ? customWallpaperUrl : "",
      selectedWallpaper: showCustomWallpaperInput ? "custom" : settings.selectedWallpaper
    });
    setIsOpen(false);
  };

  const handleWallpaperSelect = (wallpaperId: string) => {
    if (wallpaperId === "custom") {
      setShowCustomWallpaperInput(true);
    } else {
      setShowCustomWallpaperInput(false);
      updateSettings({ 
        selectedWallpaper: wallpaperId,
        customWallpaperUrl: ""
      });
    }
  };

  const getSelectedWallpaperName = () => {
    if (settings.selectedWallpaper === "custom") {
      return "Custom";
    }
    const selected = WALLPAPERS.find(w => w.id === settings.selectedWallpaper);
    return selected ? selected.name : "Default";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="absolute top-4 right-4">
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your new tab experience
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="welcomeMessage" className="text-right">
              Welcome message
            </Label>
            <Textarea
              id="welcomeMessage"
              value={welcomeMessageInput}
              onChange={(e) => setWelcomeMessageInput(e.target.value)}
              placeholder="Enter a custom welcome message..."
              className="col-span-3 min-h-[80px]"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="wallpaper" className="text-right">
              Wallpaper
            </Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {getSelectedWallpaperName()}
                    <span className="sr-only">Select wallpaper</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <div className="grid gap-1 p-2">
                    {WALLPAPERS.map((wallpaper) => (
                      <Button
                        key={wallpaper.id}
                        variant={settings.selectedWallpaper === wallpaper.id ? "default" : "ghost"}
                        className="justify-start"
                        onClick={() => handleWallpaperSelect(wallpaper.id)}
                      >
                        {wallpaper.name}
                      </Button>
                    ))}
                    <Button
                      variant={settings.selectedWallpaper === "custom" ? "default" : "ghost"}
                      className="justify-start"
                      onClick={() => handleWallpaperSelect("custom")}
                    >
                      Custom URL
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              
              {showCustomWallpaperInput && (
                <Input
                  className="mt-2"
                  placeholder="Enter wallpaper image URL"
                  value={customWallpaperUrl}
                  onChange={(e) => setCustomWallpaperUrl(e.target.value)}
                />
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="showClock" className="text-right">
              Show clock
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch
                id="showClock"
                checked={settings.showClock}
                onCheckedChange={(checked) => updateSettings({ showClock: checked })}
              />
              <Label htmlFor="showClock">Enabled</Label>
            </div>
          </div>
          
          {settings.showClock && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="use24HourFormat" className="text-right">
                24-hour format
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="use24HourFormat"
                  checked={settings.use24HourFormat}
                  onCheckedChange={(checked) => updateSettings({ use24HourFormat: checked })}
                />
                <Label htmlFor="use24HourFormat">Enabled</Label>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="showDate" className="text-right">
              Show date
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch
                id="showDate"
                checked={settings.showDate}
                onCheckedChange={(checked) => updateSettings({ showDate: checked })}
              />
              <Label htmlFor="showDate">Enabled</Label>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="showBookmarks" className="text-right">
              Show bookmarks
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch
                id="showBookmarks"
                checked={settings.showBookmarks}
                onCheckedChange={(checked) => updateSettings({ showBookmarks: checked })}
              />
              <Label htmlFor="showBookmarks">Enabled</Label>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Settings;
