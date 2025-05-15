
export interface Bookmark {
  id: string;
  title: string;
  url: string;
  isPdf: boolean;
  localPath?: string;
  dateAdded: Date;
  folderId?: string;
}

export interface BookmarkFolder {
  id: string;
  name: string;
  bookmarks: Bookmark[];
  dateAdded: Date;
  isLocalFolder?: boolean;
  localPath?: string;
}

export interface Settings {
  name: string;
  showClock: boolean;
  use24HourFormat: boolean;
  showDate: boolean;
  showBookmarks: boolean;
}
