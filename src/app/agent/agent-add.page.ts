import { Component, ElementRef, ViewChild, } from '@angular/core';
import { CommonService } from '../common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-agent',
  templateUrl: 'agent-add.html',
  styleUrls: ['agent-add.scss']
})
export class AgentAddPage {
  agentObj: any;
  agent_id_int: any = undefined;
  saveDataSub: any; getSub: any;
  bankList: any; organisation_typeList: any;
  agentDetailObj: any = { aadhaar: '', pancard: '', dob: '', imageArr: [], 'working_for_user_or_agent': '', 'serverpath': '', 'image_path': '', 'name': '', 'agent_id_int': 0, licenseArr: [] };
  working_for_user_or_agent: any = undefined;
  isOpenedAsModal: boolean = false;
  currentSegment: any = 'personal';
  stateList: any;
  @ViewChild('content') content !: ElementRef;
  moduleInfoList: any = { "apipath": "apipolicy/uploadAgentfiles", 'linebelowBrowsefile': 'Upload related documents !', 'module': 'User', "showPreview": false, "browseimagepath": 'assets/browsefile.png', 'multipleAllowed': true, "filetype": 'Any' };
  
 
  moduleInfo: any = {

    "apipath": "apipolicy/uploadfileAPI_agent_profile_image",
    "browseimagepath": 'https://ionicframework.com/docs/demos/api/avatar/avatar.svg',
    'multipleAllowed': false, 'linebelowBrowsefile': '', 'module': 'Agent', "showPreview": true,

    "filetype": 'Image'
  };
  licenseAddObj: any = { 'organisation_type': '', 'organisation': "", 'license_no': '', 'license_start_date': '', 'license_end_date': '' };
  constructor(private modalCtrl: ModalController,public CommonService: CommonService, private router: Router, private route: ActivatedRoute) {
    this.CommonService.showTabMenu = false; this.CommonService.loading = false;
  }
  ngOnInit() {
    this.stateList = this.CommonService.stateList;
    this.organisation_typeList = this.CommonService.organisation_typeList;
    this.bankList = this.CommonService.bankList;

    this.route.params.subscribe(paramsId => {
      this.agent_id_int = paramsId['agent_id_int'];

      if (!paramsId['working_for_user_or_agent']) { 
        this.working_for_user_or_agent = this.CommonService.openAgentModalFor;
        this.isOpenedAsModal = true;
      } else {
        this.working_for_user_or_agent = paramsId['working_for_user_or_agent'];
      }

      this.agentDetailObj = { aadhaar: '', pancard: '', dob: '', imageArr: [], 'working_for_user_or_agent': this.working_for_user_or_agent, 'serverpath': '', 'image_path': '', 'name': '', 'agent_id_int': 0, licenseArr: [] };

      if (this.agent_id_int) {
        this.agentDetailObj['agent_id_int'] = this.agent_id_int;
        if (this.CommonService.agentList) {
          this.getAgentInfo();
        } else {
          this.getAgentList();
        }
      } else {
        this.showLicenceform = true;
      }
    });

  }
  dismissComponentAsModal() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
  SaveComponentAsModal(){
    setTimeout(()=>{
      return this.modalCtrl.dismiss(null, 'confirm'); 
    },1000);
    
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
  udatedmoduleInfo: any = { 'image_path': undefined, serverpath: undefined };
  updateImageInfoFun(udatedmoduleInfo: any) {

    this.udatedmoduleInfo['image_path'] = udatedmoduleInfo['image_path'];
    this.udatedmoduleInfo['serverpath'] = udatedmoduleInfo['serverpath'];
  }
  showLicenceform = false;
  getAgentInfo() {

    this.CommonService.agentList.every((item: any) => {
      if (item.agent_id_int == this.agent_id_int) {
        this.agentDetailObj = item;
        this.udatedmoduleInfo = { 'image_path': undefined, serverpath: undefined };
        if (this.agentDetailObj.licenseArr.length == 0) {
          this.showLicenceform = true;
        } else {
          this.showLicenceform = false;
        }
        this.moduleInfo['image_path'] = item['image_path'];
        this.moduleInfo['serverpath'] = item['serverpath'];
        return false;
      }
      return true;
    });

  }
  assignOrganisationWithCondition(organisation_type: any) {
    if (organisation_type != 'Bank') {
      this.licenseAddObj.organisation = organisation_type;
    }
  }
  segmentChange(events: any) {
    this.currentSegment = events.detail.value;
  }

  saveDataOfAgent() {
    if (!this.agentDetailObj.mobile || !this.agentDetailObj.name) {
      this.CommonService.message({ 'message': "Fill Required Fields !", color: 'warning' });

    } else {
      if (this.udatedmoduleInfo['image_path']) {

        this.agentDetailObj['image_path'] = this.udatedmoduleInfo['image_path'];
        this.agentDetailObj['serverpath'] = this.udatedmoduleInfo['serverpath'];
      }
      this.CommonService.loading = true;
      this.saveDataSub = this.CommonService.saveDataOfAgent(this.agentDetailObj).subscribe((data: any) => {
        this.CommonService.loading = false;

        if (data.status) {
          this.CommonService.agentList = data.AgentList;
          this.CommonService.filterAgentListAccodingtouserOrAgent(this.working_for_user_or_agent);

          this.CommonService.message({ 'message': data.message, color: 'success' });
          if(this.isOpenedAsModal){
             
            this.SaveComponentAsModal();
          }else{

          
          if (this.CommonService.agentLastPage == 'Detail') {
            this.router.navigate(['tabs/agents/agentdetail/' + this.working_for_user_or_agent + '/' + this.agent_id_int]);
          } else {
            this.router.navigate(['tabs/agents/' + this.working_for_user_or_agent]);
          }}

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
    } if (this.deleteFileDataSub) {
      this.deleteFileDataSub.unsubscribe();
    }


  }
  addLicenseNumbers() {
    if (this.licenseAddObj.organisation_type == '' || this.licenseAddObj.organisation == '' || this.licenseAddObj.license_no == '' || this.licenseAddObj.license_start_date == '' || this.licenseAddObj.license_end_date == '') {
      this.CommonService.message({ 'message': "If you want to add license details then you need to fill all required fields !", color: 'warning' })
    } else {
      this.agentDetailObj.licenseArr.push({
        ...this.licenseAddObj
      });
      this.licenseAddObj = { 'organisation_type': '', 'organisation': "", 'license_no': '', 'license_start_date': '', 'license_end_date': '' };
      this.scrollToBottom();
    }
    if (this.agentDetailObj.licenseArr.length == 0) {
      this.showLicenceform = true;
    } else {
      this.showLicenceform = false;
    }
  }
  deleteLicense(index: number) {
    if (confirm('Are you sure you want to delete this License Details ?')) {
      this.agentDetailObj.licenseArr.splice(this.agentDetailObj.licenseArr.length - 1 - index, 1);
      if (this.agentDetailObj.licenseArr.length == 0) {
        this.showLicenceform = true;
      } else {
        this.showLicenceform = false;
      }
    }
  }
  scrollToBottom = () => {
    try {

      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    } catch (err) { }
  }
  ///image list work
  viewDoc(filedetails: any) {
    window.open(filedetails.serverpath + filedetails.filepath, "_blank");
  }
  deleteFileDataSub: any;
  updateImageInfoFunList(udatedmoduleInfo: any) {
    udatedmoduleInfo.imagePathArr.forEach((element: any) => {
      this.agentDetailObj['imageArr'].push({ ...element });

    });
  } deleteFile(filedetail: any, i: number) {
    this.CommonService.loading = true;

    this.deleteFileDataSub = this.CommonService.deleteFile(filedetail.filepath).subscribe((data: any) => {
      this.CommonService.loading = false;


      if (data.status) {
        let t: any = [];
        this.agentDetailObj.imageArr.forEach((item: any) => {
          if (item.filepath != filedetail.filepath) {
            t.push({ ...item });
          }
        });
        this.agentDetailObj.imageArr = t;

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
