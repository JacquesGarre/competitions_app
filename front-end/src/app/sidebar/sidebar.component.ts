import { Component, OnInit } from '@angular/core';
import {
    faTachometerAlt,
    faLaughWink,
    faCog,
    faCogs,
    faWrench,
    faFolder,
    faChartArea,
    faTable,
    faBars,
    faSearch,
    faBell,
    faFileAlt,
    faDonate,
    faExclamationTriangle,
    faEnvelope,
    faUser,
    faList,
    faSignOutAlt,
    faDownload,
    faCalendar,
    faDollarSign,
    faClipboardList,
    faComments,
    faEllipsisV,
    faCircle,
    faAngleUp,
    faChevronLeft,
    faChevronRight,
    IconName,
    faTrophy,
    faSitemap,
    faGem,
    faObjectUngroup,
    faHome,
    faTableTennis
} from '@fortawesome/free-solid-svg-icons';
import { TokenStorageService } from '../_services/token-storage.service';
import { Env } from '../_globals/env';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

    faGem = faGem;
    faSitemap = faSitemap;
    faTachometerAlt = faTachometerAlt;
    faLaughWink = faLaughWink;
    faCog = faCog;
    faCogs = faCogs;
    faWrench = faWrench;
    faFolder = faFolder;
    faUser = faUser;
    faChartArea = faChartArea;
    faTable = faTable;
    faBars = faBars;
    faSearch = faSearch;
    faBell = faBell;
    faFileAlt = faFileAlt;
    faDonate = faDonate;
    faExclamationTriangle = faExclamationTriangle;
    faEnvelope = faEnvelope;
    faList = faList;
    faSignOutAlt = faSignOutAlt;
    faDownload = faDownload;
    faCalendar = faCalendar;
    faDollarSign = faDollarSign;
    faClipboardList = faClipboardList;
    faComments = faComments;
    faEllipsisV = faEllipsisV;
    faCircle = faCircle;
    faAngleUp = faAngleUp;
    faChevronLeft = faChevronLeft;
    faChevronRight = faChevronRight;
    faTrophy = faTrophy;
    faObjectUngroup = faObjectUngroup;
    faHome = faHome;
    faTableTennis = faTableTennis;

    private roles: string[] = [];
    isLoggedIn = false;
    showAdminBoard = false;
    showModeratorBoard = false;
    showUserBoard = false;
    username?: string;

    appName: string = Env.APP_NAME;
  
    constructor(private tokenStorageService: TokenStorageService) { }
  
    ngOnInit(): void {
      this.isLoggedIn = !!this.tokenStorageService.getToken();
  
      if (this.isLoggedIn) {
        const user = this.tokenStorageService.getUser();
  
        this.roles = user.roles;
        this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
        this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');
        this.showUserBoard = this.roles.includes('ROLE_USER') && !this.roles.includes('ROLE_ADMIN');
        this.username = user.username;
        
      }
    }

}
