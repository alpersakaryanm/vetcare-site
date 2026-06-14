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
        
        // WebP formatında 50 KB altına inene kadar kaliteyi düşürerek sıkıştır
        let quality = 0.7;
        const targetSize = 50 * 1024; // 50 KB
        
        const compress = () => {
          canvas.toBlob((blob) => {
            if (!blob) return resolve(file);
            
            // Eğer tarayıcı WebP desteklemiyorsa otomatik PNG üretir, bu yüzden JPEG'e zorla düşürüyoruz
            if (blob.type !== 'image/webp') {
              canvas.toBlob((fallbackBlob) => {
                if (!fallbackBlob) return resolve(file);
                resolve(new File([fallbackBlob], file.name.replace(/\.[^/.]+$/, "") + ".jpeg", { type: 'image/jpeg', lastModified: Date.now() }));
              }, 'image/jpeg', 0.5);
              return;
            }

            // 50 KB'dan büyükse kaliteyi düşürüp tekrar dene
            if (blob.size > targetSize && quality > 0.1) {
              quality -= 0.15;
              compress();
            } else {
              // 50 KB altındaysa (veya kalite çok düştüyse) kaydet
              const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
              const newFile = new File([blob], newFileName, {
                type: 'image/webp',
                lastModified: Date.now(),
              });
              resolve(newFile);
            }
          }, 'image/webp', quality);
        };
        
        compress();
      };
      img.onerror = () => resolve(file);
      img.src = event.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}
