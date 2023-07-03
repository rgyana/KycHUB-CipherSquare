import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ShowNullResultPipe } from './show-null-pipe/show-null-result.pipe';
import { PytFilterPipe } from '../pytCustTbl/pyt-tbl-pipe/pyt-filter.pipe';

@NgModule({
  declarations: [ShowNullResultPipe, PytFilterPipe],
  imports: [CommonModule],
  exports: [ShowNullResultPipe, PytFilterPipe],
  providers: [],
})
export class PipesModule {}
