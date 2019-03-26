import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  ButtonComponent,
  CardComponent,
  SectionHeadingComponent,
  SubSectionComponent,
} from './components';

const components = [ButtonComponent, CardComponent, SectionHeadingComponent, SubSectionComponent];

@NgModule({
  imports: [CommonModule],
  declarations: components,
  exports: components,
})
export class UiLibraryModule {}
