import {inject, Container, CompositionEngine, Origin} from 'aurelia-framework';
import {ToastController} from './toast-controller';
import {ToastRenderer} from './toast-renderer';
import {getViewModel, invokeLifecycle} from './toast-utilities';

const defaults = {
  debug: false,
  position: 'toast-top-right',
  startingZIndex: 1000
};

const ToastType = {
  Error: 'error',
  Info: 'info',
  Success: 'success',
  Warning: 'warning'
}

@inject(Container, CompositionEngine, ToastRenderer)
export class ToastService {
  error(message, title, options) {
    return this.notify(ToastType.Error, message, title, options);
  }

  info(message, title, options) {
    return this.notify(ToastType.Info, message, title, options);
  }

  success(message, title, options) {
    return this.notify(ToastType.Success, message, title, options);
  }

  warning(message, title, options) {
    return this.notify(ToastType.Warning, message, title, options);
  }

  clearAll() {
    let length = this._toasts.length;
    while (length--) {
      let toast = this._toasts.pop();
      toast.remove();
    }

    this._containers.forEach((value) => value.remove());
    this._containers.clear();
  }

  clearLast() {
    let toast = this._toasts.pop();
    toast.remove();
  }

  // internal
  _containers = new Map();
  _toasts = [];

  constructor(container, compositionEngine, toastRenderer) {
    this.container = container;
    this.compositionEngine = compositionEngine;
    this.renderer = toastRenderer;
  }

  _getContainer(options) {
    let position = options.position;
    if (this._containers.has(position)) {
      return this._containers.get(position);
    }

    let containerElement = document.createElement('div');
    containerElement.id = 'toast-container';
    containerElement.classList.add(options.position);
    containerElement.setAttribute('aria-live', 'polite');
    containerElement.setAttribute('role', 'alert');
    document.body.insertBefore(containerElement, document.body.firstChild);
    this._containers.set(position, containerElement);
    return containerElement;
  }

  notify(type, message, title, options) {
    if (title === undefined && typeof message !== 'string') {
      options = message;
    }

    console.log(options);
    options = Object.assign({}, defaults, options, {
      type: type,
      message: message,
      title: title
    });

    return new Promise((resolve, reject) => {
      let childContainer = this.container.createChild();
      let instruction = {
        viewModel: 'toast/toast-element',
        container: this.container,
        childContainer: childContainer,
        model: options.model
      };

      let controllerInstruction;
      return getViewModel(instruction, this.compositionEngine)
        .then(returnedInstruction => {
          controllerInstruction = returnedInstruction;
          return invokeLifecycle(controllerInstruction.viewModel, 'canActivate', options.model);
        })
        .then(canActivate => !canActivate ? null :
          this.compositionEngine.createController(controllerInstruction)
            .then(controller => {
              controller.automate();
              this.renderer.render(controller, options);
            })
        )
        .then(() => resolve());
    });
  }
}
