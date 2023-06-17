import { Component, ElementRef, ViewChild, } from '@angular/core';
import { CommonService } from '../common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-agent-detail',
  templateUrl: 'agent-detail.page.html',
  styleUrls: ['agent-detail.page.scss']
})
export class AgentDetailPage {
  agentObj: any;
  agent_id_int: any = undefined;
  bankList: any; organisation_typeList: any;
  agentDetailObj: any = { dob: '', aadhaar: '', pancard: '', 'serverpath': '', 'image_path': '', 'name': '', 'agent_id_int': 0, licenseArr: [] };
  moduleInfoList: any = { "apipath": "apipolicy/uploadAgentfiles", 'linebelowBrowsefile': 'Upload related documents !', 'module': 'User', "showPreview": false, "browseimagepath": 'assets/browsefile.png', 'multipleAllowed': true, "filetype": 'Any' };
  public actionSheetButtons: any;
  moduleInfo: any = {
"style":"margin-left: 20px;margin-top: 10px;",
    "apipath": "apipolicy/uploadfileAPI_agent_profile_image",
    "browseimagepath": 'https://ionicframework.com/docs/demos/api/avatar/avatar.svg',
    'multipleAllowed': false, 'linebelowBrowsefile': '', 'module': 'Agent', "showPreview": true,

    "filetype": 'Image'
  };
  stateList: any;
  working_for_user_or_agent: any = undefined;


  licenseAddObj: any = { 'organisation_type': '', 'organisation': "", 'license_no': '', 'license_start_date': '', 'license_end_date': '' };
  getSub: any;
  deleteSub: any;
  tileList: any = undefined;
  constructor(private actionSheetCtrl: ActionSheetController, public CommonService: CommonService, private router: Router, private route: ActivatedRoute) {
    this.CommonService.showTabMenu = false; this.CommonService.loading = false;
  }
  ngOnInit() {
    this.stateList = this.CommonService.stateList;
    this.organisation_typeList = this.CommonService.organisation_typeList;
    this.bankList = this.CommonService.bankList;

    this.route.params.subscribe(paramsId => {
      this.working_for_user_or_agent = paramsId['working_for_user_or_agent'];
      if (this.working_for_user_or_agent == 'Agent') {
        this.tileList = this.CommonService.agentTileList;
      } else {
        this.tileList = this.CommonService.userTileList;
      }
      this.agent_id_int = paramsId['agent_id_int'];
      this.agentDetailObj['agent_id_int'] = this.agent_id_int;
      if (this.agent_id_int) {
        if (this.CommonService.agentList) {
          this.getAgentInfo();
        } else {
          this.getAgentList();
        }
      }
    });

  }
  redirectUserAgentToAccount() {
    this.router.navigate(['tabs/accounts/Account/' + this.working_for_user_or_agent + '/' + this.agent_id_int]);

  }
  redirectUserAgentToPolicies() {
    this.router.navigate(['tabs/accounts/Policy/' + this.working_for_user_or_agent + '/' + this.agent_id_int]);

  }
  
  getAgentList() {

    this.CommonService.loading = true;
    this.getSub = this.CommonService.getAgentList().subscribe((data: any) => {
      this.CommonService.loading = false;

      this.CommonService.agentList = data;
      this.getAgentInfo();
    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong" })
    });
  }
  viewDoc(filedetails: any) {
    window.open(filedetails.serverpath + filedetails.filepath, "_blank");
  }

  getAgentInfo() {

    this.CommonService.agentList.every((item: any) => {
      if (item.agent_id_int == this.agent_id_int) {
        this.agentDetailObj = item;
        this.moduleInfo['image_path'] = item['image_path'];
        this.moduleInfo['serverpath'] = item['serverpath'];
        
        return false;
      }
      return true;
    });


  }
  ngOnDestroy() {
    if (this.getSub) {
      this.getSub.unsubscribe();
    } if (this.deleteSub) {
      this.deleteSub.unsubscribe();
    } if (this.saveDataSub) {
      this.saveDataSub.unsubscribe();
    } if (this.deleteFileDataSub) {
      this.deleteFileDataSub.unsubscribe();
    }
  }

  editAgent(agent_id_int: Number) {
    this.CommonService.agentLastPage = 'Detail';
    this.router.navigate(['tabs/agents/agentedit/' + this.working_for_user_or_agent + '/' + agent_id_int]);
  }

  deleteAgent(agent_id_int: Number, extraaction: string) {
    if (confirm("Are you sure you want to delete this data ?")) {
      this.CommonService.loading = true;
      this.deleteSub = this.CommonService.deleteAgent(agent_id_int, extraaction, this.working_for_user_or_agent).subscribe((data: any) => {
        this.CommonService.loading = false;
        if (data.status) {

          this.CommonService.agentList = data.AgentList;
          this.CommonService.filterAgentListAccodingtouserOrAgent(this.working_for_user_or_agent);

          this.CommonService.accountList = undefined;
          this.CommonService.policyList = undefined;
          if (this.working_for_user_or_agent == 'Agent') {
            this.CommonService.taskList = undefined;
          }
          this.CommonService.message({ 'message': data.message, color: 'success' });
          this.router.navigate(['tabs/agents/' + this.working_for_user_or_agent]);
        } else {
          this.CommonService.message({ 'message': data.message, color: 'danger' })
        }
      }, (err: any) => {
        this.CommonService.loading = false;
        this.CommonService.message({ 'message': "Something is wrong" })
      });
    }
  }
  async deleteAgentActionSheet(agent_id_int: Number) {
    let headertext;
    if (this.working_for_user_or_agent == 'Agent') {
      headertext = "Please confirm following points before deleting Agent !";

      this.actionSheetButtons = [
        {
          text: 'Assign Agent tasks to me before deleting !',
          handler: () => {
            this.deleteAgent(agent_id_int, 'assignTaskToMe');
          },
          data: {
            action: 'delete',
          },
        },
        {
          text: 'Delete Agent tasks as well !',
          handler: () => {
            this.deleteAgent(agent_id_int, 'deleteTaskAsWell');
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
    } else {
      headertext = "Please confirm following points before deleting User !";

      this.actionSheetButtons = [
        {
          text: 'Assign his Accounts and Policies to me !',
          handler: () => {
            this.deleteAgent(agent_id_int, 'assignAccountPoliciesToMe');
          },
          data: {
            action: 'delete',
          },
        }, {
          text: 'Delete Users Accounts and Policies as well !',
          handler: () => {
            this.deleteAgent(agent_id_int, 'deleteAccountPoliciesAsWell');
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

    }

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
        if (perCol.functionName == 'showLicense') {
          this.showLicense();
        }
        if (perCol.functionName == 'redirectToHistasks') {
          this.redirectToHistasks();
        }
        if (perCol.functionName == 'redirectUserAgentToAccount') {
          this.redirectUserAgentToAccount();
        }
        if (perCol.functionName == 'redirectUserAgentToPolicies') {
          this.redirectUserAgentToPolicies();
        }
      }
    }

  }
  showLicense() {

  }
  redirectToHistasks() {
    this.router.navigate(['../../../../tasks/Agent/' + this.agent_id_int]);
  }
  //


  updateImageInfoFun(udatedmoduleInfo: any) {

    this.agentDetailObj['image_path'] = udatedmoduleInfo['image_path'];
    this.agentDetailObj['serverpath'] = udatedmoduleInfo['serverpath'];
    this.saveDataOfAgent(this.agentDetailObj);

  }


  updateImageInfoFunList(udatedmoduleInfo: any, agentDetailObj: any) {
    udatedmoduleInfo.imagePathArr.forEach((element: any) => {
      agentDetailObj['imageArr'].push({ ...element });
    });

    this.saveDataOfAgent(agentDetailObj);
  }
  saveDataSub: any; deleteFileDataSub: any;
  saveDataOfAgent(agentDetailObj: any) {



    this.CommonService.loading = true;
    this.saveDataSub = this.CommonService.saveDataOfAgent(agentDetailObj).subscribe((data: any) => {
      this.CommonService.loading = false;

      if (data.status) {
        this.CommonService.agentList = data.AgentList;      this.CommonService.filterAgentListAccodingtouserOrAgent(this.working_for_user_or_agent);

      } else {
        this.CommonService.message({ 'message': data.message, color: 'danger' })
      }

    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong", color: 'danger' })
    });

  }
  deleteFile(filedetail: any, i: number, agentDetailObj: any) {

    this.deleteFileDataSub = this.CommonService.deleteFile(filedetail.filepath).subscribe((data: any) => {

      if (data.status) {
        let t: any = [];
        agentDetailObj.imageArr.forEach((item: any) => {
          if (item.filepath != filedetail.filepath) {
            t.push({ ...item });
          }
        });
        agentDetailObj.imageArr = t;
        this.saveDataOfAgent(agentDetailObj);
      } else {
        this.CommonService.message({ 'message': data.message, color: 'danger' })
      }

    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong", color: 'danger' })
    });
  }
}
