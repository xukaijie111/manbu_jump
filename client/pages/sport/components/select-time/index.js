// pages/sport/components/select-time/index.js
import sqbComponent from '../../../../components/common/component.js'

sqbComponent({
  /**
   * 组件的属性列表
   */
  properties: {
    show: Boolean,
  },

  /**
   * 组件的初始数据
   */
  data: {
      lists:[
        {
          value: 15,
        },
        {
          value:30,
        },
        {
          value: 60,
        },
        {
          value: 180,
        }
      ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.$emit('close')
    },
  }
})
