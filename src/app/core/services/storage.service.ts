import { Injectable } from '@angular/core';
import { CustomFile } from '../models/CustomFile';
import {
  deleteObject,
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private storage: Storage) {}

  async uploadFile(file: File, folderName: string): Promise<CustomFile> {
    const fileName = this.generateUniqueFilename(file);
    const storagePath: string = `${folderName}`;

    var result = await uploadBytes(ref(this.storage, storagePath), file);

    var downloadUrl = await getDownloadURL(result.ref);
    return {
      downloadUrl: downloadUrl,
      fileType: file.type,
      fileName: fileName,
      storagePath: storagePath,
    };
  }

  async deleteFile(filePath: string) {
    const fileRef = ref(this.storage, filePath);
    await deleteObject(fileRef);
  }

  generateUniqueFilename(file: File): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${file.name}_${timestamp}_${random}.${this.getFileExtension(file)}`;
  }

  getFileExtension(file: File): string {
    const parts = file.name.split('.');
    return parts.length > 1 ? parts.pop()?.toLowerCase() ?? '' : '';
  }
}
