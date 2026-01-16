/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'midtrans-client' {
  export interface SnapConfig {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
  }

  export interface TransactionDetails {
    order_id: string;
    gross_amount: number;
  }

  export interface CustomerDetails {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  }

  export interface ItemDetails {
    id: string;
    price: number;
    quantity: number;
    name: string;
  }

  export interface TransactionRequest {
    transaction_details: TransactionDetails;
    customer_details?: CustomerDetails;
    item_details?: ItemDetails[];
    enabled_payments?: string[];
    credit_card?: {
      secure?: boolean;
    };
    callbacks?: {
      finish?: string;
    };
  }

  export interface TransactionResponse {
    token: string;
    redirect_url: string;
  }

  export interface TransactionStatus {
    status_code: string;
    status_message: string;
    transaction_id: string;
    order_id: string;
    gross_amount: string;
    payment_type: string;
    transaction_time: string;
    transaction_status: string;
    fraud_status?: string;
  }

  export class Snap {
    constructor(config: SnapConfig);
    createTransaction(
      parameter: TransactionRequest
    ): Promise<TransactionResponse>;
  }

  export class CoreApi {
    constructor(config: SnapConfig);
    charge(parameter: any): Promise<any>;
    capture(parameter: any): Promise<any>;
    cardRegister(parameter: any): Promise<any>;
    transaction: {
      status(orderId: string): Promise<TransactionStatus>;
      cancel(orderId: string): Promise<TransactionStatus>;
      refund(orderId: string): Promise<TransactionStatus>;
    };
  }
}
