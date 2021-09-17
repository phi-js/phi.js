export default class Selection {
    constructor() {
        this.items = [];
    }

    set(arrItems) {
        this.items = [];

        for (var i = 0; i < arrItems.length; i++) {
            this.items.push(arrItems[i]);
        }
    }

    isSelected(item) {
        return this.items.indexOf(item) >= 0;
    }

    select(item) {
        if (Array.isArray(item)) {
            return item.forEach(el => this.select(el));
        }

        if (this.isSelected(item)) {
            return;
        }

        this.items.push(item);
    }

    deselect(item) {
        if (Array.isArray(item)) {
            return item.forEach(el => this.deselect(el));
        }

        this.items.splice(this.items.indexOf(item), 1);
    }

    toggle(item) {
        if (Array.isArray(item)) {
            return item.forEach(el => this.toggle(el));
        }

        return this.isSelected(item) ? this.deselect(item) : this.select(item);
    }

    clear() {
        this.items = [];
    }

    get length() {
        return this.items.length;
    }
}