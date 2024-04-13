export interface ObjectStandartResponse<TData = any> {
  data: TData | null;
  success: boolean;
  message: string;
}

export interface ObjectStandartResponseWithError<TData = any, TError = any> {
  data: TData | null;
  success: boolean;
  message: string;
  errors: TError | null;
}