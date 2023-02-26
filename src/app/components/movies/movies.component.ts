import { Component } from '@angular/core';
import { Content } from 'src/app/models/Content';
import { DataService } from 'src/app/services/data.service';
import { BookmarkService } from 'src/app/services/bookmark.service';


@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent {
  public movies: Content[] = [];
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
      this.movies = data.filter(movie => movie.category === 'Movie');
    });
  }

}