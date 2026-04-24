import { Page } from "@playwright/test"
import { NavigationPage } from "./navigationPage";
import { FormLayouts } from "./formLayouts";
import { DatePickerPage } from "./datePickerPage";
import { SmartTablePage } from "./smartTablePage";
import { DialogPage } from "./dialogPage";
import { ToastrPage } from "./toastrPage";
import { WindowPage } from "./windowPage";
import { TooltipPage } from "./tooltipPage";
import { PopoverPage } from "./popoverPage";
import { CalendarPage } from "./calendarPage";
import { TreeGridPage } from "./treeGridPage";

export class PageManager {
    private readonly page: Page
    private readonly navigationPage: NavigationPage
    private readonly formLayouts: FormLayouts
    private readonly datePickerPage: DatePickerPage
    private readonly smartTable: SmartTablePage
    private readonly dialog: DialogPage
    private readonly toastr: ToastrPage
    private readonly window: WindowPage
    private readonly tooltip: TooltipPage
    private readonly popover: PopoverPage
    private readonly calendar: CalendarPage
    private readonly treeGrid: TreeGridPage

    constructor(page: Page) {
        this.page = page
        this.navigationPage = new NavigationPage(this.page)
        this.formLayouts = new FormLayouts(this.page)
        this.datePickerPage = new DatePickerPage(this.page)
        this.smartTable = new SmartTablePage(this.page)
        this.dialog = new DialogPage(this.page)
        this.toastr = new ToastrPage(this.page)
        this.window = new WindowPage(this.page)
        this.tooltip = new TooltipPage(this.page)
        this.popover = new PopoverPage(this.page)
        this.calendar = new CalendarPage(this.page)
        this.treeGrid = new TreeGridPage(this.page)
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

    onDialogPage(): DialogPage {
        return this.dialog
    }

    onToastrPage(): ToastrPage {
        return this.toastr
    }

    onWindowPage(): WindowPage {
        return this.window
    }

    onTooltipPage(): TooltipPage {
        return this.tooltip
    }

    onPopoverPage(): PopoverPage {
        return this.popover
    }

    onCalendarPage(): CalendarPage {
        return this.calendar
    }

    onTreeGridPage(): TreeGridPage {
        return this.treeGrid
    }
}
