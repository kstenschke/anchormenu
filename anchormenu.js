/**
 * Renders and inserts a menu of local anchors from current DOM
 *
 * @author          Kay Stenschke <info@stenschke.com>
 * @copyright       2014 Kay Stenschke
 * @package         Anchormenu
 * @license         MIT
 * @url             https://github.com/kstenschke/anchormenu
 * @version         0.0.1
 * @dependencies    jQuery
 */
Anchormenu = {

    /**
     *  @var    {Object}  config    All parameters are optional
     */
     config: {
        idMenu:             'anchormenu',
        classUl:            '',
        classLi:            '',
        addHeadline:        true,
        headlineText:       'Contents:',
        applyDefaultStyle:  true,            // Render inline style tag w/ default look?
        scroll:     {
            duration:       300,
            anchorOffset:   0
        }
    },

    /**
     *  @var    {Element[]}
     */
    linkedAnchors: {},

    /**
     * @param   {Element}   elementBefore    Element after which to insert the menu into DOM
     * @param   {Object}    config
     * @return  {Element}
     */
    init: function(elementBefore, config) {
        this.initConfig(config);

        elementBefore.append( this.renderMenu() );
        var elementMenu = this.getMenu();

        if( jQuery.isEmptyObject(this.linkedAnchors) || this.linkedAnchors.length == 0 ) {
            elementMenu.hide();
        } else {
            if( this.config.applyDefaultStyle ) {
                this.setDefaultStyle(elementMenu);
            }
            this.setHighlighterStyle( elementMenu.width() );
            this.installHighlighterScrollObserver();
        }

        this.initLinks();

        return elementMenu;
    },

    /**
     * @return  {Element}
     */
    getMenu: function() {
        return jQuery('#' + this.config.idMenu);
    },

    /**
     * @param   {Object}  config
     */
    initConfig: function(config) {
        if( 'idMenu' in config ) {
            this.config.idMenu  = config.idMenu;
        }
        if( 'classUl' in config ) {
            this.config.classUl  = config.classUl;
        }
        if( 'classLi' in config ) {
            this.config.classLi  = config.classLi;
        }

        if( 'addHeadline' in config ) {
            this.config.addHeadline  = config.addHeadline;
        }
        if( 'headlineText' in config ) {
            this.config.headlineText  = config.headlineText;
        }

        if( 'applyDefaultStyle' in config ) {
            this.config.applyDefaultStyle  = config.applyDefaultStyle;
        }

        if( 'scroll' in config ) {
            this.config.scroll  = config.scroll;
        }
    },

    /**
     * @return  {String}
     */
    renderMenu: function() {
        var classLi = !!this.config.classUl.trim() ? ' class="'+ this.config.classUl + '"' : '';

        return '<div id="' + this.config.idMenu + '">'
                + (this.config.addHeadline ? ('<h1>' + this.config.headlineText + '</h1>') : '')
                + '<ul' + classLi + '>'
                    + this.renderLinks()
                + '</ul>'
            + '</div>';
    },

    /**
     * @return {String}
     */
    renderLinks: function() {
        var classLi         = (!!this.config.classLi.trim() ? ' class="'+ this.config.classLi + '"' : '');
        var prefixLinkId    = this.config.idMenu;
        var linksHtml       = '';
        var anchors         = {};

        jQuery('a').each(function(index) {
            if ( this.name.length > 0 ) {
                var idLink      = index+1;
                var elementId   = prefixLinkId + 'link' + idLink;

                linksHtml +=
                    '<li' + classLi + '>'
                        + '<a id="' + elementId + '" href="javascript:void(0)">' + this.name.replace(/\-/g, ' ') + '</a>'
                  + '</li>';

                anchors[idLink] = {
                    idLink:       elementId,
                    nameAnchor:   this.name
                };
            }
        });

        this.linkedAnchors    = anchors;

        return '<div id="' + prefixLinkId + 'linkhighlighter"></div>' + "\n" + linksHtml;
    },

    /**
     * @param   {Element}  element
     */
    setDefaultStyle: function(element) {
        element.css({
            'padding':          '8px 10px 12px',
            'position':         'fixed',
            'top':              '158px',
            'z-index':          '60000'
        });
    },

    /**
     * @param   {Number}  width
     */
    setHighlighterStyle: function(width) {
        jQuery('#' + this.config.idMenu + 'linkhighlighter').css({
            'background-color': '#ECECEC',
            'height':           '20px',
            'margin':           '10px 0 -25px -4px',
            'padding':          '2px 10px',
            'width':            width + 'px',
            'z-index':          '59999'
        });
    },

    /**
     * Move anchor link highlighter relatively to page scrolltop
     */
    installHighlighterScrollObserver: function() {
        var anchorOffsets       = this.getAnchorOffsets();
        var offsetsInMenu       = anchorOffsets[0].split(",");
        var offsetsInDom        = anchorOffsets[1].split(",");
        var scrollAnchorOffset  = this.config.scroll.anchorOffset;

        var idHighlighter   = this.config.idMenu + 'linkhighlighter';

        jQuery(document).scroll(function() {
            var $this       = jQuery(this);
            var scrollTop   = $this.scrollTop();
            var highlighter = jQuery('#' + idHighlighter);

            var indexPrevious   = 0;
            var indexNext       = 0;
            var isFoundNext     = false;

            jQuery.each(offsetsInDom, function(index, value) {
                if( value <= scrollTop ) {
                    indexPrevious = index;
                } else if( value > scrollTop && !isFoundNext ) {
                    indexNext   = index;
                    isFoundNext = true;
                }
            });

            var offset  = (offsetsInMenu[ indexPrevious ] - offsetsInMenu[0]);

            var distanceFullInDom = ( offsetsInDom[indexPrevious+1] - offsetsInDom[indexPrevious] );
            var distanceDone = (scrollTop - scrollAnchorOffset) - offsetsInDom[indexPrevious];
            var percentDone  = (distanceDone / distanceFullInDom) * 100;

            var distanceFullInMenu = ( offsetsInMenu[indexPrevious+1] - offsetsInMenu[indexPrevious] );
            var distanceDoneInMenu = distanceFullInMenu/100 * percentDone;

            if( percentDone > 0 ) {
                offset+= distanceDoneInMenu;
            }

            var offsetMax   = (offsetsInMenu[ offsetsInMenu.length-1 ] - offsetsInMenu[0]);

            if( offset < 0 ) {
                offset = 0;
            } else if( offset > offsetMax ) {
                offset = offsetMax;
            } else if( document.documentElement.clientHeight + jQuery(document).scrollTop() >= document.body.offsetHeight  ) {
                    // Bottom reached?
                offset = offsetMax;
            }

            highlighter.css({
                'margin-top':      (10 + offset) + 'px',
                'margin-bottom':   (-25 - offset) + 'px'
            });
        });
    },

    /**
     * @returns {Array}     Lists of anchor offsets in 1. menu, 2. DOM. Ex: ['100,400,450,...', '10,20,30,...']
     */
    getAnchorOffsets: function() {
        var offsets = ['', ''];

        jQuery.each(this.linkedAnchors, function(index, linkAnchor) {
            offsets[0] += jQuery('#' + linkAnchor.idLink).offset().top + ',';
            offsets[1] += jQuery('a[name=' + linkAnchor.nameAnchor + ']').offset().top + ',';
        });

        offsets[0]  = offsets[0].substr(0, offsets[0].length-1);
        offsets[1]  = offsets[1].substr(0, offsets[1].length-1);

        return offsets;
    },

    /**
     * Scroll to given position
     *
     * @param   {Element}   anchor
     * @param   {Number}    offset
     * @param   {Number}    duration
     */
    scrollToAnchor: function(anchor, offset, duration) {
        var anchorTop   = anchor.offset().top;

        jQuery("html, body").animate({
            scrollTop: (anchorTop + offset) + "px"
        }, {
            duration:   duration,
            easing:     "swing"
        });
    },

    /**
     * Add functionality to scroll to anchors of clicked links in menu
     */
    initLinks: function() {
        var scrollDuration  = this.config.scroll.duration;
        var anchorOffset    = this.config.scroll.anchorOffset;

        jQuery.each(this.linkedAnchors, function(index, linkAnchor) {
            var currentLink    = jQuery('#' + linkAnchor.idLink);
            var currentAnchor  = jQuery('a[name=' + linkAnchor.nameAnchor + ']');

            currentLink.bind('click', function() {
                Anchormenu.scrollToAnchor( currentAnchor, anchorOffset, scrollDuration );
            });
        });
    }
};