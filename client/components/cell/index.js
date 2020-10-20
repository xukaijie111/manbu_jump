// pages/user/components/cell/index.js
import sqbComponent from '../common/component.js'
sqbComponent({
  /**
   * 组件的属性列表
   */
  properties: {
     title: String,
      text:String,
      isLink:Boolean
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
    click(){
      this.$emit('click')
    }
  }
})
