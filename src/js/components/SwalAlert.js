import Swal from 'sweetalert2';

const SpawnSwal = async (type, title, text, isConfirm = false) => {
  if (isConfirm) {
    const result = await Swal.fire({
      icon: type,
      title: title,
      text: text,
      showCancelButton: true,
      confirmButtonText: 'Ya, lanjutkan',
      cancelButtonText: 'Batal',
    });
    return result.isConfirmed;
  } else {
    await Swal.fire({
      icon: type,
      title: title,
      text: text,
    });
  }
};

export default SpawnSwal;
