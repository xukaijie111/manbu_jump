// pages/sport/components/select-device/index.js
import sqbComponent from '../../../../components/common/component.js'
sqbComponent({
  /**
   * 组件的属性列表
   */
  properties: {
        show:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    close(){
      this.$emit('close')
    }
  }
})
