
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const { settings, updateSettings } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [nameInput, setNameInput] = useState(settings.name);

  const handleSave = () => {
    updateSettings({ name: nameInput });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="absolute top-4 right-4">
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent>
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
