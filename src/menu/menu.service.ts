import { Injectable } from '@nestjs/common';

@Injectable()
export class MenuService {
    menuRunner(method: string, phoneNumber: string, response: string = null): string[]{
        let menu: string[] = [];

        switch (method) {
            case 'homeMenu':
                menu = this.homeMenu(phoneNumber, response);
                break;
            case 'familyTree':
                menu = this.familyTree(phoneNumber);
                break;
            case 'tableBanking':
                menu = this.tableBanking(phoneNumber, response);
                break;
            case 'monthlyContribution':
                menu = this.monthlyContribution(phoneNumber, response);
                break;
            case 'loans':
                menu = this.loans(phoneNumber, response);
                break;
            case 'reports':
                menu = this.reports(phoneNumber, response);
                break;
            default:
                menu = [this.menuRunner.name ,'This is when you pass invalid arguments' + this.menuRunner.name];
                break;
        }

        return menu;
    }

    private homeMenu(phoneNumber: string, response: string = null): string[] {
        let menu: string[] = [];

        if(phoneNumber === '254701093842' && response === 'Hi Sophia'){
            menu[0] = this.homeMenu.name;
            menu[1] = '1. View Family Tree\n2. Table Banking\n3. Welfare\n0. Exit';

            return menu;
        }

        switch (response) {
            case '1':
                menu = this.familyTree(phoneNumber);
                break;
            case '2':
                menu = this.tableBanking(phoneNumber);
                break;
            case '3':
                menu = ['welfare', 'Here is the welfare menu.'];
                break;
            case '0':
                menu = ['exit', 'Here is the exit menu.' + this.homeMenu.name];
                break;
            default:
                menu = [ this.homeMenu.name, 'This is when you pass invalid arguments ' + this.homeMenu.name];
                break;
        }

        return menu;
    }

    private familyTree(phoneNumber: string): string[] {
        if(phoneNumber === '254701093842'){
           return [
                this.familyTree.name,
                'Click on this link to view our G7 Nairobi Chapter Family Tree: https://www.notion.so/rauchips/My-Portfolio-1412e4f90a7347818fd51ee6592a4251'
            ];
        }
    }

    private tableBanking(phoneNumber: string, response: string = null): string[] {
        let menu: string[] = [];

        if(phoneNumber === '254701093842' && response === null){
            menu[0] = this.tableBanking.name;
            menu[1] = '1. Monthly Contribution ~ KES 500/=\n2. Loans\n3. Reports\n0. Exit';
            return menu;
        }

        switch (response) {
            case '1':
                menu = this.monthlyContribution(phoneNumber);
                break;
            case '2':
                menu = this.loans(phoneNumber, response);
                break;
            case '3':
                menu = this.reports(phoneNumber, response);
                break;
            case '0':
                menu = ['exit', 'Here is the exit menu.' + this.tableBanking.name];
                break;
            default:
                menu = ['deafault', 'This is when you pass invalid arguments' + this.tableBanking.name];
                break;
        }

        return menu;
    }

    private monthlyContribution(phoneNumber: string, response: string = null): string[] {
        let menu: string[] = [];

        if(phoneNumber === '254701093842' && response === null){
            menu[0] = this.monthlyContribution.name;
            menu[1] = '1. My Contribution Details\n2. Make Contribution\n0. Exit';
            return menu;
        }

        switch (response) {
            case '1':
                menu = ['myContributionDetails', 'Here is my contribution details menu.'];
                break;
            case '2':
                menu = ['makeContribution', 'Here is the make contribution menu.'];
                break;
            case '0':
                menu = ['exit', 'Here is the exit menu.' + this.monthlyContribution.name];
                break;
            default:
                menu = ['default', 'This is when you pass invalid arguments' + this.monthlyContribution.name];
                break;
        }

        return menu;
    }

    private loans(phoneNumber: string, response: string = null): string[] {
        let menu: string[] = [];

        if(phoneNumber === '254701093842' && response === null){
            menu[0] = this.loans.name;
            menu[1] = '1. Loan Request\n2. Loan Repayment\n3. Loan Repayment Reminders\n4. Loans Status\n0. Exit';
            return menu;
        }

        switch (response) {
            case '1':
                menu = ['loanRequest', 'Here is loan request menu.'];
                break;
            case '2':
                menu = ['loanRepayment', 'Here is the loan repayment menu.'];
                break;
            case '3':
                menu = ['loanRepaymentReminder', 'Here is the loan repayment reminder menu.'];
                break;
            case '4':
                menu = ['loanStatus', 'Here is the loan status menu.'];
                break;
            case '0':
                menu = ['exit', 'Here is the exit menu.' + this.loans.name];
                break;
            default:
                menu = ['default', 'This is when you pass invalid arguments' + this.loans.name];
                break;
        }

        return menu;
    }

    private reports(phoneNumber: string, response: string = null): string[] {
        let menu: string[] = [];

        if(phoneNumber === '254701093842' && response === null){
            menu[0] = this.reports.name;
            menu[1] = '1. Personal\n2. Group\n0. Exit';
            return menu;
        }

        switch (response) {
            case '1':
                menu = ['personalReports', 'Here is the personal reports menu.'];
                break;
            case '2':
                menu = ['groupReports', 'Here is the group reports menu.'];
                break;
            case '0':
                menu = ['exit', 'Here is the exit menu.' + this.reports.name];
                break;
            default:
                menu = ['default', 'This is when you pass invalid arguments' + this.reports.name];
                break;
        }

        return menu;
    }
}
