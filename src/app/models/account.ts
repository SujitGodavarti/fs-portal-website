import { Investment } from './investment';

export class Account {
    Id: number;
    AccountCode: string;
    AccountName: string;
    AvailableCash: number;
    LocalCurrency: string;
    Holdings: Investment[];
    NoofHoldings: number;
}