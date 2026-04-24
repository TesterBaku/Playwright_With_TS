import { Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class NavigationPage extends HelperBase {

    constructor(page: Page) {
        super(page)
    }

    async formLayoutsPage() {
        await this.selectGroupMenuItem('Forms')
        await this.page.getByText('Form Layouts').click();
        await this.page.waitForURL('**/forms/layouts')
    }

    async datepickerPage() {
        await this.selectGroupMenuItem('Forms')
        await this.page.getByText('Datepicker').click();
    }

    async smartTablePage() {
        await this.selectGroupMenuItem('Tables & Data')
        await this.page.getByText('Smart Table').click();
    }

    async treeGridPage() {
        await this.selectGroupMenuItem('Tables & Data')
        await this.page.getByText('Tree Grid').click();
        await this.page.waitForURL('**/tables/tree-grid')
    }

    async dialogPage() {
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.page.getByText('Dialog').click();
        await this.page.waitForURL('**/modal-overlays/dialog')
    }

    async windowPage() {
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.page.getByText('Window').click();
        await this.page.waitForURL('**/modal-overlays/window')
    }

    async popoverPage() {
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.page.getByText('Popover').click();
        await this.page.waitForURL('**/modal-overlays/popover')
    }

    async toastrPage() {
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.page.getByText('Toastr').click();
    }

    async tooltipPage() {
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.page.getByText('Tooltip').click();
    }

    async calendarPage() {
        await this.selectGroupMenuItem('Extra Components')
        await this.page.getByText('Calendar').click();
        await this.page.waitForURL('**/extra-components/calendar')
    }

    async dashboardPage() {
        await this.page.getByTitle('IoT Dashboard').click();
        await this.page.waitForURL('**/iot-dashboard')
    }

    async chartsPage() {
        await this.selectGroupMenuItem('Charts')
        await this.page.getByText('Echarts').click();
        await this.page.waitForURL('**/charts/echarts')
    }

    private async selectGroupMenuItem(groupItemTitle: string) {
        const groupMenuItem = this.page.getByTitle(groupItemTitle, { exact: true })
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        if (expandedState == "false") {
            await groupMenuItem.click()
        }
    }
}
