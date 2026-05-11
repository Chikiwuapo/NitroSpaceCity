import { useState, useEffect } from 'react';

export const useVehiculoForm = (
  initialData,
  isOpen,
  onClose,
  onSuccess
) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const initialFormState = {
    anio: new Date().getFullYear(),
    color: '',
    precio_u: '',
    stock: '',
    tipo_combustible: 'Gasolina',
    transmision: 'Mecánica',
    kilometraje: '',
    nro_puertas: 4,
    url_img: '',
    id_estado_vehiculo: 1,
    id_estado_vehiculo_venta: 1,
    id_modelo: '',
    id_tipo_vehiculo: ''
  };

  const [form, setForm] = useState(initialFormState);

  const safeNumber = (value, fallback = 0) => {
    if (value === undefined || value === null || value === '') {
      return fallback;
    }

    const number = Number(value);

    return isNaN(number) ? fallback : number;
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsAnimating(true), 10);

      if (initialData) {
        setForm({
          anio: safeNumber(initialData.anio, new Date().getFullYear()),

          color: initialData.color || '',

          precio_u: safeNumber(
            initialData.precio_u ?? initialData.precio,
            0
          ),

          stock: safeNumber(initialData.stock, 0),

          tipo_combustible:
            initialData.tipo_combustible ||
            initialData.combustible ||
            'Gasolina',

          transmision:
            initialData.transmision === 'Automatica'
              ? 'Automatica'
              : 'Mecánica',

          kilometraje: safeNumber(initialData.kilometraje, 0),

          nro_puertas: safeNumber(initialData.nro_puertas, 4),

          url_img:
            initialData.url_img ||
            initialData.imagen ||
            '',

          id_estado_vehiculo: safeNumber(
            initialData.id_estado_vehiculo,
            1
          ),

          id_estado_vehiculo_venta: safeNumber(
            initialData.id_estado_vehiculo_venta,
            1
          ),

          id_modelo: safeNumber(initialData.id_modelo, 1),

          id_tipo_vehiculo: safeNumber(
            initialData.id_tipo_vehiculo,
            1
          )
        });
      } else {
        setForm(initialFormState);
      }
    } else {
      setIsAnimating(false);
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const numericFields = [
      'anio',
      'precio_u',
      'stock',
      'kilometraje',
      'nro_puertas',
      'id_estado_vehiculo',
      'id_estado_vehiculo_venta',
      'id_modelo',
      'id_tipo_vehiculo'
    ];

    setForm((prev) => ({
      ...prev,
      [name]: numericFields.includes(name)
        ? value === ''
          ? ''
          : Number(value)
        : value
    }));
  };

 const handleSubmit = async (e) => {
  if (e) e.preventDefault();

  if (isSubmitting) return;

  // VALIDACIONES
  if (!form.url_img.startsWith('http')) {
    return alert('URL de imagen inválida');
  }

  if (!form.color.trim()) {
    return alert('El color es obligatorio');
  }

  if (safeNumber(form.precio_u) <= 0) {
    return alert('El precio debe ser mayor a 0');
  }

  if (!['Mecánica', 'Automatica'].includes(form.transmision)) {
    return alert('Transmisión inválida');
  }

  const combustiblesValidos = [
    'Gasolina',
    'Diesel',
    'Eléctrico',
    'Híbrido',
    'GLP',
    'GNV'
  ];

  if (!combustiblesValidos.includes(form.tipo_combustible)) {
    return alert('Tipo de combustible inválido');
  }

  // PAYLOAD LIMPIO
  const payload = {
    anio: Number(form.anio),
    color: form.color.trim(),
    precio_u: Number(form.precio_u),
    stock: Number(form.stock),
    tipo_combustible: form.tipo_combustible,
    transmision: form.transmision,
    kilometraje: Number(form.kilometraje),
    nro_puertas: Number(form.nro_puertas),
    url_img: form.url_img.trim(),
    id_estado_vehiculo: Number(form.id_estado_vehiculo),
    id_estado_vehiculo_venta: Number(form.id_estado_vehiculo_venta),
    id_modelo: Number(form.id_modelo),
    id_tipo_vehiculo: Number(form.id_tipo_vehiculo)
  };

  console.log('PAYLOAD ENVIADO:', payload);

  try {
    setIsSubmitting(true);

    const token = localStorage.getItem('token');

    const id =
      initialData?.id ||
      initialData?.id_vehiculo;

    const isEditing = Boolean(id);

    const url = isEditing
      ? `https://faithful-healing-production-9e06.up.railway.app/api/vehicles/${id}`
      : `https://faithful-healing-production-9e06.up.railway.app/api/vehicles`;

    const response = await fetch(url, {
      method: isEditing ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    console.log('RESPUESTA API:', data);

    if (!response.ok) {
      throw new Error(
        data.message ||
        data.error ||
        'Error de validación'
      );
    }

    setShowSuccess(true);

    setTimeout(async () => {
      setShowSuccess(false);

      if (onSuccess) {
        await onSuccess();
      }

      if (onClose) {
        onClose();
      }
    }, 1500);

  } catch (error) {
    console.error('ERROR COMPLETO:', error);

    alert(error.message || 'Error de conexión');

  } finally {
    setIsSubmitting(false);
  }
};

  return {
    form,
    handleChange,
    handleSubmit,
    isAnimating,
    isSubmitting,
    showSuccess
  };
};