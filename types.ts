export type TabName = 'main' | 'payments' | 'city' | 'chat' | 'more';

export interface Card {
  id: string;
}

export interface Account {
  id: number;
  main: boolean;
  name: string;
  balance: string;
  badge?: string;
  iconName: string;
  iconBg: string;
  cards: Card[];
  cardDesignUrl?: string; // One design for all cards in this account
}

export interface CashbackPartner {
    id: string;
    logoUrl: string;
}

export interface Bank {
    id: string;
    name: string;
    logoUrl: string;
}

export interface FavoriteContact {
    id: number;
    name: string;
    phone: string;
    initials: string;
    banks: Bank[];
}

export type TransactionCategory = 'food' | 'shopping' | 'transport' | 'health' | 'income';

export interface Transaction {
  id: string;
  iconBg: string;
  category: TransactionCategory;
  name: string;
  description: string;
  amount: number;
  date: string; // ISO 8601 format: "YYYY-MM-DDTHH:mm:ss.sssZ"
}

export interface UserData {
    name: string;
    accounts: Account[];
    cashbackPartners: CashbackPartner[];
    cashbackProgress: { color: string; percentage: number }[];
    favoriteContacts: FavoriteContact[];
    transactions: Transaction[];
}

export interface Toast {
  id: number;
  message: string;
}

export interface ToastContextType {
  addToast: (message: string) => void;
}