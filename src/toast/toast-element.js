import {bindable} from 'aurelia-framework';

export class ToastElement {
  @bindable type
  @bindable title
  @bindable message

  @bindable closeable
  @bindable clearable

  constructor() {}
  close() {
    console.log('close clicked');
  }
}
