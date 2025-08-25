export type TabName = 'main' | 'payments' | 'city' | 'chat' | 'more';

export interface MiniCardData {
  id: number;
  type: 'black' | 'yellow';
  last4: string;
}

export interface Toast {
  id: number;
  message: string;
}

export interface ToastContextType {
  addToast: (message: string) => void;
}
