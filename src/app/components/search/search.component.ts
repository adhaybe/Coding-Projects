import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['../../styles/search.component.scss']
})
export class SearchComponent {
  public searchIcon: string = '../../../assets/icon-search.svg';
  searchText: string = '';
  @Output() search: EventEmitter<string> = new EventEmitter<string>();

}
