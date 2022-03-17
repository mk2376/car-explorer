export class mobileDeviceHandler {
  private static _instance: mobileDeviceHandler;
  private static _isMobile = false;

  private constructor() {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      mobileDeviceHandler._isMobile = true;
    }
  }

  public static getInstance(): mobileDeviceHandler {
    return this._instance || (this._instance = new this());
  }

  static get isMobile() {
    return mobileDeviceHandler._isMobile;
  }
}
