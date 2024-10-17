import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompressImageService {
  async compress(file: File, width: number, height: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const base64Image = canvas.toDataURL('image/jpeg', 0.7);
          resolve(base64Image);
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }
}
