class APiResponse {
  constructor(status, message = "Success", data) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.success = status < 400;
  }
}
export { APiResponse };
