import {Directive, EventEmitter, Input, Output} from '@angular/core';

export enum ItemType {
  INVESTMENT = 0,
  INVESTOR = 1,
  ACCOUNT = 2
}

export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };
const compare = (v1, v2) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export function sortAndFilter(allItems: any, 
          itemType: number,
          sortcolumn: string, 
          sortDirection: SortDirection, 
          searchTerm: string): any[] {
  // 1. sort
  let items = sort(allItems, sortcolumn, sortDirection);

  // 2. filter
  items = items.filter(item => matches(item, itemType, searchTerm));

  return items;
}

//Sort items based on direction i.e 'asc' or 'desc' or  empty string '', which corresponds to initially displayed order
function sort(items: any[], column: string, direction: string): any[] {
  if (direction === "") {
    return items;
  } else {
    return [...items].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === "asc" ? res : -res;
    });
  }
}

// Checks whether search term entered by user is part of any element in a item row since the data in a row corresponds to single item
function matches(item: any, itemType: number, searchTerm: string) {
  const term = searchTerm.toLowerCase();
  switch (itemType) {
    case ItemType.INVESTMENT:
        return (
          item.InvestmentCode.toLowerCase().includes(term)
          || item.InvestmentName.toLowerCase().includes(term)
          || item.Market.toLowerCase().includes(term)
          || item.Currency.toLowerCase().includes(term)
          || item.Price.toString().toLowerCase().includes(term)
          || item.PriceUpdatedUtc.toLowerCase().includes(term)
        );
    case ItemType.INVESTOR:
        return (
          item.FullName.toLowerCase().includes(term)
          || item.PhoneNumber.toLowerCase().includes(term)
        );
    case ItemType.ACCOUNT:
      return (
        item.AccountCode.toLowerCase().includes(term)
        || item.AccountName.toLowerCase().includes(term)
        || item.AvailableCash.toString().toLowerCase().includes(term)
        || item.LocalCurrency.toLowerCase().includes(term)
        || item.NoofHoldings.toString().toLowerCase().includes(term)
      );
}
  
}
export interface SortEvent {
  column: string;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdSortableHeader {
  @Input() sortable: string;
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    // Changes the sort direction
    this.direction = rotate[this.direction];

    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}