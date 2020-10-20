export const basic = Behavior({
  methods: {
    $emit(...args) {
      this.triggerEvent(...args)
    }
  }
})
