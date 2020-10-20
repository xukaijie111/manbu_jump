
import { basic } from '../mixins/basic.js'

import {
  safeMerge
} from '../../utils/util.js'

function makeRelations(relations) {
  const linkComponentLists = Object.values(relations)
  linkComponentLists.forEach((item) => {
    const _linked = item.linked
    const _unlinked = item.unlinked

    item.linked = function (target) {
      if (item.type === 'ancestor') this.parent = target
      if (item.type === 'descendant') {
        this.children = this.children || []
        this.children.push(target)
      }

      if (_linked) _linked.call(this, target)
    }

    item.unlinked = function (target) {
      if (item.type === 'ancestor') this.parent = null
      if (item.type === 'descendant') {
        this.children = (this.children || []).filter((child) => child !== target)
      }

      if (_unlinked) _unlinked.call(this, target)
    }
  })
}

function SqbComponent(config) {
  var defaultConfig = {
    externalClasses: ['custom-class'],
    properties: {
      customStyle: String,
      sqbBridge: Object
    }
  }

  if (config.relations) {
    makeRelations(config.relations)
  }

  config.externalClasses = config.externalClasses || []
  config.externalClasses = config.externalClasses.concat(defaultConfig.externalClasses)

  config.properties = config.properties || []
  config.properties = safeMerge(config.properties, defaultConfig.properties)

  config.behaviors = config.behaviors || []
  config.behaviors.push(basic)

  return Component(config)
}

export default SqbComponent
