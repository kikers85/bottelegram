import Swal from 'sweetalert2';

/**
 * Custom SweetAlert2 configuration for SecureBot Builder
 * Designed for Premium Aesthetics & Rich Interactions
 */
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#1e293b',
  color: '#f8fafc',
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

export const alerts = {
  /**
   * Success Toast
   */
  success: (title: string, text?: string) => {
    Toast.fire({
      icon: 'success',
      iconColor: '#10b981',
      title,
      text,
      background: '#1e293b',
    });
  },

  /**
   * Error Alert (Modal)
   */
  error: (title: string, text?: string) => {
    Swal.fire({
      icon: 'error',
      iconColor: '#ef4444',
      title,
      text,
      background: '#1e293b',
      color: '#f8fafc',
      confirmButtonColor: '#4f46e5',
      customClass: {
        popup: 'rounded-2xl border border-slate-700 shadow-2xl',
      }
    });
  },

  /**
   * Warning/Confirmation Dialog
   */
  confirm: async (title: string, text: string) => {
    const result = await Swal.fire({
      title,
      text,
      icon: 'warning',
      iconColor: '#f59e0b',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
      background: '#1e293b',
      color: '#f8fafc',
      customClass: {
        popup: 'rounded-2xl border border-slate-700 shadow-2xl',
        confirmButton: 'px-6 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider transition-all hover:scale-105 active:scale-95',
        cancelButton: 'px-6 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider transition-all'
      }
    });
    return result.isConfirmed;
  },

  /**
   * Loading State
   */
  loading: (title: string, text: string = 'Por favor, espere...') => {
    Swal.fire({
      title,
      text,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      background: '#1e293b',
      color: '#f8fafc',
    });
  },

  /**
   * Close specific or all alerts
   */
  close: () => {
    Swal.close();
  }
};
