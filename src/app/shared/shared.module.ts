import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileuploadComponent } from '../shared/fileupload/fileupload.component';
import { IonicModule    } from '@ionic/angular';


@NgModule({
  declarations: [FileuploadComponent],
  imports: [
    CommonModule,IonicModule , 
  ],
 
  exports: [
    FileuploadComponent,
  ]
})
export class SharedModule { }
