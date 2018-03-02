import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

interface IMenuItem {
  type: string,       // Possible values: link/dropDown/icon/separator/extLink
  name?: string,      // Used as display text for item and title for separator type
  state?: string,     // Router state
  icon?: string,      // Item icon name
  tooltip?: string,   // Tooltip text
  disabled?: boolean, // If true, item will not be appeared in sidenav.
  sub?: IChildItem[]  // Dropdown items
}
interface IChildItem {
  name: string,       // Display text
  state: string       // Router state
}

@Injectable()
export class NavigationService {
  constructor() {}

  defaultMenu:IMenuItem[] = [
    {
      name: 'DASHBOARD',
      type: 'link',
      tooltip: 'Dashboard',
      icon: 'dashboard',
      state: 'dashboard'
    },
    {
      name: 'PROJECTS',
      type: 'link',
      tooltip: 'Projects',
      icon: 'flight_takeoff',
      state: 'projects'
    },
    {
      name: 'CHAT',
      type: 'link',
      tooltip: 'Chat',
      icon: 'chat',
      state: 'chat'
    },
    {
      name: 'CALENDAR',
      type: 'link',
      tooltip: 'Calendar',
      icon: 'date_range',
      state: 'calendar'
    },
    {
      name: 'DIALOGS',
      type: 'dropDown',
      tooltip: 'Dialogs',
      icon: 'filter_none',
      state: 'dialogs',
      sub: [
        {name: 'CONFIRM', state: 'confirm'},
        {name: 'LOADER', state: 'loader'},
      ]
    },
    {
      name: 'MATERIAL',
      type: 'dropDown',
      tooltip: 'Material',
      icon: 'favorite',
      state: 'material',
      sub: [
        {name: 'BUTTONS', state: 'buttons'},
        {name: 'CARDS', state: 'cards'},
        {name: 'GRIDS', state: 'grids'},
        {name: 'LISTS', state: 'lists'},
        {name: 'MENU', state: 'menu'},
        {name: 'TABS', state: 'tabs'},
        {name: 'SELECT', state: 'select'},
        {name: 'RADIO', state: 'radio'},
        {name: 'AUTOCOMPLETE', state: 'autocomplete'},
        {name: 'SLIDER', state: 'slider'},
        {name: 'PROGRESS', state: 'progress'},
        {name: 'SNACKBAR', state: 'snackbar'},
      ]
    },
    {
      name: 'FORMS',
      type: 'dropDown',
      tooltip: 'Forms',
      icon: 'description',
      state: 'forms',
      sub: [
        {name: 'BASIC', state: 'basic'},
        {name: 'EDITOR', state: 'editor'},
        {name: 'UPLOAD', state: 'upload'},
        {name: 'WIZARD', state: 'wizard'}
      ]
    },
    {
      name: 'TABLES',
      type: 'dropDown',
      tooltip: 'Tables',
      icon: 'format_line_spacing',
      state: 'tables',
      sub: [
        {name: 'FULLSCREEN', state: 'fullscreen'},
        {name: 'PAGING', state: 'paging'},
        {name: 'FILTER', state: 'filter'},
      ]
    },
    {
      name: 'PROFILE',
      type: 'dropDown',
      tooltip: 'Profile',
      icon: 'person',
      state: 'profile',
      sub: [
        {name: 'OVERVIEW', state: 'overview'},
        {name: 'SETTINGS', state: 'settings'},
        {name: 'BLANK', state: 'blank'},
      ]
    },
    {
      name: 'TOUR',
      type: 'link',
      tooltip: 'Tour',
      icon: 'flight_takeoff',
      state: 'tour'
    },
    {
      name: 'MAP',
      type: 'link',
      tooltip: 'Map',
      icon: 'add_location',
      state: 'map'
    },
    {
      name: 'CHARTS',
      type: 'link',
      tooltip: 'Charts',
      icon: 'show_chart',
      state: 'charts'
    },
    {
      name: 'DND',
      type: 'link',
      tooltip: 'Drag and Drop',
      icon: 'adjust',
      state: 'dragndrop'
    },
    {
      name: 'SESSIONS',
      type: 'dropDown',
      tooltip: 'Pages',
      icon: 'view_carousel',
      state: 'sessions',
      sub: [
        {name: 'SIGNUP', state: 'signup'},
        {name: 'SIGNIN', state: 'signin'},
        {name: 'FORGOT', state: 'forgot-password'},
        {name: 'LOCKSCREEN', state: 'lockscreen'},
        {name: 'NOTFOUND', state: '404'},
        {name: 'ERROR', state: 'error'}
      ]
    },
    {
      name: 'OTHERS',
      type: 'dropDown',
      tooltip: 'Others',
      icon: 'blur_on',
      state: 'others',
      sub: [
        {name: 'GALLERY', state: 'gallery'},
        {name: 'PRICINGS', state: 'pricing'},
        {name: 'USERS', state: 'users'},
        {name: 'BLANK', state: 'blank'},
      ]
    },
    {
      name: 'MATICONS',
      type: 'link',
      tooltip: 'Material Icons',
      icon: 'store',
      state: 'icons'
    },
    {
      name: 'DOC',
      type: 'extLink',
      tooltip: 'Documentation',
      icon: 'library_books',
      state: 'http://egret-doc.mhrafi.com/'
    }
  ]
  separatorMenu:IMenuItem[] = [
    {
      type: 'separator',
      name: 'Custom components'
    },
    {
      name: 'DASHBOARD',
      type: 'link',
      tooltip: 'Dashboard',
      icon: 'dashboard',
      state: 'dashboard'
    },
    {
      name: 'INBOX',
      type: 'link',
      tooltip: 'Inbox',
      icon: 'inbox',
      state: 'inbox'
    },
    {
      name: 'CHAT',
      type: 'link',
      tooltip: 'Chat',
      icon: 'chat',
      state: 'chat'
    },
    {
      name: 'DIALOGS',
      type: 'dropDown',
      tooltip: 'Dialogs',
      icon: 'filter_none',
      state: 'dialogs',
      sub: [
        {name: 'CONFIRM', state: 'confirm'},
        {name: 'LOADER', state: 'loader'},
      ]
    },
    {
      name: 'PROFILE',
      type: 'dropDown',
      tooltip: 'Profile',
      icon: 'person',
      state: 'profile',
      sub: [
        {name: 'OVERVIEW', state: 'overview'},
        {name: 'SETTINGS', state: 'settings'},
        {name: 'BLANK', state: 'blank'},
      ]
    },
    {
      name: 'TOUR',
      type: 'link',
      tooltip: 'Tour',
      icon: 'flight_takeoff',
      state: 'tour'
    },
    {
      type: 'separator',
      name: 'Integrated components'
    },
    {
      name: 'CALENDAR',
      type: 'link',
      tooltip: 'Calendar',
      icon: 'date_range',
      state: 'calendar'
    },
    {
      name: 'MATERIAL',
      type: 'dropDown',
      tooltip: 'Material',
      icon: 'favorite',
      state: 'material',
      sub: [
        {name: 'BUTTONS', state: 'buttons'},
        {name: 'CARDS', state: 'cards'},
        {name: 'GRIDS', state: 'grids'},
        {name: 'LISTS', state: 'lists'},
        {name: 'MENU', state: 'menu'},
        {name: 'TABS', state: 'tabs'},
        {name: 'SELECT', state: 'select'},
        {name: 'RADIO', state: 'radio'},
        {name: 'AUTOCOMPLETE', state: 'autocomplete'},
        {name: 'SLIDER', state: 'slider'},
        {name: 'PROGRESS', state: 'progress'},
        {name: 'SNACKBAR', state: 'snackbar'},
      ]
    },
    {
      name: 'FORMS',
      type: 'dropDown',
      tooltip: 'Forms',
      icon: 'description',
      state: 'forms',
      sub: [
        {name: 'BASIC', state: 'basic'},
        {name: 'EDITOR', state: 'editor'},
        {name: 'UPLOAD', state: 'upload'},
        {name: 'WIZARD', state: 'wizard'}
      ]
    },
    {
      name: 'TABLES',
      type: 'dropDown',
      tooltip: 'Tables',
      icon: 'format_line_spacing',
      state: 'tables',
      sub: [
        {name: 'FULLSCREEN', state: 'fullscreen'},
        {name: 'PAGING', state: 'paging'},
        {name: 'FILTER', state: 'filter'},
      ]
    },
    {
      name: 'MAP',
      type: 'link',
      tooltip: 'Map',
      icon: 'add_location',
      state: 'map'
    },
    {
      name: 'CHARTS',
      type: 'link',
      tooltip: 'Charts',
      icon: 'show_chart',
      state: 'charts'
    },
    {
      name: 'DND',
      type: 'link',
      tooltip: 'Drag and Drop',
      icon: 'adjust',
      state: 'dragndrop'
    },
    {
      type: 'separator',
      name: 'Other components'
    },
    {
      name: 'SESSIONS',
      type: 'dropDown',
      tooltip: 'Pages',
      icon: 'view_carousel',
      state: 'sessions',
      sub: [
        {name: 'SIGNUP', state: 'signup'},
        {name: 'SIGNIN', state: 'signin'},
        {name: 'FORGOT', state: 'forgot-password'},
        {name: 'LOCKSCREEN', state: 'lockscreen'},
        {name: 'NOTFOUND', state: '404'},
        {name: 'ERROR', state: 'error'}
      ]
    },
    {
      name: 'OTHERS',
      type: 'dropDown',
      tooltip: 'Others',
      icon: 'blur_on',
      state: 'others',
      sub: [
        {name: 'GALLERY', state: 'gallery'},
        {name: 'PRICINGS', state: 'pricing'},
        {name: 'USERS', state: 'users'},
        {name: 'BLANK', state: 'blank'},
      ]
    },
    {
      name: 'MATICONS',
      type: 'link',
      tooltip: 'Material Icons',
      icon: 'store',
      state: 'icons'
    },
    {
      name: 'DOC',
      type: 'extLink',
      tooltip: 'Documentation',
      icon: 'library_books',
      state: 'http://egret-doc.mhrafi.com/'
    }
  ]
  iconMenu:IMenuItem[] = [
    {
      name: 'CHAT',
      type: 'icon',
      tooltip: 'Discuss',
      icon: 'chat',
      state: 'chat'
    },
    {
      name: 'PROFILE',
      type: 'icon',
      tooltip: 'Invoices',
      icon: 'description',
      state: 'profile/overview'
    },
    {
      name: 'TOUR',
      type: 'icon',
      tooltip: 'Flights',
      icon: 'flight_takeoff',
      state: 'tour'
    },
    {
      type: 'separator',
      name: 'Main Items'
    },
    {
      name: 'DASHBOARD',
      type: 'link',
      tooltip: 'Dashboard',
      icon: 'dashboard',
      state: 'dashboard'
    },
    {
      name: 'Projects',
      type: 'link',
      tooltip: 'Projects',
      icon: 'flight_takeoff',
      state: 'projects'
    },
    {
      name: 'PROFILE',
      type: 'dropDown',
      tooltip: 'Profile',
      icon: 'person',
      state: 'profile',
      sub: [
        {name: 'OVERVIEW', state: 'overview'},
        {name: 'SETTINGS', state: 'settings'},
        {name: 'BLANK', state: 'blank'},
      ]
    }
  ]

  // Icon menu TITLE at the very top of navigation.
  // This title will appear if any icon type item is present in menu.
  iconTypeMenuTitle:string = 'Deliverables Centre';
  // sets iconMenu as default;
  menuItems = new BehaviorSubject<IMenuItem[]>(this.iconMenu);
  // navigation component has subscribed to this Observable
  menuItems$ = this.menuItems.asObservable();

  // Customizer component uses this method to change menu.
  // You can remove this method and customizer component.
  // Or you can customize this method to supply different menu for
  // different user type.
  publishNavigationChange(menuType: string) {
    switch(menuType) {
      case 'separator-menu':
        this.menuItems.next(this.separatorMenu);
        break;
      case 'icon-menu':
        this.menuItems.next(this.iconMenu);
        break;
      default:
        this.menuItems.next(this.defaultMenu);
    }
  }
}