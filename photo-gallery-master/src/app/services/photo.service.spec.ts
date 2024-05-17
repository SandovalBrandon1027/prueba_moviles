import { TestBed } from '@angular/core/testing';

//import { PhotoService } from './photo.service';

import{Camera, CameraResultType, CameraSource,Photo} from "@capacitor/camera"
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn:"root"
})
export class PhotoService{
  constructor(){ }
  public async addNewToGallery(){

    //take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    })
  }
}
// describe('PhotoService', () => {
//   let service: PhotoService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(PhotoService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });
