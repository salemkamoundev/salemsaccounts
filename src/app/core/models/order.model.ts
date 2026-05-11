export interface Order {
  id?: string;
  userId: string;
  items: any[];
  totalUSDT: number;
  status: 'pending_payment' | 'paid' | 'delivered' | 'cancelled';
  paymentProofUrl?: string;
  transactionHash?: string;
  createdAt: number;
}
