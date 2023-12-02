export enum WsEvent {
  CREATE_DIRECT_MESSAGE = "create-direct-message",
  CREATE_GROUP_MESSAGE = "create-group-message",
  DELETE_DIRECT_MESSAGE = "delete-direct-message",
  DELETE_GROUP_MESSAGE = "delete-group-message",

  REQUEST_CALL = "request-call",
  CANCEL_REQUEST_CALL = "cancel-request-call",
  SELF_CANCEL_REQUEST_CALL = "self-cancel-request-call",
  ACCEPT_REQUEST_CALL = "accept-request-call",
  CANCEL_CALL = "cancel-call",
}
