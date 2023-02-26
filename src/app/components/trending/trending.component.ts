import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Content } from 'src/app/models/Content';
import { BookmarkService } from 'src/app/services/bookmark.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['../../styles/trending.component.scss']
})
export class TrendingComponent implements OnInit {
  @ViewChild('gallery', {static: true})
  public gallery!: ElementRef<HTMLUListElement>;

  public trending: Content[] = [];
  public isUserScrolling: boolean = false;

  constructor(private dataService: DataService, private bookmarkService: BookmarkService) {}

  ngOnInit() {
    this.renderTrendingMovies();
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

    // business logic

  private renderTrendingMovies() {
    this.dataService.getData().subscribe(data => {
      const initialMovies = data.slice(0, 5);
      const clonedMovies = initialMovies.map(movie => ({ ...movie }));
      this.trending = [...initialMovies, ...clonedMovies];
      this.autoScrollGallery();
    });
  }
  

  private autoScrollGallery() {
    setInterval(() => {
      if (!this.isUserScrolling) {
        const galleryItem = this.gallery.nativeElement;
        const maxScroll = galleryItem.scrollWidth - galleryItem.clientWidth;
        
        galleryItem.scrollLeft = (galleryItem.scrollLeft >= maxScroll) ? 0 : galleryItem.scrollLeft + 1;
      }
    }, 10);
  
    this.gallery.nativeElement.addEventListener('mousedown', () => {
      this.isUserScrolling = true;
    });
  
    this.gallery.nativeElement.addEventListener('mouseup', () => {
      this.isUserScrolling = false;
    });
  }
}
