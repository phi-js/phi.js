/*
Usage:

let foo = new ClickDrag({
    element: this.$el,
    handle: [selector string|DOMElement] (optional),
    on: {
        start: (positionData, mouseEvent) => null,
        drag: (positionData, mouseEvent) => null,
        end: (positionData, mouseEvent) => null
    },
    grid: {
        x: null,
        y: null
    },
});

*/
export default class ClickDrag {
  constructor(incomingSettings = {}) {
    // Set default settings and extend with incoming ones
    this.settings = Object.assign({

      element: null,

      on: {
        start: null,
        drag: null,
        snap: null,
        end: null
      },

      grid: {
        x: null,
        y: null
      },

      handle: null
    }, incomingSettings);

    // Set up eventListeners (functions bound to this instance's methods)
    this.eventListeners = {
      start: this.dragStart.bind(this),
      move: this.dragMove.bind(this),
      end: this.dragEnd.bind(this)
    };

    // Drag control
    this.start = {};
    this.current = {};

    this.attach();
  }

  attach() {
    // Validate element
    this.element = typeof this.settings.element == 'string' ? document.querySelector(this.element) : this.settings.element;
    if (!this.element) {
      throw "ClickDrag cannot initialize: invalid element";
    }

    if (this.settings.handle) {
      this.handle = typeof this.settings.handle == 'string' ? this.element.querySelector(this.settings.handle) : this.settings.handle;
    }

    if (!this.handle) {
      this.handle = this.element;
    }

    this.handle.addEventListener("mousedown", this.eventListeners.start, false);
    this.handle.addEventListener("touchstart", this.eventListeners.start, false);

    return this;
  }

  setGrid(grid) {
    this.settings.grid = grid;
  }

  destroy() {
    this.handle.removeEventListener("mousedown", this.eventListeners.start, false);
    this.handle.removeEventListener("touchstart", this.eventListeners.start, false);
  }

  emit(eventName, eventData, eventObject) {
    if (typeof this.settings.on[eventName] === 'function') {
      this.settings.on[eventName](eventData, eventObject);
    }
  }

  dragStart(e) {
    // Ignore click on element children
    if (e.target != this.handle) {
      return;
    }
    e.preventDefault();

    let offset = {
      x: (e.type === "touchstart" ? e.touches[0].clientX : e.clientX) - this.element.offsetLeft,
      y: (e.type === "touchstart" ? e.touches[0].clientY : e.clientY) - this.element.offsetTop
    };

    this.start = {
      x: offset.x,
      y: offset.y,
      w: 0,
      h: 0,
    };

    if (this.settings.grid) {
      this.start.grid = {
        x: Math.floor(offset.x / this.settings.grid.x),
        y: Math.floor(offset.y / this.settings.grid.y),
        w: 0,
        h: 0
      };
    }

    this.current = this.start;

    document.documentElement.addEventListener("mousemove", this.eventListeners.move, false);
    document.documentElement.addEventListener("touchmove", this.eventListeners.move, false);
    document.documentElement.addEventListener("mouseup", this.eventListeners.end, false);
    document.documentElement.addEventListener("touchend", this.eventListeners.end, false);

    this.emit('start', this.start, e);
  }

  dragMove(e) {
    e.preventDefault();
    let previous = this.current;

    let offset = {
      x: (e.type === "touchstart" ? e.touches[0].clientX : e.clientX) - this.element.offsetLeft,
      y: (e.type === "touchstart" ? e.touches[0].clientY : e.clientY) - this.element.offsetTop
    };

    this.current = {
      x: offset.x,
      y: offset.y,
      w: offset.x - this.start.x,
      h: offset.y - this.start.y
    };

    if (this.settings.grid) {

      this.current.grid = {
        x: Math.floor(offset.x / this.settings.grid.x),
        y: Math.floor(offset.y / this.settings.grid.y),

        w: Math.floor(offset.x / this.settings.grid.x) - this.start.grid.x,
        h: Math.floor(offset.y / this.settings.grid.y) - this.start.grid.y
      };

      if (this.current.grid.w != previous.grid.w || this.current.grid.h != previous.grid.h) {
        this.emit('snap', this.current, e);
      }
    }

    this.emit('drag', this.current, e);
  }

  dragEnd(e) {
    e.preventDefault();

    document.documentElement.removeEventListener("mousemove", this.eventListeners.move, false);
    document.documentElement.removeEventListener("touchmove", this.eventListeners.move, false);

    document.documentElement.removeEventListener("mouseup", this.eventListeners.end, false);
    document.documentElement.removeEventListener("touchend", this.eventListeners.end, false);

    this.emit('end', this.current, e);
  }


  /**
  getCSSGrid() {
      let currentElStyle = document.defaultView.getComputedStyle(this.element);
      let gridColumns = currentElStyle.getPropertyValue('--grid-columns');

      if (gridColumns) {
          let elementWidth = parseInt(currentElStyle.width);
          let gridGap = parseInt(currentElStyle.getPropertyValue('--grid-gap')) || 0;
          let rowHeight = parseInt(currentElStyle.getPropertyValue('--grid-row-height')) || 100;
          let itemW = currentElStyle.getPropertyValue('--w');

          // Determine the grid width (!!!)
          let gridWidth;

          // Element has --w, so it's assumed to be a grid item and used to calculate the full grid width
          if (itemW) {
              gridWidth = (((elementWidth + gridGap)/itemW) * gridColumns) - gridGap;
          } else {
              gridWidth = elementWidth;
          }


          return {
              x: (gridWidth + gridGap) / gridColumns,
              y: rowHeight + gridGap
          };
      }

      return {
          x: 0,
          y: 0
      };
  }
  */
}