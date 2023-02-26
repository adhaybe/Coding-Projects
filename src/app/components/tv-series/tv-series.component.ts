import { Component } from '@angular/core';
import { Content } from 'src/app/models/Content';
import { BookmarkService } from 'src/app/services/bookmark.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-tv-series',
  templateUrl: './tv-series.component.html',
  styleUrls: ['../../styles/tv-series.component.scss']
})
export class TVSeriesComponent {
  public tvSeries: Content[] = [];
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
      this.tvSeries = data.filter(item => item.category === 'TV Series');
    });
  }
  
}
