import { Component, ElementRef, ViewChild, } from '@angular/core';
import { CommonService } from '../common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-account-detail',
  templateUrl: 'account-detail.page.html',
  styleUrls: ['account-detail.page.scss']
})
export class AccountsDetailPage {

  public actionSheetButtons: any;
  getSub: any;
  showingListFor: any = undefined;
  deleteSub: any;
  idOfthePersonForWhomListIs: any = undefined;
  agent_or_user: any = { name: '' };
  getSubA: any;
  account_id_int: any = undefined; getSubTask: any;
  accountDetailObj: any = undefined;
  tileList: any = undefined;
  moduleInfoList: any = { "apipath": "apipolicy/uploadAccountfiles", 'linebelowBrowsefile': 'Upload related documents !', 'module': 'Account', "showPreview": false, "browseimagepath": 'assets/browsefile.png', 'multipleAllowed': true, "filetype": 'Any' };
  account_or_policy: any;
  headingP = 'Account';
  heading = 'Accounts';
  constructor(private actionSheetCtrl: ActionSheetController, public CommonService: CommonService, private router: Router, private route: ActivatedRoute) {
    this.CommonService.showTabMenu = false; this.CommonService.loading = false;
    this.CommonService.whencomebacktoAccountListAfterSaveDoNeedToSendToDetails_variable_is_with_account_id = -1;

  }
  ngOnInit() {
    this.CommonService.whencomebacktoAccountListAfterSaveDoNeedToSendToDetails_variable_is_with_account_id = -1;
    this.route.params.subscribe(paramsId => {

      this.account_id_int = paramsId['account_id_int'];
      this.showingListFor = paramsId['showingListFor'];
      this.idOfthePersonForWhomListIs = paramsId['idOfthePersonForWhomListIs'];
      this.account_or_policy = paramsId['account_or_policy'];
      this.CommonService.account_or_policy = paramsId['account_or_policy'];
      if (this.account_or_policy == 'Policy') {
        this.heading = 'Policies'; this.headingP = 'Policy'; this.tileList = this.CommonService.polcyTileList;

      } else {
        this.heading = 'Accounts'; this.headingP = 'Account'; this.tileList = this.CommonService.accountTileList;

      }


      if (this.CommonService.iwanttoshowPolicyUnderAccButNotBasedOnURL == -1) {
        if (this.account_or_policy == 'Policy') {
          this.heading = 'Policies'; this.headingP = 'Policy'; this.tileList = this.CommonService.polcyTileList;

        } else {
          this.heading = 'Accounts'; this.headingP = 'Account'; this.tileList = this.CommonService.accountTileList;

        }
      } else {
        this.heading = 'Policies'; this.headingP = 'Policy'; this.tileList = this.CommonService.polcyTileList;
      }


      if (this.CommonService.taskList) {
        if (this.CommonService.agentList) {
          this.getAgentInfo();
        } else {
          this.getAgentList();
        }
      } else {
        this.getTaskList();
      }

    });




    this.CommonService.accountLastPage = 'Detail';

  }
  ionViewWillEnter() {
    this.CommonService.whencomebacktoAccountListAfterSaveDoNeedToSendToDetails_variable_is_with_account_id = -1;
    this.CommonService.accountLastPage = 'Detail';

  }

  getTaskList() {
    this.CommonService.loading = true;
    this.getSubTask = this.CommonService.getTaskList().subscribe((data: any) => {
      this.CommonService.loading = false;
      this.CommonService.taskList = data;
      if (this.CommonService.agentList) {
        this.getAgentInfo();
      } else {
        this.getAgentList();
      }

    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong" })
    });
  }
  getAgentList() {
    this.CommonService.loading = true;
    this.getSubA = this.CommonService.getAgentList().subscribe((data: any) => {

      this.CommonService.agentList = data;
      this.getAgentInfo();
    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong" })
    });
  }

  getAgentInfo() {
    this.CommonService.agentList.forEach((item: any) => {
      this.CommonService.agentListArrByIdAsKey[item.agent_id_int] = item;
    });
    this.agent_or_user = this.CommonService.agentListArrByIdAsKey[this.idOfthePersonForWhomListIs] || { name: '' };
    if (!this.CommonService.accountList || this.CommonService.accountList.length == 0) {
      this.getAccountList();
    }
    else {
      this.getAccountInfo();
      this.CommonService.filterAccountListAccodingtoUserOrAgent(this.showingListFor, this.idOfthePersonForWhomListIs);
    }
  }

  getAccountList() {

    this.CommonService.loading = true;
    this.getSub = this.CommonService.getAccountList().subscribe((data: any) => {
      this.CommonService.loading = false;
      this.CommonService.accountList = data;
      this.CommonService.filterAccountListAccodingtoUserOrAgent(this.showingListFor, this.idOfthePersonForWhomListIs);
      this.getAccountInfo();
    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong" })
    });
  }
  getAccountInfo() {

    this.CommonService.accountList.every((item: any) => {
      if (item.account_id_int == this.account_id_int) {
        this.accountDetailObj = item;
        this.accountDetailObj.parent_account_title = this.accountDetailObj.parent_account_number = '';
        if (this.accountDetailObj.account_or_policy == 'Policy') {
          if (this.accountDetailObj.parent_account_id_int && this.CommonService.accountListArrByIdAsKey[this.accountDetailObj.parent_account_id_int]) {
            this.accountDetailObj.parent_account_title = this.CommonService.accountListArrByIdAsKey[this.accountDetailObj.parent_account_id_int]['account_title'];
            this.accountDetailObj.parent_account_number = this.CommonService.accountListArrByIdAsKey[this.accountDetailObj.parent_account_id_int]['account_number'];
          }
        }


        this.assignNomineeName();
        this.updateDropDownValuesForSelectAccountHolderAndAgent();
        this.CommonService.loading = false;
        if (this.accountDetailObj.hardCopyDocArr.length == 0) {
          this.showHardDocsform = true;
        } else {
          this.accountDetailObj.hardCopyDocArr.forEach((item: any) => {

            item.task_name = this.CommonService.taskListArrByIdAsKey[item.task_id_int] ? this.CommonService.taskListArrByIdAsKey[item.task_id_int]['taskname'] : '';
            item.agent_name = this.CommonService.agentListArrByIdAsKey[item.agent_id_int] ? this.CommonService.agentListArrByIdAsKey[item.agent_id_int]['name'] : '';


          });


          this.showHardDocsform = false;
        }
        return false;
      }
      return true;
    });

  }
  assignNomineeName() {
    this.accountDetailObj.nomineeArr.forEach((perNomnee: any) => {
      perNomnee['nominee_name'] = this.CommonService.agentListArrByIdAsKey[perNomnee.nominee_id] ? this.CommonService.agentListArrByIdAsKey[perNomnee.nominee_id]['name'] : '';
    });
  }
  updateDropDownValuesForSelectAccountHolderAndAgent() {

    if (this.accountDetailObj['user_id_int'] && this.CommonService.agentListArrByIdAsKey[this.accountDetailObj['user_id_int']]) {
      this.accountDetailObj['account_holder_name'] = this.CommonService.agentListArrByIdAsKey[this.accountDetailObj['user_id_int']]['name'];
    } else {
      this.accountDetailObj['account_holder_name'] = '';
    }
    if (this.accountDetailObj['agent_id_int'] && this.CommonService.agentListArrByIdAsKey[this.accountDetailObj['agent_id_int']]) {
      this.accountDetailObj['agent_name'] = this.CommonService.agentListArrByIdAsKey[this.accountDetailObj['agent_id_int']]['name'];
    } else {
      this.accountDetailObj['agent_name'] = '';
    }
  }
  ngOnDestroy() {
    if (this.getSub) {
      this.getSub.unsubscribe();
    } if (this.deleteSub) {
      this.deleteSub.unsubscribe();
    } if (this.getSubA) {
      this.getSubA.unsubscribe();
    } if (this.getSubTask) {
      this.getSubTask.unsubscribe();
    }
  }
  editAccount(account_id_int: Number) {
    this.CommonService.accountLastPage = 'Detail';

    this.router.navigate(['tabs/accounts/accountsedit/' + this.account_or_policy + '/' + this.showingListFor + '/' + this.idOfthePersonForWhomListIs + '/' + account_id_int]);
  }
  viewDoc(filedetails: any) {
    window.open(filedetails.serverpath + filedetails.filepath, "_blank");
  }
  deleteAccount(account_id_int: Number, extraaction: string) {

    let text = "Are you sure you want to delete this account ?";

    if (this.account_or_policy == 'Policy') {
      text = "Are you sure you want to delete this Policy ?";


    }

    if (confirm(text)) {
      this.CommonService.loading = true;
      this.deleteSub = this.CommonService.deleteAccount(account_id_int, extraaction).subscribe((data: any) => {
        this.CommonService.loading = false;
        if (data.status) {

          this.CommonService.accountList = data.AccountList;
          this.CommonService.filterAccountListAccodingtoUserOrAgent(this.showingListFor, this.idOfthePersonForWhomListIs);

          this.CommonService.policyList = undefined;
          this.CommonService.taskList = undefined;

          this.router.navigate(['tabs/accounts/' + this.account_or_policy + '/' + this.showingListFor + '/' + this.idOfthePersonForWhomListIs]);

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
  async deleteAccountActionSheet(account_id_int: Number) {

    let text1 = 'Keep policies and tasks under this account but without account detail  !';
    let headertext = "Please confirm following points before deleting " + this.account_or_policy + " !";
    let text2 = 'Delete policies and tasks  as well under this account ! ';

    if (this.account_or_policy == 'Policy') {
      text1 = 'Keep tasks under this Policy but without Policy detail  !';
      text2 = 'Delete tasks  as well under this Policy ! ';

    }
    this.actionSheetButtons = [
      {
        text: text1,
        handler: () => {
          this.deleteAccount(account_id_int, 'justdeleteaccount');
        },
        data: {
          action: 'delete',
        },
      },
      {
        text: text2,
        handler: () => {
          this.deleteAccount(account_id_int, 'deletePoliciesTasksForAccount');
        },
        data: {
          action: 'delete',
        },
      },
      {
        text: 'Cancel',
        role: 'cancel',
        data: {
          action: 'cancel',
        },
      },
    ];


    const actionSheet = await this.actionSheetCtrl.create({
      header: headertext,
      buttons: this.actionSheetButtons,
    });

    await actionSheet.present();
  }

  performAtion(perCol: any) {
    if (perCol.link != '') {
      this.router.navigate([perCol.link]);
    } else {
      if (perCol.functionName != '') {
        if (perCol.functionName == 'redirectToPoliciesUnderThisAccount') {
          this.redirectToPoliciesUnderThisAccount();
        }
      }
    }

  }
  redirectToPoliciesUnderThisAccount() {
    this.CommonService.iwanttoshowPolicyUnderAccButNotBasedOnURL = this.accountDetailObj.account_id_int;
    this.router.navigate(['tabs/accounts/' + this.account_or_policy + '/' + this.showingListFor + '/' + this.idOfthePersonForWhomListIs]);

  }
  whattypeofdocadding: any = 'hard';
  deleteNominee(index: number) {
    if (confirm('Are you sure you want to delete this Nominee ?')) {

      this.accountDetailObj.nomineeArr.splice(this.accountDetailObj.nomineeArr.length - 1 - index, 1);
      this.saveDataOfAccount(this.accountDetailObj);

    }
  }

  updateImageInfoFunList(udatedmoduleInfo: any) {
    udatedmoduleInfo.imagePathArr.forEach((element: any) => {
      this.accountDetailObj['imageArr'].push({ ...element });
    });

    this.saveDataOfAccount(this.accountDetailObj);
  }
  saveDataSub: any; deleteFileDataSub: any;
  saveDataOfAccount(accountDetailObj: any) {
    this.CommonService.loading = true;
    this.saveDataSub = this.CommonService.saveDataOfAccount(accountDetailObj).subscribe((data: any) => {
      this.CommonService.loading = false;

      if (data.status) {
        this.CommonService.accountList = data.AccountList;
        this.CommonService.filterAccountListAccodingtoUserOrAgent(this.showingListFor, this.idOfthePersonForWhomListIs);
      } else {
        this.CommonService.message({ 'message': data.message, color: 'danger' })
      }

    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong", color: 'danger' })
    });

  }


  deleteFile(filedetail: any, i: number) {

    this.deleteFileDataSub = this.CommonService.deleteFile(filedetail.filepath).subscribe((data: any) => {

      if (data.status) {
        let t: any = [];
        this.accountDetailObj.imageArr.forEach((item: any) => {
          if (item.filepath != filedetail.filepath) {
            t.push({ ...item });
          }
        });
        this.accountDetailObj.imageArr = t;
        this.saveDataOfAccount(this.accountDetailObj);
      } else {
        this.CommonService.message({ 'message': data.message, color: 'danger' })
      }

    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong", color: 'danger' })
    });
  }
  hardCopyDetailObj: any = { 'document_name': '', 'agent_id_int': '', 'task_id_int': "" };

  showHardDocsform = true;
  addHardCopiesDoc() {
    if (this.hardCopyDetailObj.document_name == '') {
      this.CommonService.message({ 'message': "If you want to add nominee details then you need to fill all required fields !", color: 'warning' })
    } else {
      let newArray = this.accountDetailObj.hardCopyDocArr.filter((item: any) => {
        return item.document_name == this.hardCopyDetailObj.document_name;
      });

      if (newArray.length > 0) {
        this.CommonService.message({ 'message': "Document name already exists !", color: 'warning' })
      }
      else {
        this.accountDetailObj.hardCopyDocArr.push({
          ...this.hardCopyDetailObj
        });
        this.saveDataOfAccount(this.accountDetailObj);

        this.hardCopyDetailObj = { 'document_name': '', 'agent_id_int': '', 'task_id_int': "" };
        if (this.accountDetailObj.hardCopyDocArr.length == 0) {
          this.showHardDocsform = true;
        } else {
          this.showHardDocsform = false;
        }
      }
    }

  }
  deleteHardCopiesDoc(index: number) {
    if (confirm('Are you sure you want to delete..iska puchna h k tsk k liiye jo diye hue h unka kya karna h ?')) {
      this.accountDetailObj.hardCopyDocArr.splice(this.accountDetailObj.hardCopyDocArr.length - 1 - index, 1);
      this.saveDataOfAccount(this.accountDetailObj);


      if (this.accountDetailObj.hardCopyDocArr.length == 0) {
        this.showHardDocsform = true;
      } else {
        this.showHardDocsform = false;
      }
    }
  }

}
