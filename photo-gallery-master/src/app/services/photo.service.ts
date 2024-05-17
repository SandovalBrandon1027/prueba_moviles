import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: UserPhoto[]=[];
  private PHOTO_STORAGE: string = 'photos';
  constructor() { }

  private async savePicture (photo: Photo) { 
    const base64Data = await this.readAsBase64(photo);
    const fileName = Date.now() + ".jpeg";
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });
    return{
      filepath: fileName,
      WebviewPath: photo.webPath
    };
  }


  private async readAsBase64(photo: Photo) {
    // Fetch the photo, read as a blob, then convert to base64 format const response = await fetch(photo.webPath!);
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    
    return await this.convertBlobToBase64(blob) as string;
    }
    
    private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader(); reader.onerror = reject; reader.onload = () => {
    resolve(reader.result);
    };
    reader.readAsDataURL(blob);
    });
    
    
    public async deletePicture(photo: UserPhoto, position: number) {
      // Remove this photo from the Photos reference data array
      this.photos.splice(position, 1);
    
      // Update photos array cache by overwriting the existing photo array
      Preferences.set({
        key: this.PHOTO_STORAGE,
        value: JSON.stringify(this.photos)
      });
    
      // delete photo file from filesystem
      const filename = photo.filepath
                          .substr(photo.filepath.lastIndexOf('/') + 1);
    
      await Filesystem.deleteFile({
        path: filename,
        directory: Directory.Data
      });
    }


    public async loadSaved() {
      // Retrieve cached photo array data
      const { value } = await Preferences.get({ key: this.PHOTO_STORAGE }); this.photos = (value ? JSON.parse(value) : []) as UserPhoto[];
      
      
      for (let photo of this.photos) {

    const readFile = await Filesystem.readFile({ path: photo.filepath,
      directory: Directory.Data,
     });
  

      photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
    }


      }
      



  public async addNewToGallery() {
    // Tomar foto
    const capturarFoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
    const savedImageFile = await this.savePicture(capturarFoto);
    this.photos.unshift(savedImageFile);


    this.photos.unshift({
      filepath:"soon...",
      webviewPath: capturarFoto.webPath!
    })

    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
      });
      
      

  }
}

export interface UserPhoto{
  filepath: string;
  webviewPath?: string;
}