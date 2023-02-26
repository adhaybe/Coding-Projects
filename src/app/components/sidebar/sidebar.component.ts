import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['../../styles/sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  // side bar image icons
  public appLogo: string = '../../../assets/logo.svg';
  public homeIcon: string = '../../../assets/icon-nav-home.svg';
  public moviesIcon: string = '../../../assets/icon-nav-movies.svg';
  public bookmarkIcon: string = '../../../assets/icon-nav-bookmark.svg';
  public accountIcon: string = '../../../assets/image-avatar.png';
  public tvShowIcon: string = '../../../assets/icon-nav-tv-series.svg';
  public bookmarkFullIcon: string = '../../../assets/icon-bookmark-full.svg';
  public bookmarkEmptyIcon: string = '../../../assets/icon-bookmark-empty.svg';
  public currentRoute!: string;
  @Input()
  logout!: Function;
  @Input()
  isAuthenticated!: boolean;

  constructor(private router: Router) {}

  
  ngOnInit() {
    // do something on component initialization
  }

  onLogOut() {
    this.router.navigate(['/login']);
    this.logout();
  }

}


