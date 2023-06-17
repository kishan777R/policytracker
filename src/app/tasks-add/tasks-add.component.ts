


import { Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import { CommonService } from '../common.service';
import { Router, ActivatedRoute } from '@angular/router';

import { ModalController } from '@ionic/angular';
import { AgentAddPage } from '../agent/agent-add.page';
import { AccountsAddPage } from '../accounts/account-add.page';

@Component({
  selector: 'app-tasks-add',
  templateUrl: './tasks-add.component.html',
  styleUrls: ['./tasks-add.component.scss'],
})
export class TasksAddComponent implements OnInit {

  task_id_int: any = undefined;
  task_for: any;
  task_for_id_int: any; getSubTask: any;
  getSub: any; getSubA: any; deleteFileDataSub: any; saveDataSub: any;
  taskDetailObj: any = {
    'taskname': '', 'expected_end_date': '', 'inprogress_date': '', 'complete_date': '',
    'inprogress_remark': '', 'complete_remark': '',
    'tasklevel': 'Pending', 'start_date': '', 'taskdetail': '', "taskpriority": '',
    'task_for': '', 'task_id_int': 0, 'task_for_id_int': 0, imageArr: []
  };

  currentSegment: any = 'detail';
  moduleInfo: any = { "apipath": "apipolicy/uploadfileoftask", 'linebelowBrowsefile': 'Upload task related documents !', 'module': 'Task', "showPreview": false, "browseimagepath": 'assets/browsefile.png', 'multipleAllowed': true, "filetype": 'Any' };
  constructor(private modalCtrl: ModalController, public CommonService: CommonService, private router: Router, private route: ActivatedRoute) {
    this.CommonService.showTabMenu = false; this.CommonService.loading = false;
  }
  ngOnInit() {
    this.route.params.subscribe(paramsId => {
      this.task_id_int = paramsId['task_id_int'];
      this.task_for = paramsId['task_for'];
      this.task_for_id_int = paramsId['task_for_id_int'];

      if (this.task_for && this.task_for != 'none') {
        this.taskDetailObj['task_for'] = this.task_for;
      }
      if (this.task_for_id_int && this.task_for_id_int != 0) {
        this.taskDetailObj['task_for_id_int'] = this.task_for_id_int;      
          

      }


      if (this.CommonService.agentList) {
        this.JustagentList = this.CommonService.agentList.filter((item: any) => {
          return item.working_for_user_or_agent == 'Agent'
        });

        this.getAgentInfo();
      } else {
        this.getAgentList();
      }


    });

  }
  viewDoc(filedetails: any) {
    window.open(filedetails.serverpath + filedetails.filepath, "_blank");
  }
  checkifinfoexiss() {
    if (this.CommonService.agentList) {

    } else {
      this.getAgentList();
    }
  }
  segmentChange(events: any) {
    this.currentSegment = events.detail.value;
  }
  JustagentList: any = [];
  getAgentList() {
    this.CommonService.loading = true;
    this.getSubA = this.CommonService.getAgentList().subscribe((data: any) => {
      this.CommonService.loading = false;

      this.CommonService.agentList = data;
      this.JustagentList = this.CommonService.agentList.filter((item: any) => {
        return item.working_for_user_or_agent == 'Agent'
      });


      this.getAgentInfo();
    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong" })
    });
  }
  agentDetailObj: any = { name: '' };

  getAgentInfo() {

    this.CommonService.agentList.every((item: any) => {
      if (item.agent_id_int == this.task_for_id_int) {
        this.agentDetailObj = item;

        return false;
      }
      return true;
    });



    if (this.CommonService.taskList) {
      if (this.task_id_int) { this.taskDetailObj['task_id_int'] = this.task_id_int; this.getTaskInfo(); }
    } else {
      this.getTaskList();
    }




  }
  getTaskList() {
    this.CommonService.loading = true;
    this.getSubTask = this.CommonService.getTaskList().subscribe((data: any) => {
      this.CommonService.loading = false;
      this.CommonService.taskList = data;
      this.getTaskInfo();

    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong" })
    });
  }

  getTaskInfo() {

    this.CommonService.taskList.every((item: any) => {
      if (item.task_id_int == this.task_id_int) {
        this.taskDetailObj = item;this.taskDetailObj['tasklevel'] = 'Pending';
        this.updateDropDownValuesForSelectAccountHolderAndAgent();
        return false;
      }
      return true;
    });

    if (this.CommonService.accountList) {
      this.updateDropDownValuesForSelectAccount(); this.updateDropDownValuesForSelectPolicy();
    } else {
      this.getAccountList();
    }
  }
  getAccountList() {

    this.CommonService.loading = true;
    this.getSub = this.CommonService.getAccountList().subscribe((data: any) => {
      this.CommonService.loading = false;

      this.CommonService.accountList = data;
      this.updateDropDownValuesForSelectAccount(); this.updateDropDownValuesForSelectPolicy();
    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong" })
    });
  }
  policyHardCopyDocArr: any = [];
  accountHardCopyDocArr: any = [];

  updateDropDownValuesForSelectPolicy() {



    if (this.taskDetailObj['policy_id_int'] && this.CommonService.accountListArrByIdAsKey[this.taskDetailObj['policy_id_int']]) {
      this.taskDetailObj['policy_title'] = this.CommonService.accountListArrByIdAsKey[this.taskDetailObj['policy_id_int']]['account_title'];
      this.policyHardCopyDocArr = this.CommonService.accountListArrByIdAsKey[this.taskDetailObj['policy_id_int']]['hardCopyDocArr'];

      this.manageSelectedhardTocInTasK('Policy');
    } else {
      this.taskDetailObj['policy_title'] = '';
      this.policyHardCopyDocArr = [];
    }
  }
  updateDropDownValuesForSelectAccount() {
    if (this.taskDetailObj['account_id_int'] &&  this.CommonService.accountListArrByIdAsKey[this.taskDetailObj['account_id_int']]) {
      this.taskDetailObj['account_title'] = this.CommonService.accountListArrByIdAsKey[this.taskDetailObj['account_id_int']]['account_title'];
      this.accountHardCopyDocArr = this.CommonService.accountListArrByIdAsKey[this.taskDetailObj['account_id_int']]['hardCopyDocArr'];

      this.manageSelectedhardTocInTasK('Account');
    } else {
      this.taskDetailObj['account_title'] = '';
      this.accountHardCopyDocArr = [];
    }


  }
  updateHardDocOfPolicyAndAccountWhenMytaskIsSelected() {
    this.policyHardCopyDocArr.forEach((item: any) => {
      if (this.taskDetailObj.task_for == 'My') {
        if (item.available) {
          item.selected = false;

          item.agent_id_int = '';
          item.task_id_int = '';
        }
      }
    });
    this.accountHardCopyDocArr.forEach((item: any) => {
      if (this.taskDetailObj.task_for == 'My') {
        if (item.available) {
          item.selected = false;
          item.agent_id_int = '';
          item.task_id_int = '';
        }
      }
    });
  }
  manageSelectedhardTocInTasK(what: any) {
    if (what == 'Policy') {
      this.policyHardCopyDocArr.forEach((item: any) => {

        if (item.agent_id_int == '') {
          item.available = true;
          item.selected = false;
        } else {
          if (this.taskDetailObj.task_id_int && item.agent_id_int == this.taskDetailObj.task_for_id_int && item.task_id_int == this.taskDetailObj.task_id_int) {
            item.available = true;
            item.selected = true;
          } else if (!this.taskDetailObj.task_id_int && item.agent_id_int && item.task_id_int) {
            item.available = false;
            item.selected = false;
            item.task_name = this.CommonService.taskListArrByIdAsKey[item.task_id_int] ? this.CommonService.taskListArrByIdAsKey[item.task_id_int]['taskname'] :'';
            item.agent_name =this.CommonService.agentListArrByIdAsKey[item.agent_id_int] ? this.CommonService.agentListArrByIdAsKey[item.agent_id_int]['name'] : '';
          } else {
            item.available = false;
            item.selected = false;
            item.task_name = this.CommonService.taskListArrByIdAsKey[item.task_id_int] ? this.CommonService.taskListArrByIdAsKey[item.task_id_int]['taskname'] :'';
            item.agent_name =this.CommonService.agentListArrByIdAsKey[item.agent_id_int] ? this.CommonService.agentListArrByIdAsKey[item.agent_id_int]['name'] : '';
        }
        }
      });
    } else {

      this.accountHardCopyDocArr.forEach((item: any) => {
        if (item.agent_id_int == '') {
          item.available = true;
          item.selected = false;
        } else {
          if (this.taskDetailObj.task_id_int && item.agent_id_int == this.taskDetailObj.task_for_id_int && item.task_id_int == this.taskDetailObj.task_id_int) {
            item.available = true;
            item.selected = true;
          } else if (!this.taskDetailObj.task_id_int && item.agent_id_int && item.task_id_int) {
            item.available = false;
            item.selected = false; 
            item.task_name =this.CommonService.taskListArrByIdAsKey[item.task_id_int] ?  this.CommonService.taskListArrByIdAsKey[item.task_id_int]['taskname'] : '';
            item.agent_name = this.CommonService.agentListArrByIdAsKey[item.agent_id_int] ? this.CommonService.agentListArrByIdAsKey[item.agent_id_int]['name'] : '';
          } else {
            item.available = false;
            item.selected = false;
            item.task_name =this.CommonService.taskListArrByIdAsKey[item.task_id_int] ?  this.CommonService.taskListArrByIdAsKey[item.task_id_int]['taskname'] : '';
            item.agent_name = this.CommonService.agentListArrByIdAsKey[item.agent_id_int] ? this.CommonService.agentListArrByIdAsKey[item.agent_id_int]['name'] : '';
         }
        }
      });
    }
 

  }
  async addAccountPolicy(AccountOrPolicy: any) {
    this.CommonService.openAccountOrPolicyModalFor = AccountOrPolicy;
    const modal = await this.modalCtrl.create({
      component: AccountsAddPage,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    this.CommonService.agentList.forEach((perAgentUser: any) => {
      this.CommonService.agentListArrByIdAsKey[perAgentUser.agent_id_int] = perAgentUser;
    });
    this.JustagentList = this.CommonService.agentList.filter((item: any) => {
      return item.working_for_user_or_agent == 'Agent'
    });
  }
  async adduser(UserOrAgent: any) {
    this.CommonService.openAgentModalFor = UserOrAgent;
    const modal = await this.modalCtrl.create({
      component: AgentAddPage,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    this.CommonService.agentList.forEach((perAgentUser: any) => {
      this.CommonService.agentListArrByIdAsKey[perAgentUser.agent_id_int] = perAgentUser;
    });
    this.JustagentList = this.CommonService.agentList.filter((item: any) => {
      return item.working_for_user_or_agent == 'Agent'
    });
  }
  updateImageInfoFun(udatedmoduleInfo: any) {
    udatedmoduleInfo.imagePathArr.forEach((element: any) => {
      this.taskDetailObj['imageArr'].push({ ...element });

    });
  }


  updateDropDownValuesForSelectAccountHolderAndAgent() {
   
    if (this.taskDetailObj['task_for_id_int'] && this.CommonService.agentListArrByIdAsKey[this.taskDetailObj['task_for_id_int']]) {
      this.taskDetailObj['agent_name'] = this.CommonService.agentListArrByIdAsKey[this.taskDetailObj['task_for_id_int']]['name'];
    } else {
      this.taskDetailObj['agent_name'] = '';
    }


  }
  deleteFile(filedetail: any, i: number) {
    this.CommonService.loading = true;

    this.deleteFileDataSub = this.CommonService.deleteFile(filedetail.filepath).subscribe((data: any) => {
      this.CommonService.loading = false;

      if (data.status) {
        let t: any = [];
        this.taskDetailObj.imageArr.forEach((item: any) => {
          if (item.filepath != filedetail.filepath) {
            t.push({ ...item });
          }
        });
        this.taskDetailObj.imageArr = t;
      } else {
        this.CommonService.message({ 'message': data.message, color: 'danger' })
      }

    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong", color: 'danger' })
    });
  }

  saveDataOfTask() {
    if (this.taskDetailObj.task_for == "My") {
      this.taskDetailObj.task_for_id_int = this.CommonService.customerinfo.customer_id_int;
    }
    if (!this.taskDetailObj.start_date || !this.taskDetailObj.expected_end_date || !this.taskDetailObj.task_for_id_int || !this.taskDetailObj.taskpriority || !this.taskDetailObj.taskname || !this.taskDetailObj.taskdetail || !this.taskDetailObj.task_for) {
      this.CommonService.message({ 'message': "Fill Required Fields !", color: 'warning' });

    } else {
      if (!this.taskDetailObj.tasklevel || this.taskDetailObj.tasklevel == '' || this.taskDetailObj.tasklevel == 'High' || this.taskDetailObj.tasklevel == 'Medium' || this.taskDetailObj.tasklevel == 'Low') {
        this.taskDetailObj.tasklevel = 'Pending';
      }
      this.CommonService.loading = true;
      if (this.taskDetailObj.account_id_int) {
        this.accountHardCopyDocArr.forEach((item: any) => {
          if (item.available) {
            if (item.selected) {
              item.agent_id_int = this.taskDetailObj.task_for_id_int;
              item.task_id_int = this.taskDetailObj.task_id_int;
            }else{
              item.task_id_int =  item.agent_id_int ='';
            }
          }
          delete item.selected;
          delete item.available;
        });
      } else {
        this.accountHardCopyDocArr = [];
      }

      if (this.taskDetailObj.policy_id_int) {
        this.policyHardCopyDocArr.forEach((item: any) => {
          if (item.available) {
            if (item.selected) {
              item.agent_id_int = this.taskDetailObj.task_for_id_int;
              item.task_id_int = this.taskDetailObj.task_id_int;
            }else{
              item.task_id_int =  item.agent_id_int ='';
            }
          }
          delete item.selected;
          delete item.available;
        });
      } else {
        this.policyHardCopyDocArr = [];
      }




      this.taskDetailObj['policyHardCopyDocArr'] = this.policyHardCopyDocArr;
      this.taskDetailObj['accountHardCopyDocArr'] = this.accountHardCopyDocArr;

      this.saveDataSub = this.CommonService.saveDataOfTask(this.taskDetailObj).subscribe((data: any) => {
        this.CommonService.loading = false;

        if (data.status) {
          this.CommonService.taskList = data.TaskList;
          this.CommonService.accountList= undefined;
          this.CommonService.message({ 'message': data.message, color: 'success' })


          this.routeBack();

        } else {
          this.CommonService.message({ 'message': data.message, color: 'danger' })
        }

      }, (err: any) => {
        this.CommonService.loading = false;
        this.CommonService.message({ 'message': "Something is wrong", color: 'danger' })
      });
    }
  }
  routeBack() {
    if (this.task_for && this.task_for != 'none') {
      if (this.task_for_id_int && this.task_for_id_int != 0) {

        this.router.navigate(['../../../tasks/' + this.task_for + '/' + this.task_for_id_int]);

      } else {
        this.router.navigate(['../../../tasks/' + this.task_for]);
      }
    } else {
      this.router.navigate(['../../../tasks']);
    }


  }
  ngOnDestroy() {
    if (this.saveDataSub) {
      this.saveDataSub.unsubscribe();
    } if (this.getSub) {
      this.getSub.unsubscribe();
    } if (this.getSubA) {
      this.getSubA.unsubscribe();
    } if (this.getSubTask) {
      this.getSubTask.unsubscribe();
    } if (this.deleteFileDataSub) {
      this.deleteFileDataSub.unsubscribe();
    }

  }


}
