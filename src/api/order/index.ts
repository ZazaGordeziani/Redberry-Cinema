import { httpClient } from '@/api';
import type { CreateOrderPayload, Order } from '@/api/order/index.types';
export const createOrder = async (
    payload: CreateOrderPayload,
): Promise<Order> => {
    const response = await httpClient.post('/orders', payload);
    return response.data.data;
};
export const getTickets = async (): Promise<Order[]> => {
    const response = await httpClient.get('/tickets');
    return response.data.data;
};
export const refundOrder = async (reference: string): Promise<Order> => {
    const response = await httpClient.post(`/orders/${reference}/refund`);
    return response.data.data;
};
