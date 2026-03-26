import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// Reparar íconos de Leaflet en React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Trick to recenter map when search changes position
const RecenterAutomatically = ({lat, lng}) => {
   const map = useMapEvents({});
   useEffect(() => {
     map.flyTo([lat, lng], map.getZoom());
   }, [lat, lng, map]);
   return null;
}

// Componente para manejar clics en el mapa
function LocationMarker({ position, setPosition, fetchAddress }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      fetchAddress(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  )
}

export default function Checkout() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Map State (Por defecto CDMX)
  const [mapPosition, setMapPosition] = useState({ lat: 19.4326, lng: -99.1332 });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nombreReceptor: "",
    direccion: "",
    referencias: "",
    ciudad: "",
    estadoProvincia: "",
    pais: "MX",
    codigoPostal: ""
  });

  // Autodetectar la ubicación actual al cargar si se da permiso
  useEffect(() => {
    handleGetCurrentLocation();
  }, []); // Se ejecuta una sola vez al montar

  const handleGetCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setIsSearching(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMapPosition({ lat, lng });
          fetchAddressFromCoords(lat, lng);
          setIsSearching(false);
        },
        (error) => {
          console.warn("Ubicación denegada o no disponible:", error);
          setIsSearching(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  };

  // Búsqueda por texto (Geocoding con Nominatim)
  const handleSearchAddress = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await resp.json();
      if (data && data.length > 0) {
        const result = data[0];
        const newPos = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
        setMapPosition(newPos);
        fetchAddressFromCoords(newPos.lat, newPos.lng);
      } else {
        alert("No se encontró la dirección. Intenta de nuevo.");
      }
    } catch (err) {
      console.error(err);
      alert("Error buscando la dirección.");
    } finally {
      setIsSearching(false);
    }
  };

  // Click en mapa -> Coordenadas a Texto (Reverse Geocoding)
  const fetchAddressFromCoords = async (lat, lng) => {
    try {
      const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await resp.json();
      
      if (data && data.address) {
        const addr = data.address;
        setFormData(prev => ({
          ...prev,
          direccion: data.display_name,
          ciudad: addr.city || addr.town || addr.village || prev.ciudad,
          estadoProvincia: addr.state || prev.estadoProvincia,
          codigoPostal: addr.postcode || prev.codigoPostal,
          pais: addr.country_code ? addr.country_code.toUpperCase() : prev.pais
        }));
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNextStep = () => {
    if (step === 1 && !formData.direccion) {
      alert("Por favor selecciona una ubicación en el mapa o busca una dirección.");
      return;
    }
    if (step === 2 && (!formData.nombreReceptor || !formData.ciudad)) {
      alert("Por favor llena los campos obligatorios.");
      return;
    }
    setStep(s => s + 1);
  };
  
  const handlePrevStep = () => setStep(s => s - 1);

  const handleSimulatePayment = (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("¡Orden confirmada (Pago Manual/OXXO)! Tu orden de dulces está en preparación. 🍬✈️");
      navigate("/");
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-3xl border border-white/20 rounded-3xl p-6 md:p-10 shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF006E] to-[#FB5607] mb-4 text-center">
          Envío Internacional 🌐
        </h1>
        
        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-10 px-4 md:px-12 relative">
          <div className="absolute left-10 right-10 top-1/2 h-1 bg-white/10 -z-10 rounded-full"></div>
          <div className={`absolute left-10 top-1/2 h-1 bg-[#FF006E] -z-10 rounded-full transition-all duration-500`} style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
          
          {[1, 2, 3].map((num) => (
            <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${step >= num ? 'bg-[#FF006E] text-white shadow-[0_0_15px_rgba(255,0,110,0.5)]' : 'bg-gray-800 text-gray-400'}`}>
              {num}
            </div>
          ))}
        </div>

        <form onSubmit={step === 3 ? (e) => e.preventDefault() : (e) => e.preventDefault()} className="space-y-6">
          
          {/* STEP 1: MAP AND LOCATION */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-4">📍 Paso 1: Ubicación Exacta</h2>
              
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex flex-1 gap-2">
                  <input 
                    type="text" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchAddress(e)}
                    placeholder="Ej. Zócalo, CDMX" 
                    className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none transition-all placeholder-white/30" 
                  />
                  <button 
                    type="button" 
                    onClick={handleSearchAddress}
                    disabled={isSearching}
                    className="bg-[#FB5607] hover:bg-[#ff6b25] text-white px-6 rounded-xl font-bold transition-all disabled:opacity-50"
                  >
                    {isSearching ? '...' : 'Buscar'}
                  </button>
                </div>
                <button 
                  type="button" 
                  onClick={handleGetCurrentLocation}
                  disabled={isSearching}
                  className="bg-white/10 border border-white/20 hover:bg-white/20 text-white px-4 py-3 rounded-xl font-bold transition-all disabled:opacity-50 whitespace-nowrap"
                  title="Usar mi ubicación actual"
                >
                  📍 Autodetectar
                </button>
              </div>

              <div className="h-80 w-full rounded-2xl overflow-hidden border border-white/20 shadow-lg relative z-0">
                <MapContainer center={mapPosition} zoom={15} scrollWheelZoom={true} className="h-full w-full">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationMarker position={mapPosition} setPosition={setMapPosition} fetchAddress={fetchAddressFromCoords} />
                  
                  {/* Auto-recenter effect trick */}
                  <RecenterAutomatically lat={mapPosition.lat} lng={mapPosition.lng} />
                </MapContainer>
              </div>
              <p className="text-white/60 text-sm text-center">🗺️ Da clic en el mapa para ajustar la ubicación. La detección puede ser inexacta.</p>

              <div className="bg-[#FF006E]/10 border border-[#FF006E]/30 p-4 rounded-xl">
                <label className="text-[#FF006E] font-bold text-sm mb-2 block">Dirección Detectada (Modifícala si es necesario para mayor precisión):</label>
                <textarea 
                  rows="2"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Ej. Calle 123, Colonia XYZ..."
                  className="w-full bg-white/10 border border-[#FF006E]/50 text-white rounded-lg px-3 py-2 outline-none focus:border-[#FB5607] transition-all"
                />
              </div>
            </div>
          )}

          {/* STEP 2: DETAILS */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-4">
              <h2 className="text-xl font-bold text-white mb-2 md:col-span-2">👤 Paso 2: Detalles del Destinatario</h2>
              
              <div className="space-y-2 md:col-span-2">
                <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Nombre de quien recibe *</label>
                <input required name="nombreReceptor" value={formData.nombreReceptor} onChange={handleChange} placeholder="Ej. Juan Pérez" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Dirección Confirmada *</label>
                <textarea required rows="2" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Calle, Número..." className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Referencias de la Casa / Edificio</label>
                <input name="referencias" value={formData.referencias} onChange={handleChange} placeholder="Ej. Puerta azul, frente al parque" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Ciudad *</label>
                <input required name="ciudad" value={formData.ciudad} onChange={handleChange} className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Estado / Provincia</label>
                <input name="estadoProvincia" value={formData.estadoProvincia} onChange={handleChange} className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">País</label>
                <select name="pais" value={formData.pais} onChange={handleChange} className="w-full bg-slate-900 border border-white/10 text-white/90 rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none transition-all">
                  <option value="MX">México 🇲🇽</option>
                  <option value="US">Estados Unidos 🇺🇸</option>
                  <option value="CA">Canadá 🇨🇦</option>
                  <option value="CO">Colombia 🇨🇴</option>
                  <option value="ES">España 🇪🇸</option>
                  <option value="AR">Argentina 🇦🇷</option>
                  <option value="OTHER">Otro</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Código Postal</label>
                <input name="codigoPostal" value={formData.codigoPostal} onChange={handleChange} className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none" />
              </div>
            </div>
          )}

          {/* STEP 3: SUMMARY AND PAYMENT */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-2">💳 Paso 3: Confirmación de Pago</h2>
              
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-white space-y-3">
                <h3 className="font-bold text-[#FB5607] border-b border-white/10 pb-2 mb-4">Resumen de Envío</h3>
                <p><strong>Receptor:</strong> {formData.nombreReceptor}</p>
                <p><strong>Destino:</strong> {formData.direccion}</p>
                <p><strong>Referencias:</strong> {formData.referencias || 'N/A'}</p>
                <p><strong>Ubicación:</strong> {formData.ciudad}, {formData.estadoProvincia}, {formData.codigoPostal} - {formData.pais}</p>
              </div>

              <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 p-6 rounded-2xl border border-blue-500/20 text-center space-y-4">
                <h3 className="text-white font-bold text-xl">Pagar con PayPal Seguramente</h3>
                <p className="text-white/70 text-sm mb-4">Usa tu cuenta de PayPal o Tarjeta de Crédito/Débito.</p>
                
                <div className="max-w-md mx-auto relative z-0">
                  <PayPalScriptProvider options={{ clientId: "Af8sjYN_QIXasRJIJdofe8cuN0PL6SaXDgOd5wncvyffpdVAP9DTD4zggIo8AdGIKcV3ah0SNwM2214v", currency: "MXN" }}>
                    <PayPalButtons 
                      style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [{
                            amount: { value: "500.00" } // Simulación (MXN 500)
                          }]
                        });
                      }}
                      onApprove={async (data, actions) => {
                        try {
                          const details = await actions.order.capture();
                          alert(`¡Pago completado con éxito por ${details.payer.name.given_name}! 🍬✈️`);
                          navigate("/");
                        } catch (error) {
                          console.error("Error capturando pago:", error);
                          alert("Hubo un error procesando el pago con PayPal.");
                        }
                      }}
                    />
                  </PayPalScriptProvider>
                </div>
              </div>

              <div className="relative flex items-center py-5">
                <div className="flex-grow border-t border-white/20"></div>
                <span className="flex-shrink-0 mx-4 text-white/50 text-sm">O ALTERNATIVAS</span>
                <div className="flex-grow border-t border-white/20"></div>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-6 rounded-2xl border border-green-500/20 text-center space-y-4">
                <h3 className="text-white font-bold text-lg">Transferencia Bancaria / Pago OXXO</h3>
                <p className="text-white/70 text-sm">Si no tienes PayPal, puedes hacer tu pago directo.</p>
                <button disabled={loading} type="button" onClick={handleSimulatePayment} className={`w-full mt-4 rounded-xl bg-gradient-to-r from-[#10a37f] to-[#0d8266] py-4 font-black text-white text-lg transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'shadow-[0_0_20px_rgba(16,163,127,0.5)] hover:scale-[1.02] active:scale-95'}`}>
                  {loading ? "Procesando orden..." : "Pagar por Transferencia / OXXO"}
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 border-t border-white/10 mt-8">
            {step > 1 ? (
              <button type="button" onClick={handlePrevStep} className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all">
                ← Volver
              </button>
            ) : <div></div>}

            {step < 3 ? (
              <button type="button" onClick={handleNextStep} className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#FF006E] to-[#FB5607] text-white font-bold shadow-lg hover:scale-105 transition-all">
                Continuar →
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
