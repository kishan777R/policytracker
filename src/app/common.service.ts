import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { retry, catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'authkey': '147422AELrHbUrjds58e1f859', 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  showTabMenu: boolean = false;
  bankList: any;
  creditDebitList: any = undefined;
  categoryList: any = undefined;
  addingOrEditingAccountinecod: any = {index:undefined,id:undefined,show_or_addedit:undefined};
  stateList: any;
  agentList: any = undefined;
  agentListArrByIdAsKey: any = []; accountListArrByIdAsKey: any = [];
  creditDebitArrByIdAsKey: any = []; categoryArrByIdAsKey: any = [];
  taskList: any = undefined;
  organisation_typeList: any;
  dashboardHeader: any; loading: boolean = false;
  agentTileList: any; balanceRecordTileList: any;
  userTileList: any;
  whencomebacktoAccountListAfterSaveDoNeedToSendToDetails_variable_is_with_account_id: number = -1;
  tilesList: any; uri: string = environment.commonURL;
  customerinfo = { customer_id_int: 1, logged_in_user_id_int: 1 };
  agentLastPage = 'List';
  taskLastPage = 'List';
  filteredListAccount: any = undefined;
  filteredListUserAgent: any = undefined;
  accountList: any;
  policyList: any;
  accountLastPage: string = 'List';
  openAgentModalFor: any; openAccountOrPolicyModalFor: any;
  accountTileList: any; polcyTileList: any;
  hometilesListBelowcard: any;
  account_or_policy: any; filterAccountIdAccounting: any = [];
  iwanttoshowPolicyUnderAccButNotBasedOnURL = -1;
  ngOnInit() {

  }
  ngOnDestroy() {

  }
  //to do jab useer kudh hi login hoga to logged_in_user_id_int me customer_id_int daal denge
  constructor(private toastController: ToastController, private http: HttpClient,) { }

  deleteFile(filepath: any) {
    return this.http.post<any>(this.uri + 'apipolicy/deleteFile', { filepath: filepath }, httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  //Category start

  getCategoryList() {

    return this.http.get<any>(this.uri + 'apipolicy/categorylist/' + this.customerinfo.customer_id_int, httpOptions).pipe(
      map((data) => {

        console.log(data);
        data.forEach((item: any) => {
          this.categoryArrByIdAsKey[item.category_id_int] = item;

        });
        return data;
      }
      ),
      retry(1),
      catchError(this.handleError)
    );
  }
  deleteCategory(category_id_int: Number, extraaction: string) {
    return this.http.delete<any>(this.uri + 'apipolicy/category/' + category_id_int + '/' + extraaction + '/' + this.customerinfo.logged_in_user_id_int + '/' + this.customerinfo.customer_id_int, httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  saveDataOfCategory(data: any) {
    data['customer_id_int'] = this.customerinfo.customer_id_int;
    data['logged_in_user_id_int'] = this.customerinfo.logged_in_user_id_int;
    return this.http.post<any>(this.uri + 'apipolicy/category', data, httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  //Category end
  //accounting start
  getparticularRecordInfo(credit_debit_id_int: number) {

    return this.http.get<any>(this.uri + 'apipolicy/credit_debit/' + credit_debit_id_int, httpOptions).pipe(

      retry(1),
      catchError(this.handleError)
    );
  }
  getCreditDebitList(filteringData: any) {
    filteringData['customer_id_int'] = this.customerinfo.customer_id_int;
    return this.http.post<any>(this.uri + 'apipolicy/credit_debitlist', filteringData, httpOptions).pipe(
      map((data) => {

        data.list.forEach((item: any) => {
          this.creditDebitArrByIdAsKey[item.credit_debit_id_int] = item;

        });
        return data;
      }
      ), retry(1),
      catchError(this.handleError)
    );

  }

  deleteCreditDebit(credit_debit_id_int: Number, extraaction: string = '') {
    return this.http.delete<any>(this.uri + 'apipolicy/credit_debit/' + credit_debit_id_int + '/' +     this.customerinfo.logged_in_user_id_int + '/' + this.customerinfo.customer_id_int, httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  saveDataOCreditDebit(data: any) {
    data['customer_id_int'] = this.customerinfo.customer_id_int;
    data['logged_in_user_id_int'] = this.customerinfo.logged_in_user_id_int;
    return this.http.post<any>(this.uri + 'apipolicy/credit_debit', data, httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }


  //accounting end 


  //account start
  filterAccountListAccodingtoUserOrAgent(showingListFor: any, idOfthePersonForWhomListIs: any) {
    this.filteredListAccount = [];


    this.accountList.forEach((Element: any) => {
      if ((this.account_or_policy == Element.account_or_policy && this.iwanttoshowPolicyUnderAccButNotBasedOnURL == -1) || (Element.account_or_policy == 'Policy' && this.iwanttoshowPolicyUnderAccButNotBasedOnURL > -1)) {
        let userData = this.agentListArrByIdAsKey[Element.user_id_int];
        Element.account_holder_name = userData.name;


        if (this.agentListArrByIdAsKey[Element.user_id_int]) {
          let userData = this.agentListArrByIdAsKey[Element.user_id_int];
          Element.account_holder_name = userData.name;
        }
        else {
          Element.account_holder_name = "";
        }



        if (Element.agent_id_int && Element.agent_id_int != -1) {

          if (this.agentListArrByIdAsKey[Element.agent_id_int]) {
            let agentData = this.agentListArrByIdAsKey[Element.agent_id_int];
            Element.helping_agent_name = agentData.name;
          }
          else {
            Element.helping_agent_name = "";
          }
        } else {
          Element.helping_agent_name = "";
        }
        Element.parent_account_number = Element.parent_account_title = '';
        if (Element.account_or_policy == 'Policy') {
          if (Element.parent_account_id_int) {

            if (this.accountListArrByIdAsKey[Element.parent_account_id_int]) {

              Element.parent_account_title = this.accountListArrByIdAsKey[Element.parent_account_id_int]['account_title'];
              Element.parent_account_number = this.accountListArrByIdAsKey[Element.parent_account_id_int]['account_number'];
            } else {
              Element.parent_account_number = Element.parent_account_title = '';
            }
          }
        }

        if (showingListFor == 'Agent') {
          if (Element.agent_id_int == idOfthePersonForWhomListIs) {
            console.log("I am inside this");
            this.filteredListAccount.push({ ...Element });
          }
        } else if (showingListFor == 'User') {
          if (Element.user_id_int == idOfthePersonForWhomListIs) {
            this.filteredListAccount.push({ ...Element });
          }
        } else if (showingListFor == 'Account') {
          if (Element.parent_account_id_int == idOfthePersonForWhomListIs) {
            this.filteredListAccount.push({ ...Element });
          }
        } else {
          this.filteredListAccount.push({ ...Element });
        }
      }
    });


  }
  getAccountList() {

    return this.http.get<any>(this.uri + 'apipolicy/accountlist/' + this.customerinfo.customer_id_int, httpOptions).pipe(
      map((data) => {

        this.filterAccountIdAccounting = [];
        data.forEach((item: any) => {
          this.accountListArrByIdAsKey[item.account_id_int] = item;
          this.filterAccountIdAccounting.push({ name: item.account_title, value: item.account_id_int, "selected": false });
        });


        return data;
      }
      ),
      retry(1),
      catchError(this.handleError)
    );
  }

  manageaccountListArrByIdAsKey() {
    this.accountList.forEach((item: any) => {
      this.accountListArrByIdAsKey[item.account_id_int] = item;

    });
  }
  deleteAccount(account_id_int: Number, extraaction: string) {
    return this.http.delete<any>(this.uri + 'apipolicy/account/' + account_id_int + '/' + extraaction + '/' + this.customerinfo.logged_in_user_id_int + '/' + this.customerinfo.customer_id_int, httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  saveDataOfAccount(data: any) {
    data['customer_id_int'] = this.customerinfo.customer_id_int;
    data['logged_in_user_id_int'] = this.customerinfo.logged_in_user_id_int;
    return this.http.post<any>(this.uri + 'apipolicy/account', data, httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  // account end  
  //agent start

  filterAgentListAccodingtouserOrAgent(working_for_user_or_agent: any) {
    this.filteredListUserAgent = [];
    this.agentList.forEach((Element: any) => {
      if (Element.working_for_user_or_agent == working_for_user_or_agent) {
        this.filteredListUserAgent.push({ ...Element });
      }
    });
  }
  getAgentList() {
    return this.http.get<any>(this.uri + 'apipolicy/agentlist/' + this.customerinfo.customer_id_int, httpOptions).pipe(
      map((data) => {

        console.log(data);
        data.forEach((item: any) => {
          this.agentListArrByIdAsKey[item.agent_id_int] = item;

        });
        return data;
      }
      ),
      retry(1),
      catchError(this.handleError)
    );

  }
  deleteAgent(agent_id_int: Number, extraaction: string, UserOrAgent: string) {
    return this.http.delete<any>(this.uri + 'apipolicy/agent/' + agent_id_int + '/' + extraaction + '/' + UserOrAgent + '/' + this.customerinfo.logged_in_user_id_int + '/' + this.customerinfo.customer_id_int, httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }


  getAgentInfo(agent_id_int: number) {
    return this.http.get<any>(this.uri + 'apipolicy/agent/' + agent_id_int, httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );

  }
  saveDataOfAgent(data: any) {
    data['customer_id_int'] = this.customerinfo.customer_id_int;
    data['logged_in_user_id_int'] = this.customerinfo.logged_in_user_id_int;
    return this.http.post<any>(this.uri + 'apipolicy/agent', data, httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  //agent end



  //task start
  taskListArrByIdAsKey: any = [];
  getTaskList() {
    return this.http.get<any>(this.uri + 'apipolicy/tasklist/' + this.customerinfo.customer_id_int, httpOptions).pipe(
      map((data) => {


        data.forEach((item: any) => {
          this.taskListArrByIdAsKey[item.task_id_int] = item;

        });
        return data;
      }
      ),
      retry(1),
      catchError(this.handleError)
    );

  }
  deleteTask(task_id_int: Number) {
    return this.http.delete<any>(this.uri + 'apipolicy/task/' + task_id_int + '/' + this.customerinfo.logged_in_user_id_int + '/' + this.customerinfo.customer_id_int, httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getTaskInfo(task_id_int: number) {
    return this.http.get<any>(this.uri + 'apipolicy/task/' + task_id_int, httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );

  }
  saveDataOfTask(data: any) {
    data['customer_id_int'] = this.customerinfo.customer_id_int;
    data['logged_in_user_id_int'] = this.customerinfo.logged_in_user_id_int;
    return this.http.post<any>(this.uri + 'apipolicy/task', data, httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }


  ///  task end

  getInitialList() {
    return this.http.get<any>(this.uri + 'apipolicy/initialData', httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }


  message(obj: any) {
    this.presentToast(obj);
  }
  async presentToast(obj: any) {
    console.log(obj);
    const toast = await this.toastController.create({
      message: obj.message,
      duration: 3000,
      cssClass: obj.color == 'danger' ? 'danger-toast' : obj.color == 'warning' ? 'warning-toast' : obj.color == 'success' ? 'success-toast' : 'custom-toast',
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel'
        }
      ],
    });

    await toast.present();
  }



  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      console.log("Check your netwrok connectivity !");
      //   errorMessage = `Error: ${error.error.message}`;
    } else {
      console.log("Check your netwrok connectivity !");
      // server-side error 
      //  errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    errorMessage = "";
    return throwError(errorMessage);

  }
}
