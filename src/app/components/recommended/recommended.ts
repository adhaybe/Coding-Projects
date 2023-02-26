import { Component, OnInit } from '@angular/core';
import { Content } from 'src/app/models/Content';
import { BookmarkService } from 'src/app/services/bookmark.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-recommended',
  templateUrl: './recommended.html',
  styleUrls: ['../../styles/recommended.component.scss']
})
export class RecommendedComponent implements OnInit {
  public recommended: Content[] = [];
  public icon: string = '../../../assets/icon-category-movie.svg';

  constructor(private dataService: DataService, private bookmarkService: BookmarkService) {}

  ngOnInit(): void {
    this.renderGalleryOfMovies();
  }


  public addToBookmarks(movie: Content) {
    if (movie.isBookmarked) {
      // Remove the movie from bookmarks
      this.bookmarkService.removeBookmark(movie);
    } else {
      // Add the movie to bookmarks
      this.bookmarkService.addBookmark(movie);
    }
  }


  private renderGalleryOfMovies() {
    return this.dataService.getData().subscribe(data => {
      this.recommended = data;
    });
  }

}
