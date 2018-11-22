


# COC.JS Nuxt-iView
<p align="center">
  <img width="200" height="200" src="https://avatars2.githubusercontent.com/u/44804821?s=400&u=c2252c15889114f4fa1128f60b3156e9f1f2131e&v=4">
</p>

## Install with npm 

```
npm install coc-nuxt-iview
```

## GET STARTED

After installing from npm, create `coc.js` file in `/plugins` directory.
in `coc.js` add the following

    import COC from 'coc-nuxt-iview'
    import moment from 'moment'
    import lodash from 'lodash'
    import pkg from '~/package'
    import Vue from 'vue'
    export default ({ env }, inject) => {
      // Init COC
      COC.Init({
        Vue,
        lodash,
        moment
      })
      // Config app data
      COC.ConfigApp({
        name: pkg.name,
        version: pkg.version,
        repository: pkg.repository,
        mode: env.mode
      })
      inject('coc', COC)
    }

Then you can add the default COC theme by adding
 `coc-nuxt-iview/dist/index.css` in your `nuxt.config.js` under the `css` attribute.
 You can also use **[COC-Theme-Builder](https://github.com/CocJS/COC-Theme-Builder.git)** just clone the repo and start customizing your own COC theme.
## What is COC.JS Nuxt-iView

VUE assistant based on COC core engine and designed to work with (Nuxt, iView) environment

 - Coc is providing the developer with a data structures helpers for
   arrays, objects and collection.
 - For Nuxt environment we're making it easy to use moment.js and
   lodash,  you don't need to add them in a special plugins or modules
   in your project.
 - You will also have extra 13 components designed to work with iView
   UI.
 - Coc Forms components are designed to build a complex forms with a
   minimal code and many features

### UI Design Concepts
COC is using different components from many UI libraries to cover most of the UI developers needs.
**External resources**
 - [MaterializeCss - Grid System](https://materializecss.com/grid.html)
 - [MaterializeCss - Colors](https://materializecss.com/color.html)
 - [MaterializeCss - Shadow](https://materializecss.com/shadow.html)
 - [AnimateCss](https://daneden.github.io/animate.css/)
 - [Bulma - Buttons](https://bulma.io/documentation/elements/button/)
 
 **Resources By COC**
 - Typography Styles
 - Borders Styling and colors

### COC Custom Components 
**Based on iView**.
 - Forms -  Input
 - Forms -  Select
 - Forms -  Radio/Checkbox
 - Forms -  Datepicker
 - Forms -  Button

**COC Pure**
 - Coc-Axios
 - Coc-ShowKeys
 - Coc-Collapse
 - Coc-Form Item
 - Coc-Form


### Check our full template
[COCJS Ready Template for Nuxt-iView-COC](https://cocjs.github.io/Nuxt-iView-Template/)
## Code Form Example

    <coc-form
          :fields = "[
            {
              // Step Data
              step: 'Step One',
              content: 'Your name',

              //Step Fields
              
              fields: [
                {
                 //Item Type
                  type: 'input',
                  
                  //Item Props
                  props: {
                    placeholder: 'First name',
                    required: true,
                  }
                },
                {
                  type: 'input',
                  props: {
                    placeholder: 'Last name',
                  }
                }
              ]
            },
            {
              step : 'Step Two',
              content: 'Your Gender',
              fields: [
                {
                  type: 'select',
                  props: {
                    placeholder: 'Gender',
                    options: ['Male', 'Female']
                  }
                },
                {
                  type: 'button',
                  props: {
                    placeholder: 'Submit',
                    local: true,
                  }
                }
              ]
            }
        ]"/>


