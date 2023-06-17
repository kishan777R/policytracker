import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { CommonService } from '../../common.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.scss'],
})
export class FileuploadComponent implements OnInit {
  @Input() moduleInfo: any
  constructor(public CommonService: CommonService, private http: HttpClient) { }
  @Output() newmoduleInfo = new EventEmitter<string>();

  ngOnInit() { }
  onFileChange(fileChangeEvent: any) {
    let formData = new FormData();
    for (let i = 0; i < fileChangeEvent.target.files.length; i++) {
      let file = fileChangeEvent.target.files[i];
      formData.append("photos[]", file, file.name);
    }

    this.submitMultipleForm(formData);
  }
  loading :any =false;
  async submitMultipleForm(formData: any) {
    this. loading = true;

    const serverUrl = environment.commonURL +this.moduleInfo.apipath;  
    this.http.post(serverUrl, formData).subscribe((data: any) => {
      this. loading = false;

      if (data.status) {
        this.moduleInfo.imagePathArr = data.imagePathArr ;
        if (this.moduleInfo.showPreview) {

          this.moduleInfo.image_path = data.imagePathArr[0].filepath;
          this.moduleInfo.serverpath = data.imagePathArr[0].serverpath;
        }
        this.newmoduleInfo.emit(this.moduleInfo);

      } else {
        this.CommonService.message({ 'message': data.message, color: 'danger' })

      }
    });
  }
}
