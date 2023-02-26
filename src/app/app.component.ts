import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./styles/app.component.scss']
})
export class AppComponent implements OnInit {
  public loginScreenLogo: string = '../../../assets/logo.svg';
  public currentRoute!: string;
  public isAuthenticated!: boolean;

  constructor(private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.route.snapshot.firstChild?.routeConfig?.path ?? '')
    ).subscribe((routePath) => {
      this.currentRoute = routePath;
      console.log(this.currentRoute);
    });
  }
}
