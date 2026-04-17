import { Page, expect } from "@playwright/test"
import { NavigationPage } from "./navigationPage";
import { FormLayouts } from "./formLayouts";
import { DatePickerPage } from "./datePickerPage";

export class PageManager {
    private readonly page: Page
    private readonly navigationPage: NavigationPage
    private readonly formLayouts: FormLayouts
    private readonly datePickerPage: DatePickerPage

    constructor(page: Page) {
        this.page = page
        this.navigationPage = new NavigationPage(this.page)
        this.formLayouts = new FormLayouts(this.page)
        this.datePickerPage = new DatePickerPage(this.page)
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

}