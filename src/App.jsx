import { useState, useEffect } from "react"
import mockup from './assets/mockup.webp'

/////////////////////////////
//    Foto Produk Anda     //
/////////////////////////////
import MatchaMilleCrepes from './assets/Matcha-Mille-Crepes.webp'
import ChocolateMousse from './assets/Chocolate-Mousse.webp'
import TiramisuBox from './assets/Tiramisu-Box.webp'
import StrawberryCheesetart from './assets/Strawberry-Cheesetart.webp'


export default function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nama: '',
    noTelp: '',
    alamat: '',
    kirim: '',
    produk: {},
  })
const [loading, setLoading] = useState(false);
const [statusMessage, setStatusMessage] = useState('');
const [showLoading, setShowLoading] = useState(true);
const [showSuccessModal, setShowSuccessModal] = useState(false);

  ////////////////////////
  //    Produk Anda     //
  ////////////////////////
  const listProduk = [
    { id: 'p1', nama: 'Matcha Mille Crepes', harga: 25000, img: MatchaMilleCrepes},
    { id: 'p2', nama: 'Chocolate Mousse', harga: 30000, img: ChocolateMousse},
    { id: 'p3', nama: 'Tiramisu Box', harga: 35000, img: TiramisuBox},
    { id: 'p4', nama: 'Strawberry Cheesetart', harga: 28000, img: StrawberryCheesetart},
  ];

  /////////////////////////////////
  //    Tentukan Ongkir Anda     //
  ////////////////////////////////
  const ongkir = 2000;

  const handleNextStep = () => setStep(step + 1)
  const handlePrevStep = () => setStep(step - 1)

  const handlerInputChange = (input, value) => {
    setFormData((prev) => ({
      ...prev,
      [input]: value
    }))
    console.log(formData)
  } 

  const handleQtyChange = (id, value) => {
    const qty = Math.max(0, parseInt(value) || 0);
    setFormData((prev) => ({
      ...prev,
      produk: {
        ...prev.produk,
        [id]:qty
      }
    }))
  }

  const subTotal = listProduk.reduce((acc, prod) => {
    const qty = formData.produk[prod.id] || 0;
    return acc + (prod.harga * qty)
  }, 0)

  const biayaPengiriman = subTotal > 0? ongkir: 0;
  const total = biayaPengiriman + subTotal;

  // SUBMIT
  const handleSubmit = async (e) => {{
    e.preventDefault();
    setLoading(true);
    setStatusMessage('');

    ////////////////////////
    //      API Anda      //
    ////////////////////////
    const APPS_SCRIPT_URL = 'YOUR_API_KEY';

    try {
      const teksProdukBeli = listProduk.filter(prod => (formData.produk[prod.id] || 0) > 0).map((prod) => `${prod.nama} (${formData.produk[prod.id]})`).join(', ');

      if (!teksProdukBeli) {
        setStatusMessage('Gagal: Anda belum memilih produk apa pun.');
        setLoading(false);
        return;
      }

      const formBody = new URLSearchParams();
      formBody.append('nama', formData.nama);
      formBody.append('noTelp', formData.noTelp);
      formBody.append('alamat', formData.alamat);
      formBody.append('tanggalKirim', formData.kirim);
      formBody.append('daftarProduk', teksProdukBeli);
      formBody.append('subtotal', subTotal);
      formBody.append('ongkir', biayaPengiriman);
      formBody.append('totalBayar', total);

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        "Content-Type":'application/x-www-form-urlencoded',
      },
      body: formBody.toString(),
    });

    const result = await response.json();
    
    if(result.status === 'success') {
      setStatusMessage('Pre-Order berhasil disimpan! Terima kasih.');
      console.log(statusMessage)
      setShowSuccessModal(true);
    } else {
      setStatusMessage(`${result.message}`);
    }

  } catch (error) {
    console.error('Error saat kirim data:', error);
    setStatusMessage('Terjadi kesalahan koneksi ke server.');
  } finally {
    setLoading(false);
  }
      console.log(statusMessage)

  }}

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setStatusMessage('');
    setFormData({
      nama: '',
      noTelp: '',
      alamat: '',
      kirim: '',
      produk: {},
    });
    setStep(1);
  };

  return (
    <>
      <section className="flex flex-col items-center justify-center gap-8 min-h-screen h-full w-full py-6">

        {showLoading && (
          <LoadingScreen onFinished={() => setShowLoading(false)} />
        )}

        {/* Child */}
        <div className="w-1/3 h-full flex flex-col justify-center gap-6 py-8 px-6 rounded-2xl bg-gray-100 shadow-slate-900/40 shadow-lg max-md:w-11/12">
          <div className="flex flex-col items-center">
            <h1 className="font-zain text-4xl max-md:text-3xl w-full font-semibold text-mauve-600 text-center">PreOrder Desert</h1>
            <p className="font-zain text-lg max-md:text-md w-full font-semibold text-gray-600/40 text-center">Isi Data Pesanan Anda</p>
          </div>
            {step === 1 ?<Step1 inputChange={handlerInputChange} formData={formData}/>:''}
            {step === 2 ?<Step2 listProduk={listProduk} selectedProduct={formData.produk} handleQtyChange={handleQtyChange}/>:''}
            {step === 3 ?<Step3 subTotal={subTotal} ongkir={biayaPengiriman} total={total} listProduk={listProduk} selectedProduct={formData.produk} handleSubmit={handleSubmit} loading={loading} statusMessage={statusMessage} showSuccessModal={showSuccessModal} onCloseModal={handleCloseModal}/>:''}
          </div>

          {/* Next & Prev */}
          <NextPrev handleNext={handleNextStep} handlePrev={handlePrevStep} step={step}/>
      </section>
    </>
  )
}

function Step1({inputChange, formData}) {
  return (
    <>
    <div className="flex flex-col gap-6">

      <div className="flex flex-col gap-2">
        <label className="font-nunito text-gray-900">Nama</label>
        <input onChange={(e) => inputChange('nama', e.target.value)} value={formData.nama} className="w-full border border-gray-400/40 py-2 px-4 rounded-2xl" type="text" placeholder="Masukan Nama (cth: Budi)" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-nunito text-gray-900">No Telp</label>
        <input onChange={(e) => inputChange('noTelp', e.target.value)} value={formData.noTelp} className="w-full border border-gray-400/40 py-2 px-4 rounded-2xl" type="number" placeholder="Masukan No Telp (cth: 08123456789)" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-nunito text-gray-900">Alamat</label>
        <input onChange={(e) => inputChange('alamat', e.target.value)} value={formData.alamat} className="w-full border border-gray-400/40 py-2 px-4 rounded-2xl" type="text" placeholder="Masukan Alamat (cth: Desa Sukamaju, RT01 RW02)" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-nunito text-gray-900">Tanggal Dikirim</label>
        <input onChange={(e) => inputChange('kirim', e.target.value)} value={formData.kirim} className="w-full border border-gray-400/40 py-2 px-4 rounded-2xl" type="date" placeholder="Kapan Dikirim" />
      </div>

    </div>
    </>
  )
}

function Step2({listProduk, selectedProduct, handleQtyChange}) {
  return (
    <>
    <div className="grid grid-cols-2 grid-rows-[repeat(auto-fill,1fr)] w-full h-full gap-5 max-md:grid-cols-1">
      {listProduk.map((prod) => (
        <ProductCard 
          key={prod.id} 
          nama={prod.nama} 
          harga={prod.harga} 
          qty={selectedProduct[prod.id] || 0} 
          img={prod.img}
          onIncrement={() => handleQtyChange(prod.id, (selectedProduct[prod.id] || 0) + 1)} 
          onDecrement={() => handleQtyChange(prod.id, (selectedProduct[prod.id] || 0) - 1)}
          onDirectChange={(value) => handleQtyChange(prod.id, value)}/>
      ))}
    </div>
    </>
  )
}

function Step3({subTotal = 0, ongkir = 0, total = 0, listProduk, selectedProduct, handleSubmit, loading, statusMessage, showSuccessModal, onCloseModal}) {
  const produkDibeli = listProduk.filter(prod => (selectedProduct[prod.id] || 0)> 0);
  return(
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-center w-full">
        <h2 className="font-zain text-xl w-full font-semibold text-mauve-600 text-center">Rincian Order</h2>
        <Line/>
        <div className="flex flex-col w-full gap-4 mt-4">
          {produkDibeli.length === 0 ? (
              <p className="text-sm text-gray-500 text-center italic py-2">Belum ada produk yang dipilih</p>
          ):(
            produkDibeli.map((prod) => (
              <ProductCardDetails key={prod.id} nama={prod.nama} img={prod.img} harga={prod.harga} qty={selectedProduct[prod.id]}/>
            ))
            )
          }
        </div>
      </div>
      <div className="flex flex-col w-full items-center gap-4">
      <Line/>
        <div className="flex w-full justify-between border-gray-800/40 border-b pb-2">
          <p>Subtotal</p>
          <span>Rp {subTotal.toLocaleString()}</span>
        </div>
        <div className="flex w-full justify-between border-gray-800/40 border-b pb-2">
          <p>Biaya Pengiriman</p>
          <span>Rp {ongkir.toLocaleString()}</span>
        </div>
        <div className="flex w-full justify-between border-gray-800/40 border-b-0 pb-2">
          <p className="font-bold">Total</p>
          <span>Rp {total.toLocaleString()}</span>
        </div>
      </div>

      {statusMessage && (
        // <p className={`text-sm text-center font-semibold ${statusMessage.startsWith('Gagal') ? 'text-red-500' : 'text-green-600'}`}>
        <p className={`text-sm text-center font-semibold text-red-500`}>

          {statusMessage}
        </p>
      )}

      <button onClick={handleSubmit} className={`w-full py-2 px-4 bg-mauve-600 rounded-2xl border border-mauve-600 font-zain font-medium text-xl text-gray-50 ${loading ? 'bg-gray-400 border-gray-400 cursor-not-allowed opacity-70' : 'bg-mauve-600 border-mauve-600 hover:bg-mauve-700 active:scale-[0.98]'}`} type="button">
        {loading ? 'Sedang Memproses...' : 'Order'}
      </button>

      {/* ==================== CUSTOM ALERT / MODAL SUKSES ==================== */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm flex flex-col items-center gap-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Ikon Centang Hijau */}
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 text-3xl font-bold">
              ✓
            </div>
            
            <div className="text-center">
              <h3 className="font-nunito font-bold text-xl text-gray-900">Pre-Order Sukses!</h3>
              <p className="font-nunito text-sm text-gray-500 mt-1">Data pesanan Anda berhasil disimpan ke dalam sistem.</p>
            </div>

            {/* Tombol Oke */}
            <button
              onClick={onCloseModal}
              className="w-full mt-2 py-2 px-4 bg-green-500 hover:bg-green-600 active:scale-[0.98] transition-all rounded-xl font-zain font-medium text-lg text-white shadow-lg shadow-green-500/20"
              type="button"
            >
              Oke, Kembali ke Awal
            </button>
          </div>
        </div>
      )}
      {/* ====================================================================== */}
    </div>
  )
}

function NextPrev({handleNext, handlePrev, step}) {
  return (
    <div className="flex flex-col items-center gap-4 w-1/3 max-md:w-11/12">
      <button onClick={handleNext} className={`w-full py-2 px-4 bg-mauve-600 rounded-2xl border ${step === 3?'pointer-events-none opacity-40 cursor-not-allowed':''} border-mauve-600 hover:bg-mauve-700 hover:border-mauve-600/60 font-zain font-medium text-xl text-gray-50`}>Next</button>
      <button onClick={handlePrev} className={`w-full py-2 px-4 rounded-2xl border border-mauve-600 font-zain font-medium text-xl text-gray-50 hover:opacity-40 ${step === 1?'pointer-events-none opacity-40 cursor-not-allowed':''}`}>Prev</button>
    </div>
  )
}

function ProductCard({nama, harga, img = mockup, qty, onIncrement, onDecrement, onDirectChange}) {
  return (
    <div className="flex flex-col w-full h-full px-6 py-6 gap-2 bg-gray-50 shadow-xl rounded-2xl justify-between">

      <div className="flex flex-col w-full gap-2">
        <div className="flex justify-between items-center overflow-hidden w-full h-24 rounded-2xl shadow-sm max-md:h-fit">
          <img className="w-full h-full" src={img} alt="" />
        </div>
        <div className="flex flex-col">
          <h3 className="font-nunito font-bold text-xl text-gray-900">{nama}</h3>
          <p className="font-nunito font-bold text-sm text-gray-900/40">Rp {harga.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-col w-full gap-2">
        <div className="flex justify-between items-center gap-2">
          <button onClick={onIncrement} className="px-2.5 py-1 rounded-full flex items-center justify-center border border-gray-800/40">+</button>
          <input onChange={(e) => onDirectChange(e.target.value)} className="w-full text-center py-0.5 border border-gray-800/40 rounded-full appearance: none;" type="number" min="0" max="100" value={qty}/>
          <button onClick={onDecrement} className="px-3 py-1 rounded-full flex items-center justify-center border border-gray-800/40">-</button>
        </div>
        <button onClick={() => { if(qty === 0) onIncrement() }} className="w-full py-1 px-1 bg-mauve-600 rounded-2xl border border-mauve-600 font-zain text-md text-gray-50">
          {qty > 0 ? `Terpilih (${qty})` : 'Pilih'}
        </button>
      </div>
    </div>
  )
}

function Line() {
  return (
    <span className="w-full h-0.5 bg-gray-800/40 rounded-2xl"></span>
  )
}

function ProductCardDetails({qty, img = mockup, nama, harga}) {
  return (
    <div className="flex justify-between items-center h-fit w-full gap-2">
      <div className="flex gap-4">
        <div className="flex justify-between items-center overflow-hidden w-18 h-8 rounded-md shadow-sm">
          <img className="w-full h-full" src={img} alt="" />
        </div>
        <h3 className="font-nunito font-bold text-md text-gray-900">{nama}</h3>
      </div>
      <p className="font-nunito font-bold text-sm text-gray-900/40">Rp {harga.toLocaleString()} x {qty}</p>
    </div>
  )
}

function LoadingScreen({ onFinished }) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const intervalTime = 30; 
    const totalDuration = 2500;
    const increment = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, totalDuration);

    const finishedTimer = setTimeout(() => {
      if (onFinished) onFinished();
    }, totalDuration + 500); 

    return () => {
      clearInterval(timer);
      clearTimeout(exitTimer);
      clearTimeout(finishedTimer);
    };
  }, [onFinished]);

  return (
    <div 
      className={`fixed inset-0 flex flex-col items-center justify-center bg-white font-sans select-none z-50
        transition-all duration-500 ease-in-out
        ${isExiting ? '-translate-y-full pointer-events-none' : 'translate-y-0'}`}
    >
      
      <div className="text-center flex flex-col items-center justify-center flex-grow">
        <h1 className="text-4xl md:text-5xl font-bold text-mauve-500 tracking-wide mb-4">
          PreOrder Desert
        </h1>
        <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
          <div 
            className="h-full bg-mauve-500 transition-all duration-75 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-gray-600/40 text-sm tracking-wider animate-pulse">
          Tunggu Sebentar...
        </p>
      </div>

      <div className="pb-8 text-gray-600/40 text-sm font-medium">
        v1.0
      </div>

    </div>
  );
}