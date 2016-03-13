import {ViewSlot} from 'aurelia-framework';
import {getViewModel, invokeLifecycle} from './toast-utilities';

export class ToastRenderer {
  toastContainers = new Map();

  constructor() {}
  render(controller, options) {
    // this._mixinControllerMethods(controller);
    let viewSlot = this._createToastContainer(options);
    controller.view.bind(options);
    viewSlot.add(controller.view);
  }

  _createToastContainer(options) {
    let position = options.position;
    if (this.toastContainers.has(position)) {
      return this.toastContainers.get(position);
    }

    let containerElement = document.createElement('div');
    containerElement.id = 'toast-container';
    containerElement.classList.add(options.position);
    containerElement.setAttribute('aria-live', 'polite');
    containerElement.setAttribute('role', 'alert');
    document.body.insertBefore(containerElement, document.body.firstChild);
    let toastContainerViewSlot = new ViewSlot(containerElement, true);
    this.toastContainers.set(position, toastContainerViewSlot);
    return toastContainerViewSlot;
  }
}
