import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestComponent } from '../components/test/test.component';

/**
 * You'll need to load all the components here in the constant.
 */

const components = [
  TestComponent
]

@NgModule({
  imports: [
    CommonModule,
    ...components
  ]
})
export class ViewComponentsModule { }
