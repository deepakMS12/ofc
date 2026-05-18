import apiClient from './client';

export interface PaytmInitiateRequest {
  planCode: string;
  amount: string;
  orderId: string;
}

export interface PaytmInitiateResponse {
  txnToken: string;
  orderId: string;
  amount: string;
  mid: string;
}

export interface PaytmVerifyResponse {
  success: boolean;
  message: string;
  transactionId?: string;
  status?: string;
}

export interface PlanPurchaseResponse {
  success: boolean;
  message: string;
  planCode?: string;
}

export const paymentApi = {
  purchasePlan: async (planCode: string): Promise<PlanPurchaseResponse> => {
    const response = await apiClient.post<PlanPurchaseResponse>('/web/payment/wallet/purchase', { planCode });
    return response.data;
  },

  initiatePaytm: async (data: PaytmInitiateRequest): Promise<PaytmInitiateResponse> => {
    const response = await apiClient.post<PaytmInitiateResponse>(
      '/web/payment/paytm/initiate',
      data,
    );
    return response.data;
  },

  verifyPaytm: async (orderId: string): Promise<PaytmVerifyResponse> => {
    const response = await apiClient.post<PaytmVerifyResponse>(
      '/web/payment/paytm/verify',
      { orderId },
    );
    return response.data;
  },
};
