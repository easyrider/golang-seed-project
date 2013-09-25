/* ========================================================================
 * Bootstrap: transition.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#transitions
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd'
    , 'MozTransition'    : 'transitionend'
    , 'OTransition'      : 'oTransitionEnd otransitionend'
    , 'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(window.jQuery);
;/* ========================================================================
 * Bootstrap: alert.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);
;/* ========================================================================
 * Bootstrap: button.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element = $(element)
    this.options  = $.extend({}, Button.DEFAULTS, options)
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d);
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
        .prop('checked', !this.$element.hasClass('active'))
        .trigger('change')
      if ($input.prop('type') === 'radio') $parent.find('.active').removeClass('active')
    }

    this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
    e.preventDefault()
  })

}(window.jQuery);
;/* ========================================================================
 * Bootstrap: carousel.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#carousel
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000
  , pause: 'hover'
  , wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition.end) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    this.sliding = true

    isCycling && this.pause()

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })

    if ($next.hasClass('active')) return

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
        .emulateTransitionEnd(600)
    } else {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(window.jQuery);
;/* ========================================================================
 * Bootstrap: collapse.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#collapse
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('in')
        [dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(window.jQuery);
;/* ========================================================================
 * Bootstrap: dropdown.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#dropdowns
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    var $el = $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      $parent.trigger(e = $.Event('show.bs.dropdown'))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown')

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var $items = $('[role=menu] li:not(.divider):visible a', $parent)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index=0

    $items.eq(index).focus()
  }

  function clearMenus() {
    $(backdrop).remove()
    $(toggle).each(function (e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('dropdown')

      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(window.jQuery);
;/* ========================================================================
 * Bootstrap: modal.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#modals
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) this.$element.load(this.options.remote)
  }

  Modal.DEFAULTS = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }

      that.$element.show()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that    = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click.dismiss.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(document)
    .on('show.bs.modal',  '.modal', function () { $(document.body).addClass('modal-open') })
    .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);
;/* ========================================================================
 * Bootstrap: tooltip.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay
      , hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.'+ this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.$element.trigger('shown.bs.' + this.type)
    }
  }

  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    $tip
      .offset(offset)
      .addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.$element.trigger('hidden.bs.' + this.type)

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth
    , height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);
;/* ========================================================================
 * Bootstrap: popover.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#popovers
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = $.extend({} , $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow')
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(window.jQuery);
;/* ========================================================================
 * Bootstrap: tab.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tabs
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab'
      , relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);
;/* ========================================================================
 * Bootstrap: affix.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#affix
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)
    this.$window = $(window)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element = $(element)
    this.affixed  =
    this.unpin    = null

    this.checkPosition()
  }

  Affix.RESET = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$window.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin) this.$element.css('top', '')

    this.affixed = affix
    this.unpin   = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(Affix.RESET).addClass('affix' + (affix ? '-' + affix : ''))

    if (affix == 'bottom') {
      this.$element.offset({ top: document.body.offsetHeight - offsetBottom - this.$element.height() })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      $spy.affix(data)
    })
  })

}(window.jQuery);
;/* ===================================================
 * bootstrap-markdown.js v1.0.0
 * http://github.com/toopay/bootstrap-markdown
 * ===================================================
 * Copyright 2013 Taufan Aditya
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

//= require markdown
//= require to-markdown

!function ($) {

  "use strict"; // jshint ;_;


  /* MARKDOWN CLASS DEFINITION
   * ========================== */

  var Markdown = function (element, options) {
    // Class Properties
    this.$ns          = 'bootstrap-markdown'
    this.$element     = $(element)
    this.$editable    = {el:null, type:null,attrKeys:[], attrValues:[], content:null}
    this.$cloneEditor = {el:null, type:null,attrKeys:[], attrValues:[], content:null}
    this.$options     = $.extend(true, {}, $.fn.markdown.defaults, options)
    this.$oldContent  = null
    this.$isPreview   = false
    this.$editor      = null
    this.$textarea    = null
    this.$handler     = []
    this.$callback    = []
    this.$nextTab     = []

    this.showEditor()
  }

  Markdown.prototype = {

    constructor: Markdown

  , __alterButtons: function(name,alter) {
      var handler = this.$handler, isAll = (name == 'all'),that = this

      $.each(handler,function(k,v) {
        var halt = true
        if (isAll) {
          halt = false
        } else {
          halt = v.indexOf(name) < 0
        }

        if (halt == false) {
          alter(that.$editor.find('button[data-handler="'+v+'"]'))
        }
      })
    }

  , __buildButtons: function(buttonsArray, container) {
      var i,
          ns = this.$ns,
          handler = this.$handler,
          callback = this.$callback

      for (i=0;i<buttonsArray.length;i++) {
        // Build each group container
        var y, btnGroups = buttonsArray[i]
        for (y=0;y<btnGroups.length;y++) {
          // Build each button group
          var z,
              buttons = btnGroups[y].data,
              btnGroupContainer = $('<div/>', {
                                    'class': 'btn-group'
                                  })

          for (z=0;z<buttons.length;z++) {
            var button = buttons[z],
                buttonHandler = ns+'-'+button.name,
                btnText = button.btnText ? button.btnText : '',
                btnClass = button.btnClass ? button.btnClass : 'btn btn-default'

            // Attach the button object
            btnGroupContainer.append('<button class="'
                                    +btnClass
                                    +' btn-sm" title="'
                                    +button.title
                                    +'" data-provider="'
                                    +ns
                                    +'" data-handler="'
                                    +buttonHandler
                                    +'"><i class="'
                                    +button.icon
                                    +'"></i> '
                                    +btnText
                                    +'</button>')

            // Register handler and callback
            handler.push(buttonHandler)
            callback.push(button.callback)
          }

          // Attach the button group into container dom
          container.append(btnGroupContainer)
        }
      }

      return container
    }
  , __setListener: function() {
      // Set size and resizable Properties
      var hasRows = typeof this.$textarea.attr('rows') != 'undefined',
          maxRows = this.$textarea.val().split("\n").length > 5 ? this.$textarea.val().split("\n").length : '5',
          rowsVal = hasRows ? this.$textarea.attr('rows') : maxRows

      this.$textarea.attr('rows',rowsVal)
      this.$textarea.css('resize','none')

      this.$textarea
        .on('focus',    $.proxy(this.focus, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if (this.eventSupported('keydown')) {
        this.$textarea.on('keydown', $.proxy(this.keydown, this))
      }

      // Re-attach markdown data
      this.$textarea.data('markdown',this)
    }

  , __handle: function(e) {
      var target = $(e.currentTarget),
          handler = this.$handler,
          callback = this.$callback,
          handlerName = target.attr('data-handler'),
          callbackIndex = handler.indexOf(handlerName),
          callbackHandler = callback[callbackIndex]

      // Trigger the focusin
      $(e.currentTarget).focus()

      callbackHandler(this)

      // Unless it was the save handler,
      // focusin the textarea
      if (handlerName.indexOf('cmdSave') < 0) {
        this.$textarea.focus()
      }

      e.preventDefault()
    }

  , showEditor: function() {
      var instance = this,
          textarea,
          ns = this.$ns,
          container = this.$element,
          originalHeigth = container.css('height'),
          originalWidth = container.css('width'),
          editable = this.$editable,
          handler = this.$handler,
          callback = this.$callback,
          options = this.$options,
          editor = $( '<div/>', {
                      'class': 'md-editor',
                      click: function() {
                        instance.focus()
                      }
                    })

      // Prepare the editor
      if (this.$editor == null) {
        // Create the panel
        var editorHeader = $('<div/>', {
                            'class': 'btn-toolbar md-header'
                            })

        // Build the main buttons
        if (options.buttons.length > 0) {
          editorHeader = this.__buildButtons(options.buttons, editorHeader)
        }

        // Build the additional buttons
        if (options.additionalButtons.length > 0) {
          editorHeader = this.__buildButtons(options.additionalButtons, editorHeader)
        }

        editor.append(editorHeader)

        // Wrap the textarea
        if (container.is('textarea')) {
          container.before(editor)
          textarea = container
          textarea.addClass('md-input')
          editor.append(textarea)
        } else {
          var rawContent = (typeof toMarkdown == 'function') ? toMarkdown(container.html()) : container.html(),
              currentContent = $.trim(rawContent)

          // This is some arbitrary content that could be edited
          textarea = $('<textarea/>', {
                       'class': 'md-input',
                       'val' : currentContent
                      })

          editor.append(textarea)

          // Save the editable
          editable.el = container
          editable.type = container.prop('tagName').toLowerCase()
          editable.content = container.html()

          $(container[0].attributes).each(function(){
            editable.attrKeys.push(this.nodeName)
            editable.attrValues.push(this.nodeValue)
          })

          // Set editor to blocked the original container
          container.replaceWith(editor)
        }

        // Create the footer if savable
        if (options.savable) {
          var editorFooter = $('<div/>', {
                           'class': 'md-footer'
                         }),
              saveHandler = 'cmdSave'

          // Register handler and callback
          handler.push(saveHandler)
          callback.push(options.onSave)

          editorFooter.append('<button class="btn btn-success" data-provider="'
                              +ns
                              +'" data-handler="'
                              +saveHandler
                              +'"><i class="glyphicon glyphicon-white glyphicon-ok"></i> Save</button>')

          editor.append(editorFooter)
        }

        // Set width/height
        $.each(['height','width'],function(k,attr){
          if (options[attr] != 'inherit') {
            if (jQuery.isNumeric(options[attr])) {
              editor.css(attr,options[attr]+'px')
            } else {
              editor.addClass(options[attr])
            }
          }
        })

        // Reference
        this.$editor     = editor
        this.$textarea   = textarea
        this.$editable   = editable
        this.$oldContent = this.getContent()

        this.__setListener()

        // Set editor attributes, data short-hand API and listener
        this.$editor.attr('id',(new Date).getTime())
        this.$editor.on('click', '[data-provider="bootstrap-markdown"]', $.proxy(this.__handle, this))

      } else {
        this.$editor.show()
      }

      if (options.autofocus) {
        this.$textarea.focus()
        this.$editor.addClass('active')
      }

      // Trigger the onShow hook
      options.onShow(this)

      return this
    }

  , showPreview: function() {
      var options = this.$options,
          callbackContent = options.onPreview(this), // Try to get the content from callback
          container = this.$textarea,
          replacementContainer = $('<div/>',{'class':'md-preview','data-provider':'markdown-preview'}),
          cloneEditor = this.$cloneEditor,
          content

      // Give flag that tell the editor enter preview mode
      this.$isPreview = true
      // Disable all buttons
      this.disableButtons('all').enableButtons('cmdPreview')

      // Save the editor
      cloneEditor.el = container
      cloneEditor.type = container.prop('tagName').toLowerCase()
      cloneEditor.content = container.val()

      $(container[0].attributes).each(function(){
        cloneEditor.attrKeys.push(this.nodeName)
        cloneEditor.attrValues.push(this.nodeValue)
      })

      this.$cloneEditor = cloneEditor

      if (typeof callbackContent == 'string') {
        // Set the content based by callback content
        content = callbackContent
      } else {
        // Set the content
        content = (typeof markdown == 'object') ? markdown.toHTML(container.val()) : container.val()
      }

      // Build preview element and replace the editor temporarily
      replacementContainer.html(content)
      container.replaceWith(replacementContainer)

      // Attach the editor instances
      replacementContainer.data('markdown',this)

      return this
    }

  , hidePreview: function() {
      // Give flag that tell the editor quit preview mode
      this.$isPreview = false

      // Build the original element
      var container = this.$editor.find('div[data-provider="markdown-preview"]'),
          cloneEditor = this.$cloneEditor,
          oldElement = $('<'+cloneEditor.type+'/>')

      $(cloneEditor.attrKeys).each(function(k,v) {
        oldElement.attr(cloneEditor.attrKeys[k],cloneEditor.attrValues[k])
      })

      // Set the editor content
      oldElement.val(cloneEditor.content)

      // Set the editor data
      container.replaceWith(oldElement)

      // Enable all buttons
      this.enableButtons('all')

      // Back to the editor
      this.$textarea = oldElement
      this.__setListener()

      return this
    }

  , isDirty: function() {
      return this.$oldContent != this.getContent()
    }

  , getContent: function() {
      return (this.$isPreview) ? this.$cloneEditor.content : this.$textarea.val()
    }

  , setContent: function(content) {
      this.$textarea.val(content)

      return this
    }

  , findSelection: function(chunk) {
    var content = this.getContent(), startChunkPosition

    if (startChunkPosition = content.indexOf(chunk), startChunkPosition >= 0 && chunk.length > 0) {
      var oldSelection = this.getSelection(), selection

      this.setSelection(startChunkPosition,startChunkPosition+chunk.length)
      selection = this.getSelection()

      this.setSelection(oldSelection.start,oldSelection.end)

      return selection
    } else {
      return null
    }
  }

  , getSelection: function() {

      var e = this.$textarea[0]

      return (

          ('selectionStart' in e && function() {
              var l = e.selectionEnd - e.selectionStart
              return { start: e.selectionStart, end: e.selectionEnd, length: l, text: e.value.substr(e.selectionStart, l) }
          }) ||

          /* browser not supported */
          function() {
            return null
          }

      )()

    }

  , setSelection: function(start,end) {

      var e = this.$textarea[0]

      return (

          ('selectionStart' in e && function() {
              e.selectionStart = start
              e.selectionEnd = end
              return
          }) ||

          /* browser not supported */
          function() {
            return null
          }

      )()

    }

  , replaceSelection: function(text) {

      var e = this.$textarea[0]

      return (

          ('selectionStart' in e && function() {
              e.value = e.value.substr(0, e.selectionStart) + text + e.value.substr(e.selectionEnd, e.value.length)
              // Set cursor to the last replacement end
              e.selectionStart = e.value.length
              return this
          }) ||

          /* browser not supported */
          function() {
              e.value += text
              return jQuery(e)
          }

      )()

    }

  , getNextTab: function() {
      // Shift the nextTab
      if (this.$nextTab.length == 0) {
        return null
      } else {
        var nextTab, tab = this.$nextTab.shift()

        if (typeof tab == 'function') {
          nextTab = tab()
        } else if (typeof tab == 'object' && tab.length > 0) {
          nextTab = tab
        }

        return nextTab
      }
    }

  , setNextTab: function(start,end) {
      // Push new selection into nextTab collections
      if (typeof start == 'string') {
        var that = this
        this.$nextTab.push(function(){
          return that.findSelection(start)
        })
      } else if (typeof start == 'numeric' && typeof end == 'numeric') {
        var oldSelection = this.getSelection()

        this.setSelection(start,end)
        this.$nextTab.push(this.getSelection())

        this.setSelection(oldSelection.start,oldSelection.end)
      }

      return
    }

  , enableButtons: function(name) {
      var alter = function (el) {
        el.removeAttr('disabled')
      }

      this.__alterButtons(name,alter)

      return this
    }

  , disableButtons: function(name) {
      var alter = function (el) {
        el.attr('disabled','disabled')
      }

      this.__alterButtons(name,alter)

      return this
    }

  , eventSupported: function(eventName) {
      var isSupported = eventName in this.$element
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;')
        isSupported = typeof this.$element[eventName] === 'function'
      }
      return isSupported
    }

  , keydown: function (e) {
      this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27])
      this.keyup(e)
    }

  , keypress: function (e) {
      if (this.suppressKeyPressRepeat) return
      this.keyup(e)
    }

  , keyup: function (e) {
      var blocked = false
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
          break

        case 9: // tab
          var nextTab
          if (nextTab = this.getNextTab(),nextTab != null) {
            // Get the nextTab if exists
            var that = this
            setTimeout(function(){
              that.setSelection(nextTab.start,nextTab.end)
            },500)
          } else {
            // Put the cursor to the end
            this.setSelection(this.getContent().length,this.getContent().length)
          }

          blocked = true
          break

        case 13: // enter
        case 27: // escape
          blocked = false
          break

        default:
          blocked = false
      }

      if (blocked) {
        e.stopPropagation()
        e.preventDefault()
      }
  }

  , focus: function (e) {
      var options = this.$options,
          isHideable = options.hideable,
          editor = this.$editor

      editor.addClass('active')

      // Blur other markdown(s)
      $(document).find('.md-editor').each(function(){
        if ($(this).attr('id') != editor.attr('id')) {
          var attachedMarkdown

          if (attachedMarkdown = $(this).find('textarea').data('markdown'),
              attachedMarkdown == null) {
              attachedMarkdown = $(this).find('div[data-provider="markdown-preview"]').data('markdown')
          }

          if (attachedMarkdown) {
            attachedMarkdown.blur()
          }
        }
      })

      return this
    }

  , blur: function (e) {
      var options = this.$options,
          isHideable = options.hideable,
          editor = this.$editor,
          editable = this.$editable

      // Force to quit preview mode
      if (this.$isPreview) {
        this.hidePreview()
      }

      if (editor.hasClass('active') || this.$element.parent().length == 0) {
        editor.removeClass('active')

        if (isHideable) {

          // Check for editable elements
          if (editable.el != null) {
            // Build the original element
            var oldElement = $('<'+editable.type+'/>'),
                content = this.getContent(),
                currentContent = (typeof markdown == 'object') ? markdown.toHTML(content) : content

            $(editable.attrKeys).each(function(k,v) {
              oldElement.attr(editable.attrKeys[k],editable.attrValues[k])
            })

            // Get the editor content
            oldElement.html(currentContent)

            editor.replaceWith(oldElement)
          } else {
            editor.hide()

          }
        }

        // Trigger the onBlur hook
        options.onBlur(this)
      }

      return this
    }

  }

 /* MARKDOWN PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.markdown

  $.fn.markdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('markdown')
        , options = typeof option == 'object' && option
      if (!data) $this.data('markdown', (data = new Markdown(this, options)))
    })
  }

  $.fn.markdown.defaults = {
    /* Editor Properties */
    autofocus: false,
    hideable: false,
    savable:false,
    width: 'inherit',
    height: 'inherit',

    /* Buttons Properties */
    buttons: [
      [{
        name: 'groupFont',
        data: [{
          name: 'cmdBold',
          title: 'Bold',
          icon: 'glyphicon glyphicon-bold',
          callback: function(e){
            // Give/remove ** surround the selection
            var chunk, cursor, selected = e.getSelection(), content = e.getContent()

            if (selected.length == 0) {
              // Give extra word
              chunk = 'strong text'
            } else {
              chunk = selected.text
            }

            // transform selection and set the cursor into chunked text
            if (content.substr(selected.start-2,2) == '**'
                && content.substr(selected.end,2) == '**' ) {
              e.setSelection(selected.start-2,selected.end+2)
              e.replaceSelection(chunk)
              cursor = selected.start-2
            } else {
              e.replaceSelection('**'+chunk+'**')
              cursor = selected.start+2
            }

            // Set the cursor
            e.setSelection(cursor,cursor+chunk.length)
          }
        },{
          name: 'cmdItalic',
          title: 'Italic',
          icon: 'glyphicon glyphicon-italic',
          callback: function(e){
            // Give/remove * surround the selection
            var chunk, cursor, selected = e.getSelection(), content = e.getContent()

            if (selected.length == 0) {
              // Give extra word
              chunk = 'emphasized text'
            } else {
              chunk = selected.text
            }

            // transform selection and set the cursor into chunked text
            if (content.substr(selected.start-1,1) == '*'
                && content.substr(selected.end,1) == '*' ) {
              e.setSelection(selected.start-1,selected.end+1)
              e.replaceSelection(chunk)
              cursor = selected.start-1
            } else {
              e.replaceSelection('*'+chunk+'*')
              cursor = selected.start+1
            }

            // Set the cursor
            e.setSelection(cursor,cursor+chunk.length)
          }
        },{
          name: 'cmdHeading',
          title: 'Heading',
          icon: 'glyphicon glyphicon-font',
          callback: function(e){
            // Append/remove ### surround the selection
            var chunk, cursor, selected = e.getSelection(), content = e.getContent(), pointer, prevChar

            if (selected.length == 0) {
              // Give extra word
              chunk = 'heading text'
            } else {
              chunk = selected.text
            }

            // transform selection and set the cursor into chunked text
            if ((pointer = 4, content.substr(selected.start-pointer,pointer) == '### ')
                || (pointer = 3, content.substr(selected.start-pointer,pointer) == '###')) {
              e.setSelection(selected.start-pointer,selected.end)
              e.replaceSelection(chunk)
              cursor = selected.start-pointer
            } else if (prevChar = content.substr(selected.start-1,1), !!prevChar && prevChar != '\n') {
              e.replaceSelection('\n\n### '+chunk+'\n')
              cursor = selected.start+6
            } else {
              // Empty string before element
              e.replaceSelection('### '+chunk+'\n')
              cursor = selected.start+4
            }

            // Set the cursor
            e.setSelection(cursor,cursor+chunk.length)
          }
        }]
      },{
        name: 'groupLink',
        data: [{
          name: 'cmdUrl',
          title: 'URL/Link',
          icon: 'glyphicon glyphicon-globe',
          callback: function(e){
            // Give [] surround the selection and prepend the link
            var chunk, cursor, selected = e.getSelection(), content = e.getContent(), link

            if (selected.length == 0) {
              // Give extra word
              chunk = 'enter link description here'
            } else {
              chunk = selected.text
            }

            link = prompt('Insert Hyperlink','http://')

            if (link != null) {
              // transform selection and set the cursor into chunked text
              e.replaceSelection('['+chunk+']('+link+')')
              cursor = selected.start+1

              // Set the cursor
              e.setSelection(cursor,cursor+chunk.length)
            }
          }
        },{
          name: 'cmdImage',
          title: 'Image',
          icon: 'glyphicon glyphicon-picture',
          callback: function(e){
            // Give ![] surround the selection and prepend the image link
            var chunk, cursor, selected = e.getSelection(), content = e.getContent(), link

            if (selected.length == 0) {
              // Give extra word
              chunk = 'enter image description here'
            } else {
              chunk = selected.text
            }

            link = prompt('Insert Image Hyperlink','http://')

            if (link != null) {
              // transform selection and set the cursor into chunked text
              e.replaceSelection('!['+chunk+']('+link+' "enter image title here")')
              cursor = selected.start+2

              // Set the next tab
              e.setNextTab('enter image title here')

              // Set the cursor
              e.setSelection(cursor,cursor+chunk.length)
            }
          }
        }]
      },{
        name: 'groupMisc',
        data: [{
          name: 'cmdList',
          title: 'List',
          icon: 'glyphicon glyphicon-list',
          callback: function(e){
            // Prepend/Give - surround the selection
            var chunk, cursor, selected = e.getSelection(), content = e.getContent()

            // transform selection and set the cursor into chunked text
            if (selected.length == 0) {
              // Give extra word
              chunk = 'list text here'

              e.replaceSelection('- '+chunk)

              // Set the cursor
              cursor = selected.start+2
            } else {
              if (selected.text.indexOf('\n') < 0) {
                chunk = selected.text

                e.replaceSelection('- '+chunk)

                // Set the cursor
                cursor = selected.start+2
              } else {
                var list = []

                list = selected.text.split('\n')
                chunk = list[0]

                $.each(list,function(k,v) {
                  list[k] = '- '+v
                })

                e.replaceSelection('\n\n'+list.join('\n'))

                // Set the cursor
                cursor = selected.start+4
              }
            }



            // Set the cursor
            e.setSelection(cursor,cursor+chunk.length)
          }
        }]
      },{
        name: 'groupUtil',
        data: [{
          name: 'cmdPreview',
          title: 'Preview',
          btnText: 'Preview',
          btnClass: 'btn btn-primary',
          icon: 'glyphicon glyphicon-white glyphicon-search',
          callback: function(e){
            // Check the preview mode and toggle based on this flag
            var isPreview = e.$isPreview,content

            if (isPreview == false) {
              // Give flag that tell the editor enter preview mode
              e.showPreview()
            } else {
              e.hidePreview()
            }
          }
        }]
      }]
    ],
    additionalButtons:[], // Place to hook more buttons by code

    /* Events hook */
    onShow: function (e) {},
    onPreview: function (e) {},
    onSave: function (e) {},
    onBlur: function (e) {}
  }

  $.fn.markdown.Constructor = Markdown


 /* MARKDOWN NO CONFLICT
  * ==================== */

  $.fn.markdown.noConflict = function () {
    $.fn.markdown = old
    return this
  }

  /* MARKDOWN GLOBAL FUNCTION & DATA-API
  * ==================================== */
  var initMarkdown = function(el) {
    var $this = el

    if ($this.data('markdown')) {
      $this.data('markdown').showEditor()
      return
    }
    $this.markdown($this.data())
  }

  var analyzeMarkdown = function(e) {
    var blurred = false,
        el,
        $docEditor = $(e.currentTarget)

    // Check whether it was editor childs or not
    if ((e.type == 'focusin' || e.type == 'click') && $docEditor.length == 1 && typeof $docEditor[0] == 'object'){
      el = $docEditor[0].activeElement
      if ( ! $(el).data('markdown')) {
        if (typeof $(el).parent().parent().parent().attr('class') == "undefined"
              || $(el).parent().parent().parent().attr('class').indexOf('md-editor') < 0) {
          if ( typeof $(el).parent().parent().attr('class') == "undefined"
              || $(el).parent().parent().attr('class').indexOf('md-editor') < 0) {

                blurred = true
          }
        } else {
          blurred = false
        }
      }


      if (blurred) {
        // Blur event
        $(document).find('.md-editor').each(function(){
          var parentMd = $(el).parent()

          if ($(this).attr('id') != parentMd.attr('id')) {
            var attachedMarkdown

            if (attachedMarkdown = $(this).find('textarea').data('markdown'),
                attachedMarkdown == null) {
                attachedMarkdown = $(this).find('div[data-provider="markdown-preview"]').data('markdown')
            }

            if (attachedMarkdown) {
              attachedMarkdown.blur()
            }
          }
        })
      }

      e.stopPropagation()
    }
  }

  $(document)
    .on('click.markdown.data-api', '[data-provide="markdown-editable"]', function (e) {
      initMarkdown($(this))
      e.preventDefault()
    })
    .on('click', function (e) {
      analyzeMarkdown(e)
    })
    .on('focusin', function (e) {
      analyzeMarkdown(e)
    })
    .ready(function(){
      $('textarea[data-provide="markdown"]').each(function(){
        initMarkdown($(this))
      })
    })

}(window.jQuery);
