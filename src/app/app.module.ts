import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { SearchComponent } from './components/search/search.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TrendingComponent } from './components/trending/trending.component';
import { RecommendedComponent } from './components/recommended/recommended';
import { TVSeriesComponent } from './components/tv-series/tv-series.component';
import { BookmarksComponent } from './components/bookmarks/bookmarks.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { MoviesComponent } from './components/movies/movies.component';
import { FilterComponent } from './filter/filter.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    SidebarComponent,
    TrendingComponent,
    RecommendedComponent,
    TVSeriesComponent,
    BookmarksComponent,
    HomeComponent,
    MoviesComponent,
    FilterComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
