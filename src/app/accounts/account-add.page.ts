import { Component, ElementRef, ViewChild, } from '@angular/core';
import { CommonService } from '../common.service';
import { Router, ActivatedRoute } from '@angular/router';

import { ModalController } from '@ionic/angular';
import { AgentAddPage } from '../agent/agent-add.page';
@Component({
  selector: 'app-add-account',
  templateUrl: 'account-add.html',
  styleUrls: ['account-add.scss']
})
export class AccountsAddPage {
  hardCopyDetailObj: any = { 'document_name': '', 'agent_id_int': '', 'task_id_int': "" };
  nDetailObj: any = { 'relation': '', 'nominee_id': "", nominee_name: '', sharepercent: '' };
  account_id_int: any = undefined;
  saveDataSub: any; getSub: any; getSubA: any;
  bankList: any; organisation_typeList: any;
  accountDetailObj: any = { account_or_policy: 'Account', bank_or_post_office: 'Bank', mobile_given_for_account: '', email_given_for_account: '', address_given_for_account: '', imageArr: [], nomineeArr: [], hardCopyDocArr: [], 'account_id_int': 0 };
  showingListFor: any = undefined;
  idOfthePersonForWhomListIs: any = undefined;
  currentSegment: any = 'accountDetails';
  stateList: any;
  @ViewChild('content') content !: ElementRef;
  moduleInfoList: any = { "apipath": "apipolicy/uploadAccountfiles", 'linebelowBrowsefile': 'Upload related documents !', 'module': 'Account', "showPreview": false, "browseimagepath": 'assets/browsefile.png', 'multipleAllowed': true, "filetype": 'Any' };
  isOpenedAsModal: boolean = false;

  yesnoList: any = [{ option: 'Yes' }, { option: 'No' }];
  account_typeList: any = [{ option: 'Saving' }, { option: 'Current' }];
  headingP = 'Account';
  heading = 'Accounts';
  whattypeofdocadding: any = 'hard';
  account_or_policy: any;
  constructor(private modalCtrl: ModalController, public CommonService: CommonService, private router: Router, private route: ActivatedRoute) {
    this.CommonService.showTabMenu = false;
    this.CommonService.loading = false;
  }
  dismissComponentAsModal() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
  SaveComponentAsModal() {
    setTimeout(() => {
      return this.modalCtrl.dismiss(null, 'confirm');
    }, 1000);

  }

  ngOnInit() {
    this.stateList = this.CommonService.stateList;
    this.organisation_typeList = this.CommonService.organisation_typeList;
    this.bankList = this.CommonService.bankList;
    this.route.params.subscribe(paramsId => {
      if (!paramsId['account_or_policy']) {
        this.CommonService.account_or_policy = this.account_or_policy = this.CommonService.openAccountOrPolicyModalFor;
        this.isOpenedAsModal = true;
      } else {
        this.account_id_int = paramsId['account_id_int'];
        this.showingListFor = paramsId['showingListFor'];
        this.account_or_policy = paramsId['account_or_policy'];
        this.CommonService.account_or_policy = paramsId['account_or_policy'];
        this.idOfthePersonForWhomListIs = paramsId['idOfthePersonForWhomListIs'];

      }

      this.accountDetailObj = { account_or_policy: this.account_or_policy, mobile_given_for_account: '', hardCopyDocArr: [], email_given_for_account: '', address_given_for_account: '', imageArr: [], nomineeArr: [], 'account_id_int': 0 };

      if (this.CommonService.iwanttoshowPolicyUnderAccButNotBasedOnURL == -1) {
        if (this.account_or_policy == 'Policy') {
          this.heading = 'Policies'; this.headingP = 'Policy';
        } else {
          this.heading = 'Accounts'; this.headingP = 'Account';
        }
      } else {
        this.heading = 'Policies'; this.headingP = 'Policy';
        this.accountDetailObj['parent_account_id_int'] = this.CommonService.iwanttoshowPolicyUnderAccButNotBasedOnURL;
        this.accountDetailObj['account_or_policy'] = 'Policy';
      }

      if (!this.account_id_int) {
        if (this.showingListFor == 'Agent') {
          this.accountDetailObj['agent_id_int'] = this.idOfthePersonForWhomListIs;
        } else if (this.showingListFor == 'User') {
          this.accountDetailObj['user_id_int'] = this.idOfthePersonForWhomListIs;
        }
      }

      if (this.CommonService.taskList) {
        if (this.CommonService.agentList) {
          this.loadAccountInfo();
        } else {
          this.getAgentList();
        }
      } else {
        this.getTaskList();
      }




    });
  }
  getSubTask: any;
  getTaskList() {
    this.CommonService.loading = true;
    this.getSubTask = this.CommonService.getTaskList().subscribe((data: any) => {
      this.CommonService.loading = false;
      this.CommonService.taskList = data;
      if (this.CommonService.agentList) {
        this.loadAccountInfo();
      } else {
        this.getAgentList();
      }

    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong" })
    });
  }
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
    if (confirm('Are you sure you want to delete ?')) {
      this.accountDetailObj.hardCopyDocArr.splice(this.accountDetailObj.hardCopyDocArr.length - 1 - index, 1);
      if (this.accountDetailObj.hardCopyDocArr.length == 0) {
        this.showHardDocsform = true;
      } else {
        this.showHardDocsform = false;
      }
    }
  }
  showNomineeform = true;

  addNomineeNumbers() {
    if (this.nDetailObj.nominee_id == '' || this.nDetailObj.relation == '' || this.nDetailObj.sharepercent == '') {
      this.CommonService.message({ 'message': "If you want to add nominee details then you need to fill all required fields !", color: 'warning' })
    } else {
      this.accountDetailObj.nomineeArr.push({
        ...this.nDetailObj
      });
      this.nDetailObj = { 'relation': '', nominee_name: '', 'nominee_id': "", sharepercent: '' };
      this.getAvailableNomineesList();


      if (this.accountDetailObj.nomineeArr.length == 0) {
        this.showNomineeform = true;
      } else {
        this.showNomineeform = false;
      }
    }

  }
  availableNomineesList: any = [];
  getAvailableNomineesList() {
    this.availableNomineesList = [];
    let alreadyNomnieeArr: any[] = [];
    this.accountDetailObj.nomineeArr.forEach((item: any) => {
      alreadyNomnieeArr.push(item.nominee_id);
    });


    this.CommonService.agentList.forEach((item: any) => {

      if (item.working_for_user_or_agent == 'User' && alreadyNomnieeArr.includes(item.agent_id_int) == false) {

        this.availableNomineesList.push(item);
      }
    });
  }
  deleteNominee(index: number) {
    if (confirm('Are you sure you want to delete this Nominee ?')) {

      this.accountDetailObj.nomineeArr.splice(this.accountDetailObj.nomineeArr.length - 1 - index, 1);
      this.getAvailableNomineesList();

      if (this.accountDetailObj.nomineeArr.length == 0) {
        this.showNomineeform = true;
      } else {
        this.showNomineeform = false;
      }
    }
  }
  updateSelectUserObjForExtraInfoCount: number = 0;
  updateSelectUserObjForExtraInfo() {
    if (this.updateSelectUserObjForExtraInfoCount == 0) {
      this.updateSelectUserObjForExtraInfoCount = 1;

    } else {

      this.CommonService.agentList.every((item: any) => {
        if (item.agent_id_int == this.accountDetailObj.user_id_int) {
          this.accountDetailObj['mobile_given_for_account'] = item['mobile'];
          this.accountDetailObj['email_given_for_account'] = item['email'];
          this.accountDetailObj['address_given_for_account'] = item['address'] + " " + item['city'] + " " + item['state'] + " " + item['pincode'];
          return false;
        }
        return true;
      });
    }

  }
  assignOrganisationWithCondition(organisation_type: any) {
    if (organisation_type != 'Bank') {
      this.accountDetailObj.organisation = organisation_type;
    }
  }
  getAgentList() {
    this.getSubA = this.CommonService.getAgentList().subscribe((data: any) => {
      this.CommonService.loading = false;
      this.CommonService.agentList = data;
      this.CommonService.agentList.forEach((perAgentUser: any) => {
        this.CommonService.agentListArrByIdAsKey[perAgentUser.agent_id_int] = perAgentUser;
      });
      this.loadAccountInfo();

    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong" })
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
  }
  loadAccountInfo() {
    if (this.account_id_int) {
      this.accountDetailObj['account_id_int'] = this.account_id_int;
      if (this.CommonService.accountList) {
        this.getAccountInfo();
      } else {
        this.getAccountList();
      }
    } else {
      this.showNomineeform = true;
    }
  }

  getAccountList() {

    this.CommonService.loading = true;
    this.getSub = this.CommonService.getAccountList().subscribe((data: any) => {
      this.CommonService.loading = false;

      this.CommonService.accountList = data;
      this.getAccountInfo();
    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong" })
    });
  }

  getAccountInfo() {
    let foundDetail = false;
    this.CommonService.accountList.every((item: any) => {
      if (item.account_id_int == this.account_id_int) {
        foundDetail = true;
        this.accountDetailObj = item;
        this.updateDropDownValuesForSelectAccountHolderAndAgent();
        if (this.accountDetailObj.nomineeArr.length == 0) {
          this.showNomineeform = true;
        } else {
          this.showNomineeform = false;
        }

        if (this.accountDetailObj.hardCopyDocArr.length == 0) {
          this.showHardDocsform = true;
        } else {
          this.accountDetailObj.hardCopyDocArr.forEach((item: any) => {

            item.task_name = this.CommonService.taskListArrByIdAsKey[item.task_id_int] ? this.CommonService.taskListArrByIdAsKey[item.task_id_int]['taskname'] : '';
            item.agent_name = this.CommonService.agentListArrByIdAsKey[item.agent_id_int] ? this.CommonService.agentListArrByIdAsKey[item.agent_id_int]['name'] : '';


          });

          this.showHardDocsform = false;
        }
        this.assignNomineeName();
        this.getAvailableNomineesList();
        return false;
      }
      return true;
    });
    if (this.account_id_int && !foundDetail) {
      this.router.navigate(['tabs/accounts/' + this.account_or_policy + '/' + this.showingListFor + '/' + this.idOfthePersonForWhomListIs]);

    }

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

  assignNomineeName() {
    let tmpNominee: any[] = [];
    this.accountDetailObj.nomineeArr.forEach((perNomnee: any) => {
      if (this.CommonService.agentListArrByIdAsKey[perNomnee.nominee_id]) {
        perNomnee['nominee_name'] = this.CommonService.agentListArrByIdAsKey[perNomnee.nominee_id]['name'];
        tmpNominee.push({ ...perNomnee });
      }
    });
    this.accountDetailObj.nomineeArr = tmpNominee;
  }
  segmentChange(events: any) {
    this.currentSegment = events.detail.value;
  }

  saveDataOfAccount() {

    if (!this.accountDetailObj.bank_or_post_office || !this.accountDetailObj.organisation) {
      this.CommonService.message({ 'message': "Please select where are you opening account !", color: 'warning' });

    } else if (!this.accountDetailObj.postoffice_bank_address) {
      this.CommonService.message({ 'message': "Please enter  " + this.accountDetailObj.organisation + ' branch address !', color: 'warning' });

    } else if (!this.accountDetailObj.account_title) {
      this.CommonService.message({ 'message': "Please enter Account Title", color: 'warning' });

    } else if (!this.accountDetailObj.user_id_int) {
      this.CommonService.message({ 'message': "Please select Account Holder", color: 'warning' });

    } else if (!this.accountDetailObj.mobile_given_for_account) {
      this.CommonService.message({ 'message': "Please enter Mobile Number you are using for this account !", color: 'warning' });

    } else if (!this.accountDetailObj.email_given_for_account) {
      this.CommonService.message({ 'message': "Please enter Email Id you are using for this account !", color: 'warning' });

    } else if (!this.accountDetailObj.address_given_for_account) {
      this.CommonService.message({ 'message': "Please enter Account Holder Address you are using for this account !", color: 'warning' });

    }
    else if (this.accountDetailObj.bank_or_post_office == 'Bank' && !this.accountDetailObj.account_type) {
      this.CommonService.message({ 'message': "Please select Account Type !", color: 'warning' });

    }
    else if (!this.accountDetailObj.account_number) {
      this.CommonService.message({ 'message': "Please enter Account Number !", color: 'warning' });

    } else if (!this.accountDetailObj.unique_id_for_account) {
      this.CommonService.message({ 'message': "Please enter  Customer Id/CIF Id  !", color: 'warning' });

    } else if (this.accountDetailObj.bank_or_post_office == 'Bank' && !this.accountDetailObj.ifsc) {
      this.CommonService.message({ 'message': "Please enter  Bank IFSC Code  !", color: 'warning' });

    } else if (!this.accountDetailObj.account_opening_date) {
      this.CommonService.message({ 'message': "Please enter  Account opening date   !", color: 'warning' });

    }
    else {

      this.CommonService.loading = true;
      this.saveDataSub = this.CommonService.saveDataOfAccount(this.accountDetailObj).subscribe((data: any) => {

        if (data.status) {
          this.CommonService.accountList = data.AccountList;
          this.CommonService.manageaccountListArrByIdAsKey();




          this.CommonService.message({ 'message': data.message, color: 'success' });


          if (this.isOpenedAsModal) {
            this.CommonService.loading = false;
            this.SaveComponentAsModal();
          } else {
            if (this.CommonService.iwanttoshowPolicyUnderAccButNotBasedOnURL > -1) {

              this.CommonService.filterAccountListAccodingtoUserOrAgent('Account', this.CommonService.iwanttoshowPolicyUnderAccButNotBasedOnURL);

            } else {
              this.CommonService.filterAccountListAccodingtoUserOrAgent(this.showingListFor, this.idOfthePersonForWhomListIs);
            }

            if (this.CommonService.accountLastPage == 'Detail') {
              this.CommonService.loading = false;
              this.router.navigate(['tabs/accounts/accountsdetail/' + this.account_or_policy + '/' + this.showingListFor + '/' + this.idOfthePersonForWhomListIs + '/' + this.account_id_int]);
            } else {
              if (!this.account_id_int) {
                this.CommonService.whencomebacktoAccountListAfterSaveDoNeedToSendToDetails_variable_is_with_account_id = this.CommonService.accountList[0]['account_id_int'];
              } else {
                this.CommonService.loading = false;
                this.CommonService.whencomebacktoAccountListAfterSaveDoNeedToSendToDetails_variable_is_with_account_id = -1;
              }

              this.router.navigate(['tabs/accounts/' + this.account_or_policy + '/' + this.showingListFor + '/' + this.idOfthePersonForWhomListIs]);
            }
          }

        } else {
          this.CommonService.loading = false;
          this.CommonService.message({ 'message': data.message, color: 'danger' })
        }

      }, (err: any) => {
        this.CommonService.loading = false;
        this.CommonService.message({ 'message': "Something is wrong", color: 'danger' })
      });
    }
  }

  ngOnDestroy() {
    if (this.saveDataSub) {
      this.saveDataSub.unsubscribe();
    } if (this.getSub) {
      this.getSub.unsubscribe();
    } if (this.deleteFileDataSub) {
      this.deleteFileDataSub.unsubscribe();
    }
    if (this.getSubA) {
      this.getSubA.unsubscribe();
    }
    if (this.getSubTask) {
      this.getSubTask.unsubscribe();
    }


  }


  ///image list work
  viewDoc(filedetails: any) {
    window.open(filedetails.serverpath + filedetails.filepath, "_blank");
  }
  deleteFileDataSub: any;
  updateImageInfoFunList(udatedmoduleInfo: any) {
    udatedmoduleInfo.imagePathArr.forEach((element: any) => {
      this.accountDetailObj['imageArr'].push({ ...element });

    });
  } deleteFile(filedetail: any, i: number) {
    this.CommonService.loading = true;

    this.deleteFileDataSub = this.CommonService.deleteFile(filedetail.filepath).subscribe((data: any) => {
      this.CommonService.loading = false;


      if (data.status) {
        let t: any = [];
        this.accountDetailObj.imageArr.forEach((item: any) => {
          if (item.filepath != filedetail.filepath) {
            t.push({ ...item });
          }
        });
        this.accountDetailObj.imageArr = t;

      } else {
        this.CommonService.message({ 'message': data.message, color: 'danger' })
      }

    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong", color: 'danger' })
    });
  }
  // image list work end

}
