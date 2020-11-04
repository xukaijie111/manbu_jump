// components/keyboard/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    KeyboardKeys:[1,2,3,4,5,6,7,8,9,'del',0,'OK'],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    keyTap(e){
      const data = e.currentTarget.dataset.keys;
      this.triggerEvent('click',data)
    }
  }
})
