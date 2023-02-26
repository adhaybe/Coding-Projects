import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Content } from './models/Content';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./styles/app.component.scss']
})
export class AppComponent implements OnInit {
  public loginScreenLogo: string = '../../../assets/logo.svg';
  public currentRoute!: string;
  public isAuthenticated!: boolean;
  content: Content[] = [];
  filteredContent: Content[] = [];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private http: HttpClient) {}

  ngOnInit() {
    this.getCurrentRoute();
    this.loadContent();
  }
  

  public onSearch(searchText: string) {
    if (searchText) {
      this.filteredContent = this.content.filter(content => {
        content.title?.toLowerCase().includes(searchText.toLowerCase())
      });
    } else {
      this.filteredContent = this.content;
    }
  }

  private getCurrentRoute() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.route.snapshot.firstChild?.routeConfig?.path ?? '')
    ).subscribe((routePath) => {
      this.currentRoute = routePath;
      console.log(this.currentRoute);
    });
  }

  private loadContent() {
    this.http.get<Content[]>('assets/data.json').subscribe(data => {
      this.content = data;
      this.filteredContent = data;
    });
  }
}