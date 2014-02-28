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
     * @param   {Element}   elementBefore    Element after which to insert the menu into DOM
     * @param   {String}    [idMenu]      Default: 'anchormenu'
     * @param   {String}    [classUl]
     * @param   {String}    [classLi]
     * @return  {Element}
     */
    init: function(elementBefore, idMenu, classUl, classLi) {
        idMenu  = typeof idMenu  != 'undefined' ? idMenu : 'anchormenu';
        classUl = typeof classUl != 'undefined' ? classUl : '';
        classLi = typeof classLi != 'undefined' ? classLi : '';

        var menuHtml = this.renderMenu(idMenu, classUl, classLi);
        elementBefore.append( menuHtml );

        return jQuery('#' + idMenu);
    },

    /**
     * @param   {String}    idMenu
     * @param   {String}    classUl
     * @param   {String}    classLi
     * @return  {String}
     */
    renderMenu: function(idMenu, classUl, classLi) {
        return '<div id="' + idMenu + '">'
                + '<ul' + (!!classUl.trim() ? ' class="'+ classUl + '"' : '') + '>'
                    + this.renderLinks(classLi)
                + '</ul>'
            + '</div>';
    },

    /**
     * @return {String}
     */
    renderLinks: function(classLi) {
        var links   = '';

        jQuery('a').each(function() {
            if ( this.name.length > 0 ) {
                links +=
                    '<li' + (!!classLi.trim() ? ' class="'+ classLi + '"' : '') + '>'
                        + '<a href="#' + this.name + '">' + this.name.replace('-', ' ') + '</a>'
                  + '</li>';
            }
        });

        return links;
    }
};