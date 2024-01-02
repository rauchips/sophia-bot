import { Injectable } from '@nestjs/common';

@Injectable()
export class MenuService {
  async menuRunner(method: string, args: string[]): Promise<string[]> {
    if (method === null) {
      return null;
    }

    return this[method](...args);
  }

  private pin(profilName: string, next: string): string[] {
    let menu: string[] = [];

    if (profilName) {
      menu = [
        this.pin.name,
        next,
        `Hi _${profilName}_, kindly click on the link and enter your pin number to proceed.`,
      ];
    }

    return menu;
  }
  private homeMenu(profilName: string, text: string = null): string[] {
    let menu: string[] = [
      this.homeMenu.name,
      'con',
      "👋 Hello!\nMy name is _Sophia_, your friendly Table Banking Companion! 💼💰 💁‍♀️ I'm here to make your table banking group's life easier and more efficient.\n\nTo start kindly select the options below: \n1. Table Banking 🏦\n2. Welfare 🤝\n3. G7 Family Tree 👨‍👩‍👧‍👧🌴\n4. Settings ⚙️\n5. Admin 🏛️\n0. Exit",
    ];

    if (profilName && text === null) {
      return menu;
    }

    switch (text) {
      case '1':
        menu = this.reports(profilName);
        break;
      case '2':
        menu = ['welfare', 'end', 'Here is the *WELFARE* menu.'];
        break;
      case '3':
        menu = this.familyTree(profilName);
        break;
      case '4':
        menu = ['settings', 'end', 'Here is the *SETTINGS* menu.'];
        break;
      case '5':
        menu = this.admin(profilName);
        //do this to trigger pin prompt before your specific menu
        //menu = this.pin(profilName, this.admin.name)
        break;
      case '0':
        menu = this.exit(profilName);
        break;
      default:
        // menu = [ this.homeMenu.name, 'end', 'Wrong pin, please enter your correct pin number.\nYour session has been cancelled kindly type *Hi Sophia* to start a new session.'];
        menu = this.default(this.homeMenu.name, menu);
        break;
    }

    return menu;
  }

  private familyTree(profilName: string): string[] {
    if (profilName) {
      return [
        this.familyTree.name,
        'end',
        'https://www.notion.so/rauchips/Table-Banking-System-Specification-12757d1296b443148b6a13771beb975c',
      ];
    }
  }

  private tableBanking(profilName: string, text: string = null): string[] {
    let menu: string[] = [
      this.tableBanking.name,
      'con',
      '1. Table Banking Monthly Fee ~ KES 500/=\n2. Loans\n3. Reports\n0. Exit',
    ];

    if (profilName && text === null) {
      return menu;
    }

    switch (text) {
      case '1':
        menu = this.monthlyFee(profilName);
        break;
      case '2':
        menu = this.loans(profilName);
        break;
      case '3':
        menu = this.reports(profilName);
        break;
      case '0':
        menu = this.exit(profilName);
        break;
      default:
        menu = this.default(this.tableBanking.name, menu);
        break;
    }

    return menu;
  }

  private monthlyFee(profilName: string, text: string = null): string[] {
    let menu: string[] = [
      this.monthlyFee.name,
      'con',
      '1. My Contribution Details\n2. Make Contribution\n0. Exit',
    ];

    if (profilName && text === null) {
      return menu;
    }

    switch (text) {
      case '1':
        menu = [
          'myContributionDetails',
          'end',
          'Here is my contribution details menu.',
        ];
        break;
      case '2':
        menu = [
          'makeContribution',
          'end',
          'Here is the make contribution menu.',
        ];
        break;
      case '0':
        menu = this.exit(profilName);
        break;
      default:
        menu = this.default(this.monthlyFee.name, menu);
        break;
    }

    return menu;
  }

  private loans(profilName: string, text: string = null): string[] {
    let menu: string[] = [
      this.loans.name,
      'con',
      '1. Loan Request\n2. Loan Repayment\n3. Loans Status\n0. Exit',
    ];

    if (profilName && text === null) {
      return menu;
    }

    switch (text) {
      case '1':
        menu = ['loanRequest', 'end', 'Here is loan request menu.'];
        break;
      case '2':
        menu = ['loanRepayment', 'end', 'Here is the loan repayment menu.'];
        break;
      case '3':
        menu = ['loanStatus', 'end', 'Here is the loan status menu.'];
        break;
      case '0':
        menu = this.exit(profilName);
        break;
      default:
        menu = this.default(this.loans.name, menu);
        break;
    }

    return menu;
  }

  private reports(profilName: string, text: string = null): string[] {
    let menu: string[] = [
      this.reports.name,
      'con',
      '1. Personal Reports\n2. Group Reports\n3. Set Monthly Report Reminder Date ~ _Give date of month eg. 15_\n0. Exit',
    ];

    if (profilName && text === null) {
      return menu;
    }

    switch (text) {
      case '1':
        menu = [
          'viewPersonalReports',
          'end',
          `Dear _${profilName}_ here is your *personal* generated report, click on the link below to view and interact with your data.\nhttps://sophia-core-txw28.ondigitalocean.app/reports/personal`,
        ];
        break;
      case '2':
        menu = [
          'viewGroupReports',
          'end',
          `Dear _${profilName}_ here is the G7 Nairobi Chapter's *group* generated report, click on the link below to view and interact with the data.\nhttps://sophia-core-txw28.ondigitalocean.app/reports/group`,
        ];
        break;
      case '3':
        menu = [
          'reportReminders',
          'end',
          'Here you can set the report reminder date.',
        ];
        break;
      case '0':
        menu = this.exit(profilName);
        break;
      default:
        menu = this.default(this.reports.name, menu);
        break;
    }

    return menu;
  }

  private exit(profilName: string): string[] {
    if (profilName) {
      return [
        this.exit.name,
        'end',
        'Thank you for interacting with _Sophia_.\nIf you need my help simply type *Hi Sophia*.\nSee you soon! 😊',
      ];
    }
  }

  private default(method: string, menu: string[]): string[] {
    let invalidTextMessage: string =
      '*Invalid input, kindly enter the correct options displayed below:*\n\n';
    invalidTextMessage += menu[2];

    if (method === 'homeMenu') {
      return [method, 'end', menu[2]];
    } else {
      return [method, 'con', invalidTextMessage];
    }
  }

  private admin(profilName: string, text: string = null): string[] {
    let menu: string[] = [
      this.admin.name,
      'con',
      '1. Upload M-Pesa Statement\n2. Send reminders to loanees\n3. Zoom Meeting\n0. Exit',
    ];

    if (profilName && text === null) {
      return menu;
    }

    switch (text) {
      case '1':
        menu = [
          'updloadPdf',
          'end',
          'Here the admin will be prompted to upload the M-Pesa Full Statement PDF.\nThis will be done on a monthly basis and *Sophia* will analyze the statement and update group and personal reports accordingly.',
        ];
        break;
      case '2':
        menu = [
          'sendReminders',
          'end',
          'Here the admin will be able to send reminders to all loan borrowers.\nFrom the reports *Sophia* will automatically be able to retrieve data of all members with pending loans per account and send them a reminder via whatsapp.',
        ];
        break;
      case '3':
        menu = [
          'zoomMeeting',
          'end',
          'Here is the admin will be able to send a zoom meeting link to all members and prior to the meeting, *Sophia* will send a notification reminder to all members via whatsapp to join the meeting.',
        ];
        break;
      case '0':
        menu = this.exit(profilName);
        break;
      default:
        menu = this.default(this.admin.name, menu);
        break;
    }

    return menu;
  }

  private wrongPin(profilName: string, text: string): string[] {
    if (profilName) {
      return [
        this.wrongPin.name,
        'end',
        `Hi _${text}_ , the pin you entered was invalid.\nPlease try again later with the correct pin.`,
      ];
    }
  }
}
