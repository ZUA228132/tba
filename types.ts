export type TabName = 'main' | 'payments' | 'city' | 'chat' | 'more' | 'admin';

export interface Card {
  id: string;
  number: string;
  expiry: string;
  cvc: string;
}

export interface Account {
  id: number;
  name: string;
  balance: number; 
  color: string;
  badge?: {
    text: string;
    color: string;
    iconUrl?: string;
  };
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
    gradient: string;
}

export interface FavoriteContact {
    id: number;
    name: string;
    phone: string;
    initials: string;
    banks: Bank[];
}

export type TransactionCategory = 'food' | 'shopping' | 'transport' | 'health' | 'income' | 'transfer';

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
    email: string;
    frozen: boolean;
    name: string;
    avatarUrl: string;
    isPremium: boolean;
    isAdmin: boolean;
    donationBalance: number;
    accounts: Account[];
    cashbackPartners: CashbackPartner[];
    cashbackProgress: { color: string; percentage: number }[];
    favoriteContacts: FavoriteContact[];
    transactions: Transaction[];
    customBanks: Bank[];
    monthlySpending: {
        month: string;
        amount: number;
    };
}

export interface Toast {
  id: number;
  message: string;
}

export interface ToastContextType {
  addToast: (message: string) => void;
}

export interface TransferSuccessDetails {
    amount: number;
    fromAccountName: string;
    balanceBefore: number;
    balanceAfter: number;
    recipientName: string;
    recipientInfo: string; // Phone or card number
    recipientBank: Bank;
}