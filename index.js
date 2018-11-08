import COC from './modules/main.js'
export default ({ env }, inject) => {
  // Init COC
  COC.Init()
  // Add env to App
  COC.ConfigApp(new COC.Objects(COC.App).MixAndCreate(env).get)
  inject('coc', COC)
}
