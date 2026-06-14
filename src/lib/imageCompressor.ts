export async function compressImageClientSide(file: File): Promise<File> {
  // SVG dosyalarını sıkıştırma
  if (file.type === 'image/svg+xml') return file;
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Maksimum genişlik 800 piksel
        const MAX_WIDTH = 800;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(file); // Desteklenmiyorsa orijinali dön
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Tüm tarayıcılarda (eski Safari dahil) %100 çalışması için JPEG formatında %70 kalite ile kaydet
        canvas.toBlob((blob) => {
          if (blob) {
            const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".jpeg";
            const newFile = new File([blob], newFileName, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(newFile);
          } else {
            resolve(file); // Hata durumunda orijinali dön
          }
        }, 'image/jpeg', 0.7); 
      };
      img.onerror = () => resolve(file);
      img.src = event.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}
