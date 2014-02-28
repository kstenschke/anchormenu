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

        if( this.config.applyDefaultStyle ) {
            this.setDefaultStyle(elementMenu);
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
                        + '<a id="' + elementId + '" href="javascript:void(0)">' + this.name.replace('-', ' ') + '</a>'
                  + '</li>';

                anchors[idLink] = {
                    idLink:       elementId,
                    nameAnchor:   this.name
                };
            }
        });

        this.linkedAnchors    = anchors;

        return linksHtml;
    },

    /**
     * @param   {Element}  element
     */
    setDefaultStyle: function(element) {
        element.css({
            'background-color': '#fff',
            'border':           '1px solid #ccc',
            'padding':          '8px 10px 12px',
            'position':         'fixed',
            'top':              '90px',
            'z-index':          '60000'
        });
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
            var link    = jQuery('#' + linkAnchor.idLink);
            var anchor  = jQuery('a[name=' + linkAnchor.nameAnchor + ']');

            link.bind('click', function() {
                Anchormenu.scrollToAnchor( anchor, anchorOffset, scrollDuration );
            });
        });
    }
};