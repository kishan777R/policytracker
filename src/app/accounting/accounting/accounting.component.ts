import { Component } from '@angular/core';
import { CommonService } from '../../common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { AccountingAddComponent } from '../accounting-add.component';

@Component({
  selector: 'app-accounting',
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.scss'],
})
export class AccountingComponent {
  showingWhichSectionInModal = 'Info';
  creditDebitListTotalRecord = 0;
  moduleInfoList: any = { "apipath": "apipolicy/uploadfileofcredit_debit", 'linebelowBrowsefile': 'Upload record related documents !', 'module': 'Credit Debit', "showPreview": false, "browseimagepath": 'assets/browsefile.png', 'multipleAllowed': true, "filetype": 'Any' };
  saveDataSub: any;
  public actionSheetButtons: any;
  getSub: any;
  deleteSub: any; getSubA: any;
  filterPaidrecieved: any = [{ name: 'Paid', value: 'Paid', "selected": false }, { name: 'Received', value: 'Received', "selected": false }];
  filterPayment_mode: any = [{ name: 'UPI', value: 'UPI', "selected": false }, { name: 'Cash', value: 'Cash', "selected": false },
  { name: 'Cheque', value: 'Cheque', "selected": false }, { name: 'Netbanking', value: 'Netbanking', "selected": false },
  { name: 'Other', value: 'Other', "selected": false }];
  limit: number = 0; skip: number = 0;
  searchTerm: any = ''; filterPayment_date1 = '';
  filterPayment_date2 = '';
  constructor(private modalCtrl: ModalController, private actionSheetCtrl: ActionSheetController, public CommonService: CommonService, private router: Router, private route: ActivatedRoute) {
    this.CommonService.showTabMenu = false; this.CommonService.loading = false;
  }
  ngOnInit() {
    this.initialLoad();
  }
  ionViewWillLeave() {
  }
  initialLoad() {
    if (!this.CommonService.accountList || this.CommonService.accountList.length == 0) {
      this.getAccountList();
    }
    else {
      if (!this.CommonService.categoryList || this.CommonService.categoryList.length == 0) {
        this.getCategoryList();
      } else {
        if (!this.CommonService.creditDebitList || this.CommonService.creditDebitList.length == 0) {
          this.getCreditDebitList();
        }
      }
    }
  }
  getAccountList() {

    this.CommonService.loading = true;
    this.getSub = this.CommonService.getAccountList().subscribe((data: any) => {

      this.CommonService.accountList = data;

      if (!this.CommonService.categoryList || this.CommonService.categoryList.length == 0) {
        this.getCategoryList();
      } else {
        this.getCreditDebitList();
      }
    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong." })
    });
  }
  getCategoryList() {
    this.CommonService.loading = true;
    this.getSub = this.CommonService.getCategoryList().subscribe((data: any) => {
      this.CommonService.categoryList = data;
      if (!this.CommonService.creditDebitList || this.CommonService.creditDebitList.length == 0) {
        this.getCreditDebitList();
      } else {

        this.CommonService.loading = false;
      }
    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong.." })
    });
  }
  addCount: number = 0;
  getCreditDebitList() {

    this.CommonService.loading = true;
    this.getSub = this.CommonService.getCreditDebitList({
      'filterAccountIdAccounting': this.CommonService.filterAccountIdAccounting,
      'filterPaidrecieved': this.filterPaidrecieved,
      'filterPayment_mode': this.filterPayment_mode,
      'searchTerm': this.searchTerm,
      'limit': this.limit,
      'skip': this.skip - this.deleteCount + this.addCount,
      filterPayment_date1: this.filterPayment_date1,
      filterPayment_date2: this.filterPayment_date2,
    }

    ).subscribe((data: any) => {
      this.CommonService.loading = false;
      if (this.skip == 0) {
        this.CommonService.creditDebitList = [];
      }
      data.list.forEach((item: any) => {
        item.account_title= '';
        console.log(this.CommonService.accountListArrByIdAsKey[  item.account_id_int]);
        if(item.account_id_int && this.CommonService.accountListArrByIdAsKey[  item.account_id_int]){
          item.account_title= this.CommonService.accountListArrByIdAsKey[  item.account_id_int]['account_title']
        }
       
        this.CommonService.creditDebitList.push({ ...item });
      });
      if (this.skip == 0) {
        this.creditDebitListTotalRecord = data.creditDebitListTotalRecord;
      }

      this.deleteCount = 0; this.addCount = 0;
      this.skip = this.limit;
    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong !" })
    });
  }
  openAddRecordModal() {
    this.CommonService.addingOrEditingAccountinecod = undefined;
    this.openAddRecordModalWork();


  }
  async openAddRecordModalWork() {

    const modal = await this.modalCtrl.create({
      component: AccountingAddComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role == 'confirm') {
      if (this.CommonService.addingOrEditingAccountinecod) {


        this.CommonService.creditDebitList.every((item: any, index: any) => {

          if (item.credit_debit_id_int == this.CommonService.addingOrEditingAccountinecod) {

            this.CommonService.creditDebitList[index] = data;
            return false;

          }
          return true;
        });
        this.CommonService.addingOrEditingAccountinecod = undefined;
      } else {
        this.addCount = 1;

        this.CommonService.creditDebitList.unshift({ ...data });
      }

    }




  }
  handleRefresh(event: any) {
    setTimeout(() => {
      this.initialLoad();
      event.target.complete();
    }, 2000);
  };
  ngOnDestroy() {
    if (this.getSub) {
      this.getSub.unsubscribe();
    } if (this.deleteSub) {
      this.deleteSub.unsubscribe();
    } if (this.getSubA) {
      this.getSubA.unsubscribe();
    } if (this.saveDataSub) {
      this.saveDataSub.unsubscribe();
    } if (this.deleteFileDataSub) {
      this.deleteFileDataSub.unsubscribe();
    }
  }
  deleteFileDataSub: any;

  deleteFile(filedetail: any, i: number, recordDetailObj: any, loopi: any) {


    this.deleteFileDataSub = this.CommonService.deleteFile(filedetail.filepath).subscribe((data: any) => {

      if (data.status) {
        let t: any = [];
        recordDetailObj.imageArr.forEach((item: any) => {
          if (item.filepath != filedetail.filepath) {
            t.push({ ...item });
          }
        });
        recordDetailObj.imageArr = t;
        this.saveDataOfRecord(recordDetailObj, loopi);
      } else {
        this.CommonService.message({ 'message': data.message, color: 'danger' })
      }

    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong", color: 'danger' })
    });
  }
  updateImageInfoFun(udatedmoduleInfo: any, recordDetailObj: any, index: any) {
    udatedmoduleInfo.imagePathArr.forEach((element: any) => {
      recordDetailObj['imageArr'].push({ ...element });
    });

    this.saveDataOfRecord(recordDetailObj, index);
  }
  editCreditDebit(credit_debit_id_int: Number) {
    this.CommonService.addingOrEditingAccountinecod = credit_debit_id_int;
    this.openAddRecordModalWork();
  }
  saveDataOfRecord(recordDetailObj: any, index: any) {
    this.CommonService.loading = true;
    this.saveDataSub = this.CommonService.saveDataOCreditDebit(recordDetailObj).subscribe((data: any) => {
      this.CommonService.loading = false;
      if (data.status) {

        this.CommonService.creditDebitList[index]['imageArr'] = recordDetailObj['imageArr'];
        this.CommonService.message({ 'message': data.message, color: 'success' })
      } else {
        this.CommonService.message({ 'message': data.message, color: 'danger' })
      }
    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong", color: 'danger' })
    });

  }

  viewDoc(filedetails: any) {
    window.open(filedetails.serverpath + filedetails.filepath, "_blank");
  }
  deleteCount: number = 0;
  deleteCreditDebit(index: any, credit_debit_id_int: Number, extraaction: string = '') {
    if (confirm("Are you sure you want to delete this data ?")) {
      this.CommonService.loading = true;
      this.deleteSub = this.CommonService.deleteCreditDebit(credit_debit_id_int, extraaction).subscribe((data: any) => {
        this.CommonService.loading = false;
        if (data.status) {
          this.CommonService.creditDebitList.splice(index, 1);

          this.deleteCount = this.deleteCount + 1;
          this.CommonService.message({ 'message': data.message, color: 'success' })
        } else {
          this.CommonService.message({ 'message': data.message, color: 'danger' })
        }
      }, (err: any) => {
        this.CommonService.loading = false;
        this.CommonService.message({ 'message': "Something is wrong..." })
      });
    }
  }
}
