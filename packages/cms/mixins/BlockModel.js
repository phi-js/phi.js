export default {
  props: {
    value: {
      type: Object,
      required: true
    },

    variables: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },

  data() {
    return {
      block: null
    }
  },

  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(newValue) {
        if (!newValue) {
          this.block = {};
          return;
        }

        this.block = JSON.parse(JSON.stringify(newValue));
      }
    }
  },

  methods: {
    input() {
      this.$emit('input', this.block);
    },

    cancel() {
      this.block = JSON.parse(JSON.stringify(this.value));
      this.$emit('cancel');
    },

    getProp(propName, defaultValue = null) {
      return this.block.props
        && this.block.props[propName]
        ? this.block.props[propName]
        : defaultValue;
    },

    setProp(propName, value) {
      if (!this.block.props) {
        this.$set(this.block, 'props', {});
      }

      this.$set(this.block.props, propName, value);
      this.$emit("input", this.block);
    },

    getVariable(variableName) {
      return this.getObjectProperty(this.variables, variableName);
    },

    setVariable(variableName, value) {
      this.setObjectProperty(this.variables, variableName, value);
      this.$emit("update:variables", this.variables);
    },

    // https://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key
    getObjectProperty(sourceObject, propertyName) {
      if (!sourceObject || !propertyName) {
        return undefined;
      }

      let s = propertyName;
      let o = sourceObject;

      s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
      s = s.replace(/^\./, '');           // strip a leading dot
      var a = s.split('.');
      for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
          o = o[k];
        } else {
          return;
        }
      }
      return o;
    },

    setObjectProperty(sourceObject, propertyName, value) {
      let curvar = sourceObject;
      let parts = propertyName.split('.');
      let len = parts.length;

      for (let i = 0; i < len - 1; i++) {
        if (typeof curvar[parts[i]] == "undefined") {
          this.$set(curvar, parts[i], {});
        }
        curvar = curvar[parts[i]];
      }

      this.$set(curvar, parts[len - 1], value);
    }

  }
}