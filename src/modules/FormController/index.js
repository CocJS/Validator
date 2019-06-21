import Event from '../Events'
import Arrays from '../Arrays'
import Logger from '../Logger'
export default class FormControl extends Event {
  constructor(event) {
    super(event)
    this.type = event.type
    this.model = event.model
    if (!event.scope || !Array.isArray(event.scope)) {
      this.scope = []
    } else {
      this.scope = event.scope
    }
    this.scopeArray = new Arrays(this.scope, {
      logger: 'Coc Arrays: CEFC Scope'
    })
    this.component = event.component ? event.component : null
    this.registered = {}
    this.pennding = true
    this.Logger = new Logger(`COC ${this.type} | CEFC`)
  }

  SetPennding(state = true) {
    this.pennding = state
  }
  Start() {
    this.On('COCFormController', payloads => {
      // Validate if there's a scope
      if (!this.scope) {
        this.Warn(
          `There is no scope in this component. ${
            this.component && this.component.placeholder
              ? 'Hint, placeholder: ' + this.component.placeholder
              : ''
          }`
        )
        return
      }
      //Type Check
      if (
        payloads.type === undefined &&
        this.component &&
        this.component.type === 'button'
      ) {
        return
      }
      if (payloads.type !== undefined && payloads.type !== this.type) {
        return
      }
      //Check Matching
      if (this.scopeArray.IsMatching(payloads.scope)) {
        if (payloads.controller === 'meta') {
          this.HandleMeta(payloads.credentials)
        } else if (this.model.control[payloads.controller] !== undefined) {
          this.model.control[payloads.controller](
            payloads.credentials,
            payloads.callback !== undefined &&
            typeof payloads.callback === 'function'
              ? payloads.callback
              : null
          )
        } else {
          this.Warn(
            `The Controller (${
              payloads.controller
            }) that you are trying to access does not exist.
            placehoder: ${
              this.component && this.component.placehoder
                ? this.component.placehoder
                : 'Unknown'
            }`
          )
          console.log(this)
        }
      } else return
    })
  }

  Send(options) {
    const defaults = {
      scope: this.scope
    }
    this.Emit('COCFormController', { ...defaults, ...options })
  }

  SendMeta(options) {
    const defaults = {
      scope: this.scope,
      component: this.component
    }
    this.Emit('COCFormMeta', { ...defaults, ...options })
  }

  MatchedEvent(payloads) {
    return payloads.scope && this.scopeArray.IsMatching(payloads.scope)
  }
  ReceiveMeta(meta, callback) {
    this.On('COCFormMeta', payloads => {
      if (payloads.meta && payloads.meta == meta)
        if (this.MatchedEvent(payloads)) {
          callback(payloads)
        } else return
      else return
    })
  }

  HandleMeta(metaType = null, description = null) {
    if (!metaType || metaType === '*') {
      this.SendMeta({
        meta: '*',
        credentials: this.model.meta
      })
      return
    }
    if (!this.model) {
      return
    }
    if (this.model.meta[metaType] === undefined) {
      this.Warn(
        'The meta that you are requesting is not available in this CSMA.'
      )
      return
    }
    const headers = {
      pennding: this.pennding,
      meta: metaType,
      credentials: this.model.meta[metaType]
    }
    if (description) {
      headers.description = description
    }
    this.SendMeta(headers)
    return this.model.control
  }

  Submit() {
    this.Send({
      controller: 'click',
      credentials: null,
      type: 'button'
    })
  }
  Warn(message) {
    this.Logger.Warn(message)
  }
}
