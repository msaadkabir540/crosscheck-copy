import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';

export const handleDownload = async (fileUrl, name) => {
  try {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const fileName = name ? name : 'download-file';

    const link = document.createElement('a');
    link.href = url;

    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    toast.error(error);
  }
};

export const handleDownloadCheck = (url) => {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const parts = url.split('/');
      const filename = parts[parts?.length - 1];
      saveAs(blob, filename);
    })
    .catch((error) => {
      console.error('Error downloading the image:', error);
    });
};
