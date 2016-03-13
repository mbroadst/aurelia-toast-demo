import {bindable, inject} from 'aurelia-framework';
import {ToastService} from './toast/toast-service';

@inject(ToastService)
export class App {
  @bindable options = {}

  constructor(toastService) {
    this.$toastService = toastService;
  }

  showToast() {
    if (!this.options.type) {
      console.log('invalid toast type');
      return;
    }

    this.$toastService[this.options.type](this.options);
  }

  clearToasts() { this.$toastService.clearAll(); }
  clearLastToast() { this.$toastService.clearLast(); }
}
