export enum STATUSCODE {
  SUCCESS = 200,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  BAD_REQUEST = 400,
  NOT_IMPLEMENTED = 501,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  CONFLICT = 409,
  TOO_MANY_REQUESTS = 429,
  UNPROCESSABLE_ENTITY = 422,
  PAYMENT_REQUIRED = 402,
  PRECONDITION_FAILED = 412,
  REQUEST_TIMEOUT = 408,
  UNSUPPORTED_MEDIA_TYPE = 415,
}