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
  icon: React.ReactElement;
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

export interface UserData {
    name: string;
    accounts: Account[];
    cashbackPartners: CashbackPartner[];
    cashbackProgress: { color: string; percentage: number }[];
    favoriteContacts: FavoriteContact[];
}

export interface Toast {
  id: number;
  message: string;
}

export interface ToastContextType {
  addToast: (message: string) => void;
}