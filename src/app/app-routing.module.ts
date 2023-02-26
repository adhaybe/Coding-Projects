import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BookmarksComponent } from "./components/bookmarks/bookmarks.component";
import { HomeComponent } from "./components/home/home.component";
import { MoviesComponent } from "./components/movies/movies.component";
import { TVSeriesComponent } from "./components/tv-series/tv-series.component";

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'bookmarks', component: BookmarksComponent },
  { path: 'movies', component: MoviesComponent },
  { path: 'tv-series', component: TVSeriesComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}