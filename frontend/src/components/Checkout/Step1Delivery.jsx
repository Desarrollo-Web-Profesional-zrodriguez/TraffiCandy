import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import toast from "react-hot-toast";

// Leaflet Icons Setup
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

// Auto-recenter util
const RecenterAutomatically = ({lat, lng}) => {
  const map = useMapEvents({});
  useEffect(() => {
    map.flyTo([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

// Marker util
function LocationMarker({ position, setPosition, fetchAddress }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      fetchAddress(e.latlng.lat, e.latlng.lng);
    },
  });
  return position === null ? null : <Marker position={position} />;
}

export default function Step1Delivery({ formData, setFormData, handleChange }) {
  const [showMap, setShowMap] = useState(false);
  const [mapPosition, setMapPosition] = useState({ lat: 19.4326, lng: -99.1332 });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    handleGetCurrentLocation();
    // eslint-disable-next-line
  }, []);

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
          console.warn("Ubicación denegada:", error);
          setIsSearching(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  };

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
        toast.error("No se encontró la dirección.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error buscando.");
    } finally {
      setIsSearching(false);
    }
  };

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
      console.error(err);
    }
  };

  return (
    <div className={`space-y-6 animate-fade-in grid grid-cols-1 ${showMap ? 'lg:grid-cols-2' : ''} gap-8 transition-all duration-500`}>
      
      {/* Columna Izquierda/Derecha: Detalles */}
      <div className={`space-y-6 ${showMap ? 'lg:order-2' : ''}`}>
        <h2 className="text-xl font-bold text-white mb-2">👤 Paso 1: Detalles de Envío</h2>
        
        <div className="space-y-2">
          <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Nombre de quien recibe *</label>
          <input required name="nombreReceptor" value={formData.nombreReceptor} onChange={handleChange} placeholder="Ej. Juan Pérez" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none" />
        </div>

        <div className="space-y-2 relative">
          <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Dirección Exacta *</label>
          <textarea required rows="2" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Calle, Número, Colonia..." className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none pr-32" />
          
          <button 
            type="button" 
            onClick={() => setShowMap(!showMap)}
            className="absolute right-3 bottom-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-md transition-all flex items-center gap-1"
          >
            🗺️ {showMap ? "Ocultar" : "Fijar Mapa"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Ciudad *</label>
            <input required name="ciudad" value={formData.ciudad} onChange={handleChange} className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">C.P.</label>
            <input name="codigoPostal" value={formData.codigoPostal} onChange={handleChange} className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Estado / Provincia</label>
            <input name="estadoProvincia" value={formData.estadoProvincia} onChange={handleChange} className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">País</label>
            <select name="pais" value={formData.pais} onChange={handleChange} className="w-full bg-slate-900 border border-white/10 text-white/90 rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none transition-all">
              <option value="MX">México 🇲🇽</option>
              <option value="US">USA 🇺🇸</option>
              <option value="CA">Canadá 🇨🇦</option>
              <option value="ES">España 🇪🇸</option>
              <option value="OTHER">Otro</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Referencias / Notas Extras</label>
          <input name="referencias" value={formData.referencias} onChange={handleChange} placeholder="Ej. Casa azul brillante..." className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none" />
        </div>
      </div>

      {/* Columna Mapa (Aparece a la Izquierda) */}
      {showMap && (
        <div className="space-y-4 animate-fade-in flex flex-col h-full lg:border-r border-white/10 lg:pr-8 mt-6 lg:mt-0 lg:order-1">
          <h3 className="text-white/80 font-bold text-sm tracking-wider uppercase mb-2">Ajuste Fino por Satélite</h3>
          
          <div className={`w-full overflow-hidden transition-all duration-300 ${isSearching ? 'h-1.5 mb-2 opacity-100' : 'h-0 opacity-0'}`}>
            <div className="h-full bg-gradient-to-r from-[#FF006E] to-[#FB5607] animate-pulse rounded-full" style={{width: '100%', boxShadow: '0 0 10px #FF006E'}}></div>
          </div>
          <div className="flex gap-2">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearchAddress(e)} placeholder="Busca tu dirección..." className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 outline-none text-sm focus:border-indigo-500" />
            <button type="button" onClick={handleSearchAddress} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 rounded-xl font-bold text-sm transition-colors">Ir</button>
            <button type="button" onClick={handleGetCurrentLocation} className="bg-white/10 hover:bg-white/20 transition-colors border border-white/20 text-white px-3 py-2 rounded-xl text-lg relative" title="Mi ubicación">📍</button>
          </div>
          
          <div className="flex-1 min-h-[300px] w-full rounded-2xl overflow-hidden border border-white/20 shadow-lg relative z-0 mt-2">
            <MapContainer center={mapPosition} zoom={15} scrollWheelZoom={true} className="h-full w-full">
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker position={mapPosition} setPosition={setMapPosition} fetchAddress={fetchAddressFromCoords} />
              <RecenterAutomatically lat={mapPosition.lat} lng={mapPosition.lng} />
            </MapContainer>
          </div>
          <p className="text-[#FF006E] text-xs font-bold bg-[#FF006E]/10 p-2 rounded-lg border border-[#FF006E]/20 text-center">🗺️ Dale clic al mapa e inyectaremos las coordenadas visualmente a tu dirección</p>
        </div>
      )}
    </div>
  );
}
