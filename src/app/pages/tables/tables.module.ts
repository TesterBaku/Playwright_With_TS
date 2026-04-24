import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { TablesRoutingModule, routedComponents } from './tables-routing.module';
import { FsIconComponent } from './tree-grid/tree-grid.component';

@NgModule({
  imports: [
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    FormsModule,
    ThemeModule,
    TablesRoutingModule,
  ],
  declarations: [
    ...routedComponents,
    FsIconComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TablesModule { }
