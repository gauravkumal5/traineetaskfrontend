export interface CustomerResponse<T> {
    timeStamp: string;
    statusCode: number;
    status: string;
    message: string;
    data: { page: T };

}