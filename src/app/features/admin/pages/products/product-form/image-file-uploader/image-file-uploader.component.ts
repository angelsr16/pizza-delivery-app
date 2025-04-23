import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-image-file-uploader',
  imports: [FileUploadModule, ButtonModule],
  templateUrl: './image-file-uploader.component.html',
  styleUrl: './image-file-uploader.component.scss',
})
export class ImageFileUploaderComponent {
  @Input() file: File | undefined;
  @Output() onFileChange: EventEmitter<File | undefined> = new EventEmitter();

  choose(event: any, callback: any) {
    callback();
  }

  onFilesSelected(event: any) {
    this.onFileChange.emit(event.currentFiles[0]);
  }

  onFileRemoved(event: any) {
    this.onFileChange.emit(undefined);
  }
}
