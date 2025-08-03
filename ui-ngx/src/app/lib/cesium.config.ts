// @ts-nocheck
export const initCesiumConfig = (Cesium) => {
  const cesiumConfig = {
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhY2FkZGFlYS0xYTRjLTRmOWQtOTM1Yy03MmE2NGRjZTg3NzgiLCJpZCI6MTQwMDk4LCJpYXQiOjE2OTg1NzAyMDF9.LspiN3NkTxqHXPs2SZGJS3XwlcInwGRHX-8AXd7VzVw",
    baseUrl: "../../assets/cesium"
  };
  
  window.Cesium = Cesium;
  window.CESIUM_BASE_URL = cesiumConfig.baseUrl;
  Cesium.Ion.defaultAccessToken = cesiumConfig.accessToken;
}