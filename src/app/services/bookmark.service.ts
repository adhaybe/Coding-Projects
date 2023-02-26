import { Injectable } from '@angular/core';
import { Content } from '../models/Content';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {
  private bookmarked: Content[] = [];

  addBookmark(content: Content): void {
    if (!content.isBookmarked) {
      content.isBookmarked = true;

      // Check if the movie is already bookmarked
      const index = this.bookmarked.findIndex(c => c.title === content.title);
      if (index === -1) {
        this.bookmarked.push(content);
      }
    }
  }

  removeBookmark(content: Content): void {
    if (content.isBookmarked) {
      content.isBookmarked = false;
      const index = this.bookmarked.findIndex(c => c.title === content.title);
      if (index !== -1) {
        this.bookmarked.splice(index, 1);
      }
    }
  }

  getBookmarked(): Content[] {
    return this.bookmarked;
  }
}
