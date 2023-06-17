import { Component } from '@angular/core';
import { CommonService } from '../common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-agent',
  templateUrl: 'agent.page.html',
  styleUrls: ['agent.page.scss']
})
export class AgentPage {
  public actionSheetButtons: any;
  getSub: any;
  working_for_user_or_agent: any = undefined;
  deleteSub: any;


  constructor(private actionSheetCtrl: ActionSheetController, public CommonService: CommonService, private router: Router, private route: ActivatedRoute) {
    this.CommonService.showTabMenu = false; this.CommonService.loading = false;
  }
  ngOnInit() {

    this.route.params.subscribe(paramsId => {
      this.working_for_user_or_agent = paramsId['working_for_user_or_agent'];
    });



    if (!this.CommonService.agentList || this.CommonService.agentList.length == 0) {
      this.getAgentList();
    }
    else {

      this.CommonService.filterAgentListAccodingtouserOrAgent(this.working_for_user_or_agent);

    }
    this.CommonService.agentLastPage = 'List';

  }



  getAgentList() {

    this.CommonService.loading = true;
    this.getSub = this.CommonService.getAgentList().subscribe((data: any) => {
      this.CommonService.loading = false;
      this.CommonService.agentList = data;
      this.CommonService.filterAgentListAccodingtouserOrAgent(this.working_for_user_or_agent);

    }, (err: any) => {
      this.CommonService.loading = false;
      this.CommonService.message({ 'message': "Something is wrong" })
    });
  }


  ngOnDestroy() {
    if (this.getSub) {
      this.getSub.unsubscribe();
    } if (this.deleteSub) {
      this.deleteSub.unsubscribe();
    }
  }
  editAgent(agent_id_int: Number) {
    this.CommonService.agentLastPage = 'List';

    this.router.navigate(['tabs/agents/agentedit/' + this.working_for_user_or_agent + '/' + agent_id_int]);
  }
  viewAgent(agent_id_int: Number) {
    this.router.navigate(['tabs/agents/agentdetail/' + this.working_for_user_or_agent + '/' + agent_id_int]);
  }
  deleteAgent(agent_id_int: Number, extraaction: string) {
    if (confirm("Are you sure you want to delete this data ?")) {
      this.CommonService.loading = true;
      this.deleteSub = this.CommonService.deleteAgent(agent_id_int, extraaction, this.working_for_user_or_agent).subscribe((data: any) => {
        this.CommonService.loading = false;
        if (data.status) {

          this.CommonService.agentList = data.AgentList;
          this.CommonService.filterAgentListAccodingtouserOrAgent(this.working_for_user_or_agent);
          if (this.working_for_user_or_agent == 'User') {
            this.CommonService.accountList = undefined;
            this.CommonService.policyList = undefined;

          } else if (this.working_for_user_or_agent == 'Agent') {
            this.CommonService.taskList = undefined;
          }

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

  async deleteAgentActionSheet(agent_id_int: Number) {
    let headertext ;
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
          text: 'Assign his accounts/policies to me !',
          handler: () => {
            this.deleteAgent(agent_id_int, 'assignAccountPoliciesToMe');
          },
          data: {
            action: 'delete',
          },
        }, {
          text: 'Delete Users accounts/policies as well !',
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
}
