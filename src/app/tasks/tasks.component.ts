


import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonService } from '../common.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  moduleInfoList: any = { "apipath": "apipolicy/uploadfileoftask", 'linebelowBrowsefile': 'Upload task related documents !', 'module': 'Task', "showPreview": false, "browseimagepath": 'assets/browsefile.png', 'multipleAllowed': true, "filetype": 'Any' };
  deleteFileDataSub: any; saveDataSub: any;
  getSub: any; getSubA: any; changeStatusOfTaskSub: any;
  task_for: any; task_for_id_int: any;
  task_for_policy_account: any;
  task_for_account_id_int: any;
  task_for_policy_id_int: any;
  filteredTasks: any;
  filteredTasks2: any;
  selectedStatuses: any = [];
  tasklevel_pending: boolean = false;
  tasklevel_inprogress: boolean = false;
  showingWhichSectionInModal = 'Info';
  tasklevel_completed: boolean = false;
  deleteSub: any;
  //@ViewChildren('myTestDiv') elements: QueryList<ElementRef> | undefined

  constructor(public CommonService: CommonService, private router: Router, private route: ActivatedRoute) {
    this.CommonService.showTabMenu = false; this.CommonService.loading = false;
  }
  // divi: number = -1;
  // openRespectiveModal() {

  //   this.elements?.forEach((d, i) => {

  //     if (this.divi == i) {
  //       let el: HTMLElement =  d.nativeElement;
  //     ////console.log(el);
  //       el.click();
  //     }
  //   });
  // }
  handleRefresh(event: any) {
    setTimeout(() => {
      this.getAgentList(true);
      event.target.complete();
    }, 2000);
  };
  ngOnInit() {
    this.selectedStatuses = [];
    this.route.params.subscribe(paramsId => {
      this.task_for = paramsId['task_for'];
      this.task_for_id_int = paramsId['task_for_id_int'];
      if (this.task_for == 'Account') {
        this.task_for_account_id_int = paramsId['task_for_id_int'];
        this.task_for_policy_account = 'Account';
        this.task_for = undefined;
        this.task_for_id_int = undefined;
      }
      if (this.task_for == 'Policy') {
        this.task_for_policy_id_int = paramsId['task_for_id_int'];
        this.task_for_policy_account = 'Policy';


        this.task_for = undefined;
        this.task_for_id_int = undefined;
      }

      if (this.CommonService.agentList) {
        this.getAgentInfo();
      } else {
        this.getAgentList();
      }

    });
  }
  getAgentList(refresher: boolean = false) {
    if (!refresher) {
      this.CommonService.loading = true;
    }

    this.getSubA = this.CommonService.getAgentList().subscribe((data: any) => {
      this.CommonService.loading = false;

      this.CommonService.agentList = data;

      this.getAgentInfo();
    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong" })
    });
  }
  agentDetailObj: any = { name: '' };
  ngAfterViewInit() {
    // ElementRef { nativeElement: <input> }

  }
  getAgentInfo() {

    this.CommonService.agentList.every((item: any) => {
      if (item.agent_id_int == this.task_for_id_int) {
        this.agentDetailObj = item;
        return false;
      }
      return true;
    });
    if (!this.CommonService.accountList || this.CommonService.accountList.length == 0) {
      this.getAccountList();
    } else {
      if (!this.CommonService.taskList || this.CommonService.taskList.length == 0) {
        this.getTaskList();
      } else {
        this.getFilteredTasksList(3);
      }
    }
  }
  getAccountList() {

    this.CommonService.loading = true;
    this.getSub = this.CommonService.getAccountList().subscribe((data: any) => {
      this.CommonService.loading = false;
      this.CommonService.accountList = data;
      if (!this.CommonService.taskList || this.CommonService.taskList.length == 0) {
        this.getTaskList();
      } else {
        this.getFilteredTasksList(1);
      }
    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong" })
    });
  }
  getTaskList() {
    this.CommonService.loading = true;
    this.getSub = this.CommonService.getTaskList().subscribe((data: any) => {
      this.CommonService.loading = false;
      this.CommonService.taskList = data;


      this.getFilteredTasksList(2);

    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong" })
    });
  }
  insertAccountDetailIntaskList(c: any) {
  ////console.log('000');
    this.CommonService.taskList.forEach((perTask: any) => {
      if (perTask.task_for == 'Agent') {
      ////console.log('999');

        if (perTask.account_id_int) {
        ////console.log('8888');

          perTask['account_title'] = this.CommonService.accountListArrByIdAsKey[perTask['account_id_int']] ? this.CommonService.accountListArrByIdAsKey[perTask['account_id_int']]['account_title'] : '';
          perTask.accountHardCopyDocArr = this.CommonService.accountListArrByIdAsKey[perTask['account_id_int']] ? this.CommonService.accountListArrByIdAsKey[perTask['account_id_int']]['hardCopyDocArr'] : [];
          perTask.selectedFoundAcc = false;
        ////console.log(perTask);
          let accountHardCopyDocArr: any[] = [];
          perTask.accountHardCopyDocArr.forEach((item: any) => {


            if (item.agent_id_int == perTask.task_for_id_int && item.task_id_int == perTask.task_id_int) {



              item.selected = true; perTask.selectedFoundAcc = true;

            ////console.log("match found", item.selected = true);
            ////console.log(item)

            } else {

              item.selected = false;
            } //console.log(item); //console.log('item');
            accountHardCopyDocArr.push({ ...item });

          }); //console.log(accountHardCopyDocArr); //console.log('accountHardCopyDocArr');
          perTask.accountHardCopyDocArr = accountHardCopyDocArr;

        ////console.log(perTask);
        } else {
          perTask.accountHardCopyDocArr = [];
          perTask.account_title = '';
        }
        if (perTask.policy_id_int) {
          perTask['policy_title'] = this.CommonService.accountListArrByIdAsKey[perTask.policy_id_int] ? this.CommonService.accountListArrByIdAsKey[perTask.policy_id_int]['account_title'] : '';
          perTask.policyHardCopyDocArr = this.CommonService.accountListArrByIdAsKey[perTask.policy_id_int] ? this.CommonService.accountListArrByIdAsKey[perTask.policy_id_int]['hardCopyDocArr'] : [];
          perTask.selectedFoundPolicy = false;

          let policyHardCopyDocArr: any[] = [];
          perTask.policyHardCopyDocArr.forEach((item2: any) => {

            if (item2.agent_id_int == perTask.task_for_id_int && item2.task_id_int == perTask.task_id_int) {

              item2.selected = true; perTask.selectedFoundPolicy = true;
            } else {

              item2.selected = false;
            } policyHardCopyDocArr.push({ ...item2 });

          });
          perTask.policyHardCopyDocArr = policyHardCopyDocArr;

        } else {
          perTask.policyHardCopyDocArr = [];
          perTask.policy_title = '';
        }
      } else {
        perTask.policyHardCopyDocArr = [];
        perTask.accountHardCopyDocArr = [];
        perTask.account_title = '';
        perTask.policy_title = '';
      }

    });
  }
  getFilteredTasksList(c: any) {

    this.insertAccountDetailIntaskList(c);
    this.filteredTasks = [];
    if (this.task_for && this.task_for_id_int) {
      this.CommonService.taskList.forEach((item: any) => {
        if (item.task_for == this.task_for && item.task_for_id_int == this.task_for_id_int) {
          this.filteredTasks.push(item);
        }

      });
    } else if (this.task_for && !this.task_for_id_int) {
      this.CommonService.taskList.forEach((item: any) => {
        if (item.task_for == this.task_for) {
          this.filteredTasks.push(item);

        }

      });
    } else if (this.task_for_policy_account == 'Account' && !this.task_for_account_id_int) {
      this.CommonService.taskList.forEach((item: any) => {
        if (item.account_id_int == this.task_for_account_id_int) {
          this.filteredTasks.push(item);

        }

      });
    } else if (this.task_for_policy_account == 'Policy' && !this.task_for_policy_id_int) {
      this.CommonService.taskList.forEach((item: any) => {
        if (item.policy_id_int == this.task_for_policy_id_int) {
          this.filteredTasks.push(item);

        }

      });
    } else {


      this.filteredTasks = this.CommonService.taskList;
    }
    this.filteredTasks.forEach((itemTask: any, i: any) => {
      this.CommonService.agentList.every((itemAgent: any) => {
        if (itemTask.task_for == 'Agent' && itemAgent.agent_id_int == itemTask.task_for_id_int) {
          this.filteredTasks[i]['agentname'] = itemAgent['name'];
          this.filteredTasks[i]['agentmobile'] = itemAgent['mobile'];

          return false;
        }
        return true;
      });
    });
    this.makelstforuifiltered();
  }
  updateSelectedArr() {
    this.selectedStatuses = [];
    if (this.tasklevel_pending) {
      this.selectedStatuses.push('Pending');
    } if (this.tasklevel_inprogress) {
      this.selectedStatuses.push('Inprogress');
    } if (this.tasklevel_completed) {
      this.selectedStatuses.push('Completed');
    }

    this.makelstforuifiltered();
  }
  makelstforuifiltered() {
    this.filteredTasks2 = [];
    this.filteredTasks.forEach((itemTask: any) => {
      if (this.selectedStatuses.length > 0) {
        if (this.selectedStatuses.includes(itemTask.tasklevel)) {
          this.filteredTasks2.push({ ...itemTask });
        }
      } else {
        this.filteredTasks2.push({ ...itemTask });
      }


    });
  }
  routeToAddTasks() {
    if (this.task_for && this.task_for_id_int) {
      this.router.navigate(['addtasks/' + this.task_for + '/' + this.task_for_id_int]);

    } else if (this.task_for && !this.task_for_id_int) {

      this.router.navigate(['addtasks/' + this.task_for + '/0']);

    } else {
      this.router.navigate(['addtasks/none/0']);
    }
  }
  routeToEditTasks(task_id_int: number) {
    if (this.task_for && this.task_for_id_int) {
      this.router.navigate(['addtasks/' + this.task_for + '/' + this.task_for_id_int + '/' + task_id_int]);

    } else if (this.task_for && !this.task_for_id_int) {

      this.router.navigate(['addtasks/' + this.task_for + '/0' + '/' + task_id_int]);

    } else {
      this.router.navigate(['addtasks/none/0' + '/' + task_id_int]);
    }
  }
  routeBack() {
    if (this.task_for && this.task_for_id_int) {
      this.CommonService.showTabMenu = false
      if (this.task_for == 'Agent') {
        this.router.navigate(['tabs/agents/agentdetail/Agent/' + this.task_for_id_int]);
      }
      if (this.task_for == 'My') {
        alert('to do')
        this.router.navigate(['tabs/home']);
      }

    } else if (this.task_for && !this.task_for_id_int) {
      this.CommonService.showTabMenu = false
      alert('to do 2');
      this.router.navigate(['tabs/home']);

    } else {
      this.CommonService.showTabMenu = true;
      this.router.navigate(['tabs/home']);
    }
  }
  ngOnDestroy() {
    if (this.getSub) {
      this.getSub.unsubscribe();
    } if (this.deleteSub) {
      this.deleteSub.unsubscribe();
    } if (this.changeStatusOfTaskSub) {
      this.changeStatusOfTaskSub.unsubscribe();
    } if (this.deleteFileDataSub) {
      this.deleteFileDataSub.unsubscribe();
    } if (this.saveDataSub) {
      this.saveDataSub.unsubscribe();
    }
  }
  editTask(task_id_int: Number) {
    this.CommonService.taskLastPage = 'List';
    this.router.navigate(['tasks/taskedit/' + task_id_int]);


    if (this.task_for && this.task_for_id_int) {

      this.router.navigate(['taskedit/' + this.task_for + '/' + this.task_for_id_int + '/' + task_id_int]);

    } else if (this.task_for && !this.task_for_id_int) {
      this.router.navigate(['taskedit/' + this.task_for + '/0/' + task_id_int]);


    } else {
      this.router.navigate(['taskedit/none/0/' + task_id_int]);

    }


  }
  viewDoc(filedetails: any) {
    window.open(filedetails.serverpath + filedetails.filepath, "_blank");
  }

  deleteTask(task_id_int: Number) {
    if (confirm("Are you sure you want to delete this data ?")) {
      this.CommonService.loading = true;
      this.deleteSub = this.CommonService.deleteTask(task_id_int).subscribe((data: any) => {
        this.CommonService.loading = false;
        if (data.status) {

          this.CommonService.taskList = data.TaskList;
          this.getFilteredTasksList(4);
          this.CommonService.message({ 'message': data.message, color: 'success' })
        } else {
          this.CommonService.message({ 'message': data.message, color: 'danger' })
        }
      }, (err: any) => {
        this.CommonService.loading = false;
        this.CommonService.message({ 'message': "Something is wrong" })
      });
    }
  }
  policyHardCopyDocArrTemp:any = []; accountHardCopyDocArrTemp:any = [];
  changeStatusOfTask(taskfordetailobj: any) {
    if (this.CommonService.loading) {
      this.CommonService.message({ 'message': "Wait for previous process ", color: 'warning' });
    } else {
      if (taskfordetailobj.tasklevel == 'Pending' && !taskfordetailobj.inprogress_date) {
        this.CommonService.message({ 'message': "Fill Date Field  !", color: 'warning' });

      } else if (taskfordetailobj.tasklevel == 'Inprogress' && !taskfordetailobj.complete_date) {
        this.CommonService.message({ 'message': "Fill Date Field  !", color: 'warning' });
      }
      else {
        if (taskfordetailobj.tasklevel == 'Pending') {
          taskfordetailobj.tasklevel = 'Inprogress';
        } else if (taskfordetailobj.tasklevel == 'Inprogress') {
          taskfordetailobj.tasklevel = 'Completed';
        }
        this.CommonService.loading = true;
        
        this.accountHardCopyDocArrTemp =[]; this.policyHardCopyDocArrTemp=[];
        if (taskfordetailobj.account_id_int) {
           
          taskfordetailobj.accountHardCopyDocArr.forEach((item: any) => {
            this.accountHardCopyDocArrTemp.push({...item});
            if (taskfordetailobj.tasklevel == 'Completed') {
              if (item.selected) {
                item.agent_id_int = '';
                item.task_id_int = '';
              }
            }
            delete item.selected;

          });
        } else {
          taskfordetailobj.accountHardCopyDocArr = []; 
        }

        if (taskfordetailobj.policy_id_int) {
         
          taskfordetailobj.policyHardCopyDocArr.forEach((item: any) => {
            this.policyHardCopyDocArrTemp.push({...item});   if (taskfordetailobj.tasklevel == 'Completed') {
              if (item.selected) {
                item.agent_id_int = '';
                item.task_id_int = '';
              }
            }


            delete item.selected;

          });
        } else {
          taskfordetailobj.policyHardCopyDocArr = [];
           
        }




        this.changeStatusOfTaskSub = this.CommonService.saveDataOfTask(taskfordetailobj).subscribe((data: any) => {


          if (data.status) {
            taskfordetailobj.policyHardCopyDocArr = this.policyHardCopyDocArrTemp;
            taskfordetailobj.accountHardCopyDocArr = this.accountHardCopyDocArrTemp;
            this.CommonService.taskList = data.TaskList;

            //  this.getFilteredTasksList(5);
            this.CommonService.message({ 'message': data.message, color: 'success' })

          } else {
            this.CommonService.message({ 'message': data.message, color: 'danger' })
          }
          this.CommonService.loading = false;

        }, (err: any) => {
          this.CommonService.loading = false;
          this.CommonService.message({ 'message': "Something is wrong", color: 'danger' })
        });
      }
    }
  }

  //image upload
  hiddenModalImage: boolean = false;
  updateImageInfoFun(udatedmoduleInfo: any, taskDetailObj: any) {
    udatedmoduleInfo.imagePathArr.forEach((element: any) => {
      taskDetailObj['imageArr'].push({ ...element });
    });

    this.saveDataOfTask(taskDetailObj);
  }

  deleteFile(filedetail: any, i: number, taskDetailObj: any) {


    this.deleteFileDataSub = this.CommonService.deleteFile(filedetail.filepath).subscribe((data: any) => {

      if (data.status) {
        let t: any = [];
        taskDetailObj.imageArr.forEach((item: any) => {
          if (item.filepath != filedetail.filepath) {
            t.push({ ...item });
          }
        });
        taskDetailObj.imageArr = t;
        this.saveDataOfTask(taskDetailObj);
      } else {
        this.CommonService.message({ 'message': data.message, color: 'danger' })
      }

    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong", color: 'danger' })
    });
  }

  saveDataOfTask(taskDetailObj: any) {
    this.CommonService.loading = true;

    this.saveDataSub = this.CommonService.saveDataOfTask(taskDetailObj).subscribe((data: any) => {
      this.CommonService.loading = false;

      if (data.status) {
        this.CommonService.taskList = data.TaskList;
      } else {
        this.CommonService.message({ 'message': data.message, color: 'danger' })
      }

    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong", color: 'danger' })
    });

  }
}
