import { httpClient } from '@/api';
import type { CreateOrderPayload, Order } from '@/api/order/index.types';
export const createOrder = async (
    payload: CreateOrderPayload,
): Promise<Order> => {
    const response = await httpClient.post('/orders', payload);
    return response.data.data;
};
