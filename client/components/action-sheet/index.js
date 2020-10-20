import SqbComponent from '../common/component'

SqbComponent({
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer: function (newValue) {
        if (!newValue) {
          // 等动画执行了再隐藏
          setTimeout(() => {
            this.setData({ _show: false })
          }, 300)
        } else {
          this.setData({ _show: true })
        }
      }
    },

    title: String,
    close: Boolean,
    overlayStyle: String
  },

  data: {
    _show: false
  },

  methods: {
    closeSheet: function () {
      this.$emit('close')
    },
    preventPop: function () {

    }
  }
})
