/// <reference types="@applitools/visual-grid-client" />
/// <reference types="testcafe" />

declare namespace Eyes {
    namespace Testcafe {
      interface OpenOptions extends Eyes.Open.Options {
        t: TestController
      }
  
      interface Selector {
        selector: SelectorAPI
      }
  
      interface FloatingSelector extends Selector {
        maxUpOffset: number
        maxDownOffset: number
        maxLeftOffset: number
        maxRightOffset: number
      }
  
      interface AccessibilitySelector extends Selector {
        accessibilityType: Eyes.Check.AccessibilityType
      }
  
      type RegionOrSelector = Selector|Eyes.Check.Region|Eyes.Check.Selector
      type FloatingRegionOrSelector = FloatingSelector|Eyes.Check.FloatingRegion|Eyes.Check.FloatingSelector
      type AccessibilityRegionOrSelector = AccessibilitySelector|Eyes.Check.AccessibilityRegion|Eyes.Check.AccessibilitySelector
  
      interface CheckOptions extends Omit<Eyes.Check.Options, 'ignore'|'floating'|'layout'|'content'|'strict'|'accessibility'|'selector'> {
        /**
         * A single or an array of regions to ignore when checking for visual differences.
         */
        ignore?:RegionOrSelector|RegionOrSelector[]
        
        /**
         * A single or an array of floating regions to ignore when checking for visual differences. 
         * More information about floating regions can be 
         * found in https://help.applitools.com/hc/en-us/articles/360006915292-Testing-of-floating-UI-elements .
         */
        floating?:FloatingRegionOrSelector|FloatingRegionOrSelector[]
  
        /**
         * A single or an array of regions to match as layout level.
         * See: https://help.applitools.com/hc/en-us/articles/360007188591-Match-Levels
         */
        layout?:RegionOrSelector|RegionOrSelector[]
  
        /**
         * A single or an array of regions to match as content level.
         * See: https://help.applitools.com/hc/en-us/articles/360007188591-Match-Levels
         */
        content?:RegionOrSelector|RegionOrSelector[]
  
        /**
         * A single or an array of regions to match as strict level.
         * See: https://help.applitools.com/hc/en-us/articles/360007188591-Match-Levels
         */
        strict?:RegionOrSelector|RegionOrSelector[]
  
        /**
         * A single or an array of regions to perform accessibility checks.
         */
        accessibility?:AccessibilityRegionOrSelector|AccessibilityRegionOrSelector[]

        /**
         * In case target is region, this should be the a css, xpath or a Testcafe Selector to an element, 
         * and the screenshot would be the content of that element.
         */
        selector?:SelectorAPI|string|Eyes.Check.Selector
      }
    }
  }