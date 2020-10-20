
import SqbComponent from '../common/component.js'

SqbComponent({
  properties: {
    animation: {
      type: Boolean,
      value: true
    },
    color: String
  },
  methods: {
    close: function () {
      this.$emit('close')
    }
  }
})
