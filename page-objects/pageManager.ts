import { Page } from "@playwright/test"
import { NavigationPage } from "./navigationPage";
import { FormLayouts } from "./formLayouts";
import { DatePickerPage } from "./datePickerPage";
import { SmartTablePage } from "./smartTablePage";

export class PageManager {
    private readonly page: Page
    private readonly navigationPage: NavigationPage
    private readonly formLayouts: FormLayouts
    private readonly datePickerPage: DatePickerPage
    private readonly smartTable: SmartTablePage

    constructor(page: Page) {
        this.page = page
        this.navigationPage = new NavigationPage(this.page)
        this.formLayouts = new FormLayouts(this.page)
        this.datePickerPage = new DatePickerPage(this.page)
        this.smartTable = new SmartTablePage(this.page)
    }

    navigateTo(): NavigationPage {
        return this.navigationPage
    }

    formLayoutsPage(): FormLayouts {
        return this.formLayouts
    }

    onDatePickerPage(): DatePickerPage {
        return this.datePickerPage
    }

    onSmartTablePage(): SmartTablePage {
        return this.smartTable
    }

}