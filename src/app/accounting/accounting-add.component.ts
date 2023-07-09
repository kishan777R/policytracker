
import { Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import { CommonService } from '../common.service';
import { Router, ActivatedRoute } from '@angular/router';

import { ModalController } from '@ionic/angular';
import { AgentAddPage } from '../agent/agent-add.page';
import { AccountsAddPage } from '../accounts/account-add.page';


@Component({
  selector: 'app-accounting-add',
  templateUrl: './accounting-add.component.html',
  styleUrls: ['./accounting-add.component.scss'],
})
export class AccountingAddComponent implements OnInit {

  credit_debit_id_int: any = undefined;

  getSub: any; getSubA: any; deleteFileDataSub: any; saveDataSub: any;
  recordDetailObj: any = { 'credit_debit_id_int': 0, 'paid_or_received': 'Paid', imageArr: [] };

  payModeList: any = [{
    'img': 'cash', 'name': 'Cash', 'value': 'Cash', 'style': "width:50px;height:34px"
  },

  {
    'img': '', 'name': 'Net Banking ', 'value': 'Netbanking', 'style': ""
  },
  {
    'img': 'UPI', 'name': '', 'value': 'UPI', 'style': "width:61px;height:27px"
  },
  {
    'img': 'Cheque', 'name': 'Cheque', 'value': 'Cheque', 'style': "width:50px;height:37px"
  },
  {
    'img': 'Paytm', 'name': '', 'value': 'Paytm', 'style': "width:99px;height:23px"
  },
  {
    'img': 'payu', 'name': '', 'value': 'PayU', 'style': "width:99px;height:33px"
  },

  {
    'img': 'phonepay', 'name': '', 'value': 'PhonePay', 'style': "width:94px;height:32px"
  },

  {
    'img': 'GooglePay', 'name': '', 'value': 'GooglePay', 'style': "width:99px;height:33px"
  },
  {
    'img': '', 'name': 'Other', 'value': 'Other', 'style': ""
  }
  ];
  currentSegment: any = 'detail';
  tileList: any = undefined;

  moduleInfo: any = { "apipath": "apipolicy/uploadfileofcredit_debit", 'linebelowBrowsefile': 'Upload record related documents !', 'module': 'Credit Debit', "showPreview": false, "browseimagepath": 'assets/browsefile.png', 'multipleAllowed': true, "filetype": 'Any' };
  constructor(private modalCtrl: ModalController, public CommonService: CommonService, private router: Router, private route: ActivatedRoute) {
    this.CommonService.showTabMenu = false; this.CommonService.loading = false;
  }
  ngOnInit() {
    this.tileList = this.CommonService.balanceRecordTileList;
    this.initailFun();

  }
  ionViewWillEnter() {
    this.initailFun();
  }
  performAtion(perCol: any) {


  }

  initailFun() {

    if (this.CommonService.addingOrEditingAccountinecod.id) {
      this.credit_debit_id_int = this.CommonService.addingOrEditingAccountinecod.id;
      this.recordDetailObj.credit_debit_id_int = this.credit_debit_id_int;
    }
    if (this.CommonService.accountList) {
      if (this.credit_debit_id_int) {
        this.getparticularRecordInfo();
      }
    } else {
      this.getAccountList();
    }
  }
  viewDoc(filedetails: any) {
    window.open(filedetails.serverpath + filedetails.filepath, "_blank");
  }

  segmentChange(events: any) {
    this.currentSegment = events.detail.value;
  }

  agentDetailObj: any = { name: '' };
  editRecord() {

    this.CommonService.addingOrEditingAccountinecod.show_or_addedit = 'addedit';

    this.openAddRecordModalWork();
  }

  async openAddRecordModalWork() {

    const modal = await this.modalCtrl.create({
      component: AccountingAddComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    this.CommonService.addingOrEditingAccountinecod.show_or_addedit = 'show';    if (role == 'save') {

    this.CommonService.creditDebitList.every((item: any, index: any) => {

      if (item.credit_debit_id_int == this.CommonService.addingOrEditingAccountinecod.id) {
        this.recordDetailObj = data;

        this.CommonService.creditDebitList[index] = data;
        return false;

      }
      return true;
    });
  }
}

  getAccountList() {

    this.CommonService.loading = true;
    this.getSubA = this.CommonService.getAccountList().subscribe((data: any) => {
      this.CommonService.loading = false;

      this.CommonService.accountList = data;
      if (this.credit_debit_id_int) {
        this.getparticularRecordInfo();
      }


    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong" })
    });
  }
  getparticularRecordInfo() {

    this.CommonService.loading = true;
    this.getSubA = this.CommonService.getparticularRecordInfo(this.credit_debit_id_int).subscribe((data: any) => {
      this.CommonService.loading = false;

      this.recordDetailObj = data;

      this.updateDropDownValuesForSelectAccount();
    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong" })
    });
  }
  updateDropDownValuesForSelectAccount() {
    if (this.recordDetailObj['account_id_int'] && this.CommonService.accountListArrByIdAsKey[this.recordDetailObj['account_id_int']]) {
      this.recordDetailObj['account_title'] = this.CommonService.accountListArrByIdAsKey[this.recordDetailObj['account_id_int']]['account_title'];

    } else {
      this.recordDetailObj['account_title'] = '';

    }


  }
  dismissComponentAsModal() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
  SaveComponentAsModal() {
    setTimeout(() => {
      return this.modalCtrl.dismiss(this.recordDetailObj, 'save');
    }, 1000);

  }
  deleteRecord() {
    return this.modalCtrl.dismiss(this.recordDetailObj, 'delete');
  }
  async addAccountPolicy(AccountOrPolicy: any) {
    this.CommonService.openAccountOrPolicyModalFor = AccountOrPolicy;
    const modal = await this.modalCtrl.create({
      component: AccountsAddPage,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    this.CommonService.accountList.forEach((perAccount: any) => {
      this.CommonService.accountListArrByIdAsKey[perAccount.account_id_int] = perAccount;
    });

  }

  updateImageInfoFun(udatedmoduleInfo: any) {
    udatedmoduleInfo.imagePathArr.forEach((element: any) => {
      this.recordDetailObj['imageArr'].push({ ...element });

    });
  }

  updateImageInfoFunList(udatedmoduleInfo: any, recordDetailObj: any) {
    udatedmoduleInfo.imagePathArr.forEach((element: any) => {
      recordDetailObj['imageArr'].push({ ...element });
    });

    this.saveDataOfRecord('NO');
  }

  deleteFile(filedetail: any, i: number, callSave = 'No') {
    this.CommonService.loading = true;

    this.deleteFileDataSub = this.CommonService.deleteFile(filedetail.filepath).subscribe((data: any) => {
      this.CommonService.loading = false;

      if (data.status) {
        let t: any = [];
        this.recordDetailObj.imageArr.forEach((item: any) => {
          if (item.filepath != filedetail.filepath) {
            t.push({ ...item });
          }
        });
        this.recordDetailObj.imageArr = t;
        if (callSave == 'Yes') {
          this.saveDataOfRecord('NO');
        }
      } else {
        this.CommonService.message({ 'message': data.message, color: 'danger' })
      }

    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong", color: 'danger' })
    });
  }

  saveDataOfRecord(closeModal = 'NO') {

    if (!this.recordDetailObj.paid_or_received || !this.recordDetailObj.payment_title || !this.recordDetailObj.paid_to_or_received_from || !this.recordDetailObj.amount || !this.recordDetailObj.payment_date || !this.recordDetailObj.payment_mode) {
      this.CommonService.message({ 'message': "Fill Required Fields !", color: 'warning' });

    } else if (this.recordDetailObj.payment_mode == 'Other' && !this.recordDetailObj.payment_mode_name_if_other_selected) {
      this.CommonService.message({ 'message': "Enter Payment mode name !", color: 'warning' });
    } else {

      this.CommonService.loading = true;


      this.saveDataSub = this.CommonService.saveDataOCreditDebit(this.recordDetailObj).subscribe((data: any) => {
        this.CommonService.loading = false;

        if (data.status) {
          this.CommonService.message({ 'message': data.message, color: 'success' })
          if (closeModal == "YES") {
            this.SaveComponentAsModal();
          }



        } else {
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
    } if (this.getSubA) {
      this.getSubA.unsubscribe();
    } if (this.deleteFileDataSub) {
      this.deleteFileDataSub.unsubscribe();
    }

  }


}
