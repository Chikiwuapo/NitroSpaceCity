import React, { useEffect } from 'react';
import { X, Save, Car, Settings, CheckCircle2, Loader2, Image as ImageIcon, DollarSign, Activity } from 'lucide-react';
import { useVehiculoForm } from '../hooks/useVehiculoForm';

const VehiculoForm = ({ isOpen, onClose, initialData, onSuccess, isReadOnly }) => {
  const { 
    form, 
    handleChange, 
    handleSubmit, 
    isAnimating, 
    isSubmitting, 
    showSuccess 
  } = useVehiculoForm(initialData, isOpen, onClose, async () => {
    // Esta es la función que se ejecuta cuando la API responde con éxito
    if (onSuccess) {
      // 1. Esperamos 1.5 segundos para que el usuario vea el check verde de éxito
      setTimeout(() => {
        onSuccess(); // Esto ejecuta refetch() y cierra el modal en InventarioPage
      }, 1500);
    }
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const inputClass = (readOnly) => `
    w-full border rounded-xl p-3 text-sm transition-all outline-none
    ${readOnly 
      ? 'bg-gray-100 border-transparent text-gray-600 cursor-default' 
      : 'bg-gray-50 border-gray-200 focus:bg-white focus:border-[#0a332a] focus:ring-2 focus:ring-[#0a332a]/5'}
  `;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${isAnimating ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose} 
      />
      
      <div className={`relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-500 ease-out ${isAnimating ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-[#0a332a] text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-xl"><Car size={22} /></div>
            <div>
              <h3 className="font-bold text-lg">
                {showSuccess ? '¡Operación Exitosa!' : isReadOnly ? 'Detalles del Vehículo' : (initialData ? 'Editar Registro' : 'Nuevo Ingreso')}
              </h3>
              <p className="text-[10px] text-white/60 uppercase tracking-widest font-medium">Gestión de Inventario v2.0</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          
          {showSuccess && (
            <div className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Datos Guardados</h2>
              <p className="text-gray-500 mt-2">El inventario se ha actualizado correctamente.</p>
            </div>
          )}

          {/* Imagen */}
          <section className="space-y-4">
            <div className="w-full h-48 rounded-[2rem] bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden group relative">
              {form.url_img ? (
                <img src={form.url_img} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              ) : (
                <div className="text-center">
                  <ImageIcon className="w-12 mx-auto text-gray-200 mb-2" />
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Sin vista previa</p>
                </div>
              )}
            </div>
            {!isReadOnly && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">URL de la Imagen</label>
                <input type="text" name="url_img" value={form.url_img} onChange={handleChange} className={inputClass(false)} placeholder="https://ejemplo.com/auto.jpg" required />
              </div>
            )}
          </section>

          {/* Configuración Técnica */}
          <section className="space-y-4">
            <h4 className="text-[11px] font-black text-[#0a332a] uppercase tracking-widest flex items-center gap-2">
              <Settings size={14} /> Especificaciones
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Transmisión</label>
                <select name="transmision" value={form.transmision} onChange={handleChange} className={inputClass(isReadOnly)} disabled={isReadOnly}>
                  <option value="Mecánica">Mecánica</option>
                  <option value="Automatica">Automatica</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Tipo Combustible</label>
                <select name="tipo_combustible" value={form.tipo_combustible} onChange={handleChange} className={inputClass(isReadOnly)} disabled={isReadOnly}>
                  {["Gasolina", "Diesel", "Eléctrico", "Híbrido", "GLP", "GNV"].map(op => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* IDs y Estados */}
          <section className="p-6 bg-emerald-50/50 rounded-[2rem] border border-emerald-100 space-y-4">
            <h4 className="text-[11px] font-black text-[#0a332a] uppercase tracking-widest flex items-center gap-2">
              <Activity size={14} /> Estados y Categoría
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Condición Física</label>
                <select
  name="id_estado_vehiculo"
  value={Number(form.id_estado_vehiculo)}
  onChange={handleChange}
  className={inputClass(isReadOnly)}
>
  <option value={1}>Nuevo</option>
  <option value={2}>Seminuevo</option>
  <option value={3}>Usado</option>
</select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Estado de Venta</label>
               <select 
  name="id_estado_vehiculo_venta" 
  value={Number(form.id_estado_vehiculo_venta)}
  onChange={handleChange}
  className={inputClass(isReadOnly)}
>
  <option value={1}>Disponible</option>
  <option value={2}>No Disponible</option>
  <option value={3}>Vendido</option>
</select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Modelo (ID)</label>
                <input type="number" name="id_modelo" value={form.id_modelo} onChange={handleChange} className={inputClass(isReadOnly)} readOnly={isReadOnly} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Tipo (ID)</label>
                <input type="number" name="id_tipo_vehiculo" value={form.id_tipo_vehiculo} onChange={handleChange} className={inputClass(isReadOnly)} readOnly={isReadOnly} />
              </div>
            </div>
          </section>

          {/* Comercial */}
          <section className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-green-600 uppercase ml-1">Precio Unitario ($)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600"><DollarSign size={14}/></span>
                <input type="number" name="precio_u" value={form.precio_u ?? ''} onChange={handleChange} className={`${inputClass(isReadOnly)} pl-8 font-bold text-green-700`} readOnly={isReadOnly} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Stock</label>
              <input type="number" name="stock" value={form.stock} onChange={handleChange} className={inputClass(isReadOnly)} readOnly={isReadOnly} />
            </div>
          </section>

          {/* Atributos */}
          <div className="grid grid-cols-3 gap-4">
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Año</label>
                <input type="number" name="anio" value={form.anio} onChange={handleChange} className={inputClass(isReadOnly)} readOnly={isReadOnly} />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Km</label>
                <input type="number" name="kilometraje" value={form.kilometraje} onChange={handleChange} className={inputClass(isReadOnly)} readOnly={isReadOnly} />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Puertas</label>
                <input type="number" name="nro_puertas" value={form.nro_puertas} onChange={handleChange} className={inputClass(isReadOnly)} readOnly={isReadOnly} />
             </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Color</label>
            <input type="text" name="color" value={form.color} onChange={handleChange} className={inputClass(isReadOnly)} readOnly={isReadOnly} placeholder="Ej. Gris Platino" />
          </div>
        </form>

        <div className="p-6 bg-gray-50 border-t flex gap-4">
          <button type="button" onClick={onClose} className="flex-1 py-4 px-6 border border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-white transition-all">
            {isReadOnly ? 'Cerrar' : 'Cancelar'}
          </button>
          
          {!isReadOnly && (
            <button 
              type="button" 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-[2] bg-[#0a332a] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#0d4438] transition-all disabled:opacity-50 shadow-lg shadow-emerald-900/10"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar' : 'Registrar'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehiculoForm;