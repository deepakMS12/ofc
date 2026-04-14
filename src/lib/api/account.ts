import apiClient from './client';

export interface AccountBalance {
  balance: number;
  currency?: string;
  [key: string]: any;
}

export interface Transaction {
  transId: string;
  detail: string;
  type: 'credit' | 'debit' | string;
  price: number;
  amount?: number;
  transDt: string;
  status?: string;
  paymentReference?: string;
  [key: string]: any;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  total?: number;
  balance?: number;
  [key: string]: any;
}

export interface AddFundsRequest {
  amount: number;
  paymentMethod?: string;
  [key: string]: any;
}

export interface AddFundsResponse {
  status: string;
  message: string;
  transactionId?: string;
  [key: string]: any;
}

export const accountApi = {
  getBalance: async (): Promise<AccountBalance> => {
    const response = await apiClient.get<AccountBalance>('/account/balance');
    return response.data;
  },

  getTransactions: async (params?: {
    fromDate?: string;
    toDate?: string;
    type?: string;
    transactionId?: string;
    page?: number;
    limit?: number;
  }): Promise<TransactionsResponse | Transaction[]> => {
    const response = await apiClient.get<TransactionsResponse | Transaction[]>('/web/transactions', {
      params,
    });
    return response.data;
  },

  addFunds: async (data: AddFundsRequest): Promise<AddFundsResponse> => {
    const response = await apiClient.post<AddFundsResponse>('/account/add-funds', data);
    return response.data;
  },
};

