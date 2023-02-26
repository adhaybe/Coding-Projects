import { Component } from '@angular/core';
import { Content } from 'src/app/models/Content';
import { BookmarkService } from 'src/app/services/bookmark.service';

@Component({
  selector: 'app-bookmarked',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['../../styles/bookmarks.component.scss']
})
export class BookmarksComponent {
  bookmarked: Content[] = [];
  public icon: string = '../../../assets/icon-category-movie.svg';

  constructor(private bookmarkService: BookmarkService) {}

  ngOnInit(): void {
    this.bookmarked = this.bookmarkService.getBookmarked();
    console.log(this.bookmarked);
  }

  removeBookmark(content: Content): void {
    this.bookmarkService.removeBookmark(content);
    this.bookmarked = this.bookmarkService.getBookmarked();
  }
}

