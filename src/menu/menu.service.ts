import { Injectable } from '@nestjs/common';

@Injectable()
export class MenuService {
  async menuRunner(method: string, args: string[]): Promise<string[]> {
    if (method === null) {
      return null
    }

    return this[method](...args);
  }

  private homeMenu(
    phoneNumber: string,
    text: string = null,
    verify: boolean = false,
  ): string[] {
    let menu: string[] = [
      this.homeMenu.name,
      'con',
      "👋 Hello!\nMy name is _Sophia_, your friendly Table Banking Assistant! 💼💰 💁‍♀️ I'm here to make your table banking group's life easier and more efficient.\n\nTo start kindly select the options below: \n1. View Family Tree 👨‍👩‍👧‍👧🌴\n2. Table Banking 🏦\n3. Welfare 🤝\n4. Admin 🏛️\n0. Exit"
    ];

    if (verify) {
      return [
        this.homeMenu.name,
        'con',
        `Hi _${text}_, kindly click on the link and enter your pin number to proceed.`,
      ];
    }

    if (phoneNumber === '254701093842' && text === '1234') {
      return menu;
    }

    switch (text) {
      case '1':
        menu = this.familyTree(phoneNumber);
        break;
      case '2':
        menu = this.tableBanking(phoneNumber);
        break;
      case '3':
        menu = ['welfare', 'end', 'Here is the welfare menu.'];
        break;
      case '4':
        menu = this.admin(phoneNumber);
        break;
      case '0':
        menu = this.exit(phoneNumber);
        break;
      default:
        menu = [ this.homeMenu.name, 'end', 'Wrong pin, please enter your correct pin number.\nYour session has been cancelled kindly type *Hi Sophia* to start a new session.'];
        menu = this.default(this.homeMenu.name, menu);
        break;
    }

    return menu;
  }

  private familyTree(phoneNumber: string): string[] {
    if (phoneNumber === '254701093842') {
      return [
        this.familyTree.name,
        'end',
        'Click on this link to view our G7 Nairobi Chapter Family Tree:\nhttps://65e4-105-163-0-118.ngrok-free.app/reports/group'
        //https://www.notion.so/rauchips/My-Portfolio-1412e4f90a7347818fd51ee6592a4251',
      ];
    }
  }

  private tableBanking(phoneNumber: string, text: string = null): string[] {
    let menu: string[] = [
      this.tableBanking.name,
      'con',
      '1. Table Banking Monthly Fee ~ KES 500/=\n2. Loans\n3. Reports\n0. Exit'
    ];

    if (phoneNumber === '254701093842' && text === null) {
      return menu;
    }

    switch (text) {
      case '1':
        menu = this.monthlyFee(phoneNumber);
        break;
      case '2':
        menu = this.loans(phoneNumber);
        break;
      case '3':
        menu = this.reports(phoneNumber);
        break;
      case '0':
        menu = this.exit(phoneNumber);
        break;
      default:
        menu = this.default(this.tableBanking.name, menu);
        break;
    }

    return menu;
  }

  private monthlyFee(
    phoneNumber: string,
    text: string = null,
  ): string[] {
    let menu: string[] = [
      this.monthlyFee.name,
      'con',
      '1. My Contribution Details\n2. Make Contribution\n0. Exit'
    ];

    if (phoneNumber === '254701093842' && text === null) {
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
        menu = ['makeContribution', 'end', 'Here is the make contribution menu.'];
        break;
      case '0':
        menu = this.exit(phoneNumber);
        break;
      default:
        menu = this.default(this.monthlyFee.name, menu);
        break;
    }

    return menu;
  }

  private loans(phoneNumber: string, text: string = null): string[] {
    let menu: string[] = [
      this.loans.name,
      'con',
      '1. Loan Request\n2. Loan Repayment\n3. Loans Status\n0. Exit'
    ];

    if (phoneNumber === '254701093842' && text === null) {
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
        menu = this.exit(phoneNumber);
        break;
      default:
        menu = this.default(this.loans.name, menu);
        break;
    }

    return menu;
  }

  private reports(phoneNumber: string, text: string = null): string[] {
    let menu: string[] = [
      this.reports.name,
      'con',
      '1. Personal Reports\n2. Group Reports\n3. Set Monthly Report Reminder Date ~ _Give date of month eg. 15_\n0. Exit'
    ];

    if (phoneNumber === '254701093842' && text === null) {
      return menu;
    }

    switch (text) {
      case '1':
        menu = ['viewPersonalReports', 'end', 'Here is the personal and group reports temporary link.\nhttps://65e4-105-163-0-118.ngrok-free.app/reports/personal'];
        break;
      case '2':
        menu = ['viewGroupReports', 'end', 'Here is the personal and group reports temporary link.\nhttps://65e4-105-163-0-118.ngrok-free.app/reports/group'];
        break;
      case '2':
        menu = ['reportReminders', 'end', 'Here you can set the report reminder date.'];
        break;
      case '0':
        menu = this.exit(phoneNumber);
        break;
      default:
        menu = this.default(this.reports.name, menu);
        break;
    }

    return menu;
  }

  private exit(phoneNumber: string): string[] {
    if (phoneNumber === '254701093842') {
      return [this.exit.name, 'end', 'Thank you for interacting with _Sophia_, see you soon! 😊'];
    }
  }

  private default(method: string, menu: string[]): string[] {
    let invalidTextMessage: string = '*Invalid input, kindly enter the correct options displayed below:*\n\n';
    invalidTextMessage += menu[2];

    if(method === 'homeMenu'){
      return [
        method,
        'end',
        menu[2]
      ];
    }
    else{
      return [
        method,
        'con',
        invalidTextMessage,
      ];
    }
  }

  private admin(phoneNumber: string, text: string = null): string[] {
    let menu: string[] = [
      this.admin.name,
      'con',
      '1. Upload M-Pesa Statement\n2. Send reminders to loanees\n3. Zoom Meeting\n0. Exit'
    ];

    if (phoneNumber === '254701093842' && text === null) {
      return menu;
    }

    switch (text) {
      case '1':
        menu = ['updloadPdf', 'end', 'Here the admin will be prompted to upload the M-Pesa Full Statement PDF.\nThis will be done on a monthly basis and *Sophia* will analyze the statement and update group and personal reports accordingly.'];
        break;
      case '2':
        menu = ['sendReminders', 'end', 'Here the admin will be able to send reminders to all loan borrowers.\nFrom the reports *Sophia* will automatically be able to retrieve data of all members with pending loans per account and send them a reminder via whatsapp.'];
        break;
      case '3':
        menu = ['zoomMeeting', 'end', 'Here is the admin will be able to send a zoom meeting link to all members and prior to the meeting, *Sophia* will send a notification reminder to all members via whatsapp to join the meeting.'];
        break;
      case '0':
        menu = this.exit(phoneNumber);
        break;
      default:
        menu = this.default(this.tableBanking.name, menu);
        break;
    }

    return menu;
  }
}
