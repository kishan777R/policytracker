import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TasksComponent } from './tasks/tasks.component';
import { TasksAddComponent } from './tasks-add/tasks-add.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'tasks/:task_for/:task_for_id_int',
    component: TasksComponent
  }, {
    path: 'tasks/:task_for',
    component: TasksComponent
  },
  {
    path: 'tasks',
    component: TasksComponent
  }

  , {
    path: 'addtasks/:task_for/:task_for_id_int',
    component: TasksAddComponent
  }, {
    path: 'taskedit/:task_for/:task_for_id_int/:task_id_int',
    component: TasksAddComponent
  },
   
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
