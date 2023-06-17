import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent  } from './loader/loader.component';
import { TasksComponent } from './tasks/tasks.component';
import { TasksAddComponent } from './tasks-add/tasks-add.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent,LoaderComponent,TasksComponent,TasksAddComponent,  ],
  imports: [BrowserModule, IonicModule.forRoot(),    FormsModule,
    AppRoutingModule, HttpClientModule,SharedModule
  ],
  providers: [FormsModule, ReactiveFormsModule, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
