export interface Transaction {
  id?: string;
  orderId: string;
  amountUSDT: number;
  hash: string;
  verifiedAt?: number;
  verifiedByAdminId?: string;
}
