export type FieldErrors = Record<string, string[]>;

export type ActionResponse<T = undefined> =
  | {
      success: true;
      data: T;
      error?: never;
      fieldErrors?: never;
    }
  | {
      success: false;
      data?: never;
      error: string;
      fieldErrors?: FieldErrors;
    };
