/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// COPY SEMUA KE APPS SCRIPT

function doPost(e) {
  const Header = {
    "Access-Control-Allow-Origin":"*",
    "Access-Control-Allow-Methods":"POST, GET, OPTIONS",
    "Access-Control-Allow-Headers":"Content-Type"
  }

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const timeStamp = new Date();
    const nama = e.parameter.nama;
    const noTelp = e.parameter.noTelp;
    const alamat = e.parameter.alamat;
    const tanggalKirim = e.parameter.tanggalKirim;
    const daftarProduk = e.parameter.daftarProduk;
    const subtotal = e.parameter.subtotal;
    const ongkir = e.parameter.ongkir;
    const totalBayar = e.parameter.totalBayar;

    if(!nama || !noTelp || !alamat || !tanggalKirim) {
      const errorMessage = JSON.stringify({status: "error", message:"Nama, Nomor Telepon, Alamat dan Tanggal Pengiriman Wajib Di Isi!"})
      return ContentService.createTextOutput(errorMessage).setMimeType(ContentService.MimeType.JSON)
    }

    sheet.appendRow([timeStamp, nama, noTelp, alamat, tanggalKirim, daftarProduk, subtotal, ongkir, totalBayar]);

    const succesOutput = JSON.stringify({status: "success",message: "Berhasil Di Kirim"});
    return ContentService.createTextOutput(succesOutput).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    const exceptionOutput = JSON.stringify({status: "error",message: error.toString()});
    return ContentService.createTextOutput(exceptionOutput).setMimeType(ContentService.MimeType.JSON);
  }
}