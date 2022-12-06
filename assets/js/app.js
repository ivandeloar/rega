{ % -capture section_settings - % } {
    "enableHistoryState": true,
    "showInventoryQuantity": { % if section.settings.show_inventory_quantity % }
    true { %
        else %
    }
    false { % endif % },
    "showThumbnails": { % if section.settings.show_thumbnails % }
    true { %
        else %
    }
    false { % endif % },
    "inventoryQuantityThreshold": {
        { section.settings.inventory_quantity_threshold }
    },
    "enableImageZoom": { % if section.settings.enable_image_zoom % }
    true { %
        else %
    }
    false { % endif % },
    "showPaymentButton": {
        { section.settings.show_payment_button | json }
    },
    "useAjaxCart": { % if settings.cart_type == 'drawer' % }
    true { %
        else %
    }
    false { % endif % }
} { % -endcapture - % }

<
section class = "Product Product--{{ section.settings.image_size }}"
data - section - id = "{{ section.id }}"
data - section - type = "product"
data - section - settings = '{{ section_settings }}' >
    <
    div class = "Product__Wrapper" > { % -capture action_list_items - % } { % - if section.settings.enable_image_zoom - % } <
    div class = "Product__ActionItem hidden-lap-and-up" >
    <
    button class = "RoundButton RoundButton--small RoundButton--flat"
data - action = "open-product-zoom" > { % include 'icon'
        with 'plus' %
    } < /button> < /
    div > { % -endif - % }

{ % - if section.settings.show_share_buttons - % } <
div class = "Product__ActionItem" >
    <
    button class = "RoundButton RoundButton--small RoundButton--flat"
data - action = "toggle-social-share"
data - animate - bottom aria - expanded = "false" >
    <
    span class = "RoundButton__PrimaryState" > { % include 'icon'
        with 'share' %
    } < /span> <
span class = "RoundButton__SecondaryState" > { % include 'icon'
        with 'close' %
    } < /span> < /
    button >

    { % -assign share_url = shop.url | append: product.url - % } { % -assign twitter_text = product.title - % } { % -assign pinterest_description = product.description | strip_html | truncatewords: 15 | url_param_escape - % } { % -assign pinterest_image = product.featured_image | img_url: 'large' | prepend: 'https:' - % }

<
div class = "Product__ShareList"
aria - hidden = "true" >
    <
    a class = "Product__ShareItem"
href = "https://www.facebook.com/sharer.php?u={{ share_url }}"
target = "_blank"
rel = "noopener" > { % -include 'icon'
    with 'facebook' - %
}
Facebook < /a> <
a class = "Product__ShareItem"
href = "https://pinterest.com/pin/create/button/?url={{ share_url }}{% if pinterest_image != blank %}&media={{ pinterest_image }}{% endif %}&description={{ pinterest_description }}"
target = "_blank"
rel = "noopener" > { % -include 'icon'
    with 'pinterest' - %
}
Pinterest < /a> <
a class = "Product__ShareItem"
href = "https://twitter.com/share?{% if twitter_text != blank %}text={{twitter_text}}&{% endif %}url={{ share_url }}"
target = "_blank"
rel = "noopener" > { % -include 'icon'
    with 'twitter' - %
}
Twitter < /a> < /
    div > <
    /div> { % -endif - % } { % -endcapture - % }

{ % -comment - % }
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
PRODUCT GALLERY
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --{ % -endcomment - % }

{ % -assign initial_image_id = product.featured_image.id - % } { % -assign initial_image_index = 0 - % } { % -assign image_count = 0 - % }

{ % -capture slideshow_images - % } { % - for image in product.images - % } { % -
    if image.alt == 'featured'
    or image.alt == 'featured mobile' - %
} { % - continue - % } { % -endif - % }

{ % - if image.id == product.selected_or_first_available_variant.image.id - % } { % -assign initial_image_index = image_count - % } { % -assign initial_image_id = image.id - % } { % -endif - % }

{ % -include 'image-size', sizes: '200,400,600,700,800,900,1000,1200,1400,1600', image: image - % }

{ % -assign is_video = false - % }

{ % -
    if image.alt contains 'youtube.com/embed'
    or image.alt contains 'player.vimeo.com' - %
} { % -assign is_video = true - % } { % -endif - % }

<
div id = "Image{{ image.id }}"
class = "Product__SlideItem Product__SlideItem--{% if is_video %}video{% else %}image{% endif %} Carousel__Cell {% if initial_image_id == image.id %}is-selected{% endif %}" { % if is_video % }
data - action = "open-modal"
aria - controls = "modal-video-{{ image.id }}" { % endif % } { % unless is_video % }
data - image - position - ignoring - video = "{% increment image_position_without_video %}" { % endunless % }
data - image - position = "{% increment image_position %}"
data - image - id = "{{ image.id }}" >
    <
    div class = "AspectRatio AspectRatio--withFallback"
style = "padding-bottom: {{ 100.0 | divided_by: image.aspect_ratio }}%; --aspect-ratio: {{ image.aspect_ratio }};" > { % assign image_url = image | img_url: '1x1' | replace: '_1x1.', '_{width}x.' % }

<
img class = "Image--lazyLoad Image--fadeIn" { % if initial_image_id == image.id % }
src = "{{ image | img_url: '250x' }}" { % endif % }
data - src = "{{ image_url }}"
data - widths = "[{{ supported_sizes }}]"
data - sizes = "auto"
data - expand = "-100"
alt = "{{ image.alt | escape }}"
data - max - width = "{{ image.width }}"
data - max - height = "{{ image.height }}"
data - original - src = "{{ image | img_url: 'master' }}" >

    <
    span class = "Image__Loader" > < /span>

{ % - if is_video - % } <
button type = "button"
class = "Video__PlayButton"
aria - label = "{{ 'home_page.featured_video.play' | t }}" > { % include 'icon'
    with 'play' %
} < /button> { % -endif - % }

<
noscript >
    <
    img src = "{{ image | img_url: '800x' }}"
alt = "{{ image.alt | escape }}" >
    <
    /noscript> < /
    div > <
    /div>

{ % -assign image_count = image_count | plus: 1 - % } { % -endfor - % } { % -endcapture - % }

{ % - if product.images.size > 0 - % } <
div class = "Product__Gallery {% if section.settings.show_thumbnails and image_count > 1 %}Product__Gallery--withThumbnails{% else %}Product__Gallery--withDots{% endif %}" >
    <
    span id = "ProductGallery"
class = "Anchor" > < /span>

{ % - if action_list_items != blank - % } <
div class = "Product__ActionList hidden-lap-and-up" > {
        { action_list_items }
    } <
    /div> { % -endif - % }

{ % - if image_count > 1 - % } { % - if section.settings.show_thumbnails - % } <
div class = "Product__SlideshowNav Product__SlideshowNav--thumbnails" >
    <
    div class = "Product__SlideshowNavScroller" > { % - for image in product.images - % } { % -
        if image.alt == 'featured'
        or image.alt == 'featured mobile' - %
    } { % - continue - % } { % -endif - % }

{ % -assign is_video = false - % }

{ % -
    if image.alt contains 'youtube.com/embed'
    or image.alt contains 'player.vimeo.com' - %
} { % -assign is_video = true - % } { % -endif - % }

<
a href = "#Image{{ image.id }}"
class = "Product__SlideshowNavImage {% if is_video %}Product__SlideshowNavImage--video{% endif %} AspectRatio {% if forloop.first %}is-selected{% endif %}"
style = "--aspect-ratio: {{ image.aspect_ratio }}" >
    <
    img src = "{{ image | img_url: '160x' }}" >

    { % - if is_video - % } <
    button type = "button"
class = "Product__SlideshowNavPlay"
data - action = "play-video"
aria - label = "{{ 'home_page.featured_video.play' | t }}" > { % include 'icon'
        with 'play' %
    } < /button> { % -endif - % } < /
    a > { % -endfor - % } <
    /div> < /
    div > { % -endif - % }

<
div class = "Product__SlideshowNav Product__SlideshowNav--dots" >
    <
    div class = "Product__SlideshowNavScroller" > { % - for image in product.images - % } { % -
        if image.alt == 'featured'
        or image.alt == 'featured mobile' - %
    } { % - continue - % } { % -endif - % }

<
a href = "#Image{{ image.id }}"
class = "Product__SlideshowNavDot {% if forloop.first %}is-selected{% endif %}" > < /a> { % -endfor - % } < /
    div > <
    /div> { % -endif - % }

{ % -capture flickity_options - % } {
    "prevNextButtons": false,
    "pageDots": { % if image_count > 1 % }
    true { %
        else %
    }
    false { % endif % },
    "adaptiveHeight": true,
    "wrapAround": false,
    "watchCSS": true,
    "dragThreshold": 8,
    "initialIndex": {
        { initial_image_index }
    }
} { % -endcapture - % }

<
div class = "Product__Slideshow {% if section.settings.enable_image_zoom %}Product__Slideshow--zoomable{% endif %} Carousel"
data - flickity - config = '{{ flickity_options }}' > {
        { slideshow_images }
    } <
    /div> < /
    div > { % -endif - % }

{ % -capture product_aside - % } { % -comment - % }
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
PRODUCT TABS
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --{ % -endcomment - % }

{ % -include 'product-tabs' - % }

{ % -comment - % }
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
PRODUCT WEAR IT WITH

We allow merchants to add a tag that looks like __with: product - handle to feature an additional product
    -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --{ % -endcomment - % }

{ % - for tag in product.tags - % } { % - if tag contains '__with' - % } { % -assign product_handle = tag | split: '__with:' | last - % } { % -assign associated_product = all_products[product_handle] - % }

{ % - if associated_product != empty - % } <
div class = "Section Section--spacingNormal" >
    <
    header class = "SectionHeader SectionHeader--center" >
    <
    h3 class = "SectionHeader__Heading Heading u-h4" > {
        { 'product.buy_it_with.title' | t }
    } < /h3> < /
    header >

    { % include 'product-item', product: associated_product, use_horizontal: true, show_labels: false, show_product_info: true, show_price_on_hover: false % } <
    /div>

{ % - break - % } { % -endif - % } { % -endif - % } { % -endfor - % } { % -endcapture - % }

<
div class = "Product__InfoWrapper" >
    <
    div class = "Product__Info {% if image_count == 0 %}Product__Info--noGallery{% endif %}" >
    <
    div class = "Container" > { % -include 'product-meta', show_description: true - % } { % -include 'product-form' - % }

{ % - if section.settings.description_below_add_to_cart - % } <
div class = "ProductMeta__Description Rte" > {
        { product.description }
    } <
    /div> { % -endif - % }

{ % - if product_aside != blank and image_count > 0 - % } <
div class = "Product__QuickNav hidden-pocket" >
    <
    div class = "Product__QuickNavWrapper" >
    <
    a href = "#ProductAside"
class = "Heading Link Link--secondary u-h7" > {
    { 'product.form.view_info' | t }
} { % include 'icon'
    with 'select-arrow-right' %
} < /a> <
a href = "#ProductGallery"
class = "Heading Link Link--secondary u-h7" > {
        { 'product.form.view_images' | t }
    } { % include 'icon'
        with 'select-arrow-right' %
    } < /a> < /
    div > <
    /div> { % -endif - % } < /
    div > <
    /div>

{ % - if action_list_items != blank - % } <
div class = "Product__ActionList hidden-pocket" > {
        { action_list_items }
    } <
    /div> { % -endif - % } < /
    div >

    { % - if product_aside != blank - % } <
    div class = "Product__Aside" >
    <
    span id = "ProductAside"
class = "Anchor" > < /span> { {-product_aside - }
} <
/div> { % -endif - % } < /
div >

    { % -comment - % }
    -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
    OFF SCREEN ELEMENTS
    -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --{ % -endcomment - % }

{
    {-product_popovers - }
} {
    {-product_modals - }
} <
/section>

{ % -comment - % }
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
FEATURED IMAGE

We allow merchants to use one image as a "featured image"
by adding the alt tag "featured"
    -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --{ % -endcomment - % }

{ % - for image in product.images - % } { % - if image.alt == 'featured' - % } { % -assign desk_featured_image = image - % } { % -endif - % }

{ % - if image.alt == 'featured mobile' - % } { % -assign mobile_featured_image = image - % } { % -endif - % } { % -endfor - % }

{ % - if desk_featured_image or mobile_featured_image - % } { % -assign mobile_featured_image = mobile_featured_image |
        default: desk_featured_image - %
} { % -assign desk_featured_image = desk_featured_image |
        default: mobile_featured_image - %
}

<
div class = "Product__FeatureImageWrapper"
style = "background: url({{ desk_featured_image | img_url: '1x1', format: 'jpg' }})" >
    <
    div class = "Product__FeatureImage Product__FeatureImage--{{ section.settings.featured_image_size }} Image--lazyLoad Image--zoomOut hide-no-js"
data - expand = "-25"
data - bgset = "{{ mobile_featured_image | img_url: '750x850' }} [(max-width: 640px)] | {{ desk_featured_image | img_url: '1500x' }}" > < /div>

<
noscript >
    <
    div class = "Product__FeatureImage Product__FeatureImage--{{ section.settings.featured_image_size }}"
style = "background-image: url({{ desk_featured_image | img_url: '1500x' }})" > < /div> < /
    noscript > <
    /div>

<
style > #shopify - section - {
        { section.id }
    } + .shopify - section--bordered {
        border - top: 0;
    } <
    /style> { % -
else - %
} <
style >
    /* Very ugly haha */

    @media screen and(max - width: 640 px) {#
        shopify - section - {
            { section.id }
        } + .shopify - section--bordered {
            border - top: 0;
        }

        #
        shopify - section - {
            { section.id }
        } + .shopify - section--bordered > .Section {
            padding - top: 0;
        }
    } <
    /style> { % -endif - % }

{ % -comment - % }
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
MODALS

If we have some videos, we implement them as modal
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --{ % -endcomment - % }

{ % - for image in product.images - % } { % -
    if image.alt contains 'youtube.com/embed'
    or image.alt contains 'player.vimeo.com' - %
} <
div id = "modal-video-{{ image.id }}"
class = "Modal Modal--fullScreen Modal--videoContent"
aria - hidden = "true"
role = "dialog"
data - scrollable >
    <
    div class = "Modal__Content" >
    <
    div class = "Container Container--narrow" >
    <
    div class = "VideoWrapper" > { % if image.alt contains 'youtube.com/embed' % } <
    iframe class = "Image--lazyLoad"
data - src = "{{ image.alt }}?autoplay=1&showinfo=0&controls=1&rel=0&modestbranding=1"
frameborder = "0"
allowfullscreen > < /iframe> { %
else %
} <
iframe class = "Image--lazyLoad"
data - src = "{{ image.alt }}?autoplay=1&portrait=0&byline=0&color={{ settings.accent_color | remove_first: '#' }}"
frameborder = "0" > < /iframe> { % endif % } < /
    div > <
    /div> < /
    div >

    <
    button class = "Modal__Close Modal__Close--outside"
data - animate - bottom data - action = "close-modal" > { % include 'icon'
        with 'close' %
    } < /button> < /
    div > { % -endif - % } { % -endfor - % }

{ % -comment - % }
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
PHOTO SWIPE

This is the root container
for the zoom functionality.Must not be removed, as order element is important.
    -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --{ % -endcomment - % }

{ % - if section.settings.enable_image_zoom - % } <
div class = "pswp"
tabindex = "-1"
role = "dialog"
aria - hidden = "true" >
    <!-- Background of PhotoSwipe -->
    <
    div class = "pswp__bg" > < /div>

<!-- Slides wrapper with overflow:hidden. -->
<
div class = "pswp__scroll-wrap" >

    <!-- Container that holds slides. Do not remove as content is dynamically added -->
    <
    div class = "pswp__container" >
    <
    div class = "pswp__item" > < /div> <
div class = "pswp__item" > < /div> <
div class = "pswp__item" > < /div> < /
    div >

    <!-- Main UI bar -->
    <
    div class = "pswp__ui pswp__ui--hidden" >
    <
    button class = "pswp__button pswp__button--prev RoundButton"
data - animate - left title = "{{ 'product.slideshow.previous' | t }}" > { % include 'icon'
    with 'arrow-left' %
} < /button> <
button class = "pswp__button pswp__button--close RoundButton RoundButton--large"
data - animate - bottom title = "{{ 'product.slideshow.close' | t }}" > { % include 'icon'
    with 'close' %
} < /button> <
button class = "pswp__button pswp__button--next RoundButton"
data - animate - right title = "{{ 'product.slideshow.next' | t }}" > { % include 'icon'
        with 'arrow-right' %
    } < /button> < /
    div > <
    /div> < /
    div > { % -endif - % }

{ % schema % } {
    "name": "Product page",
    "class": "shopify-section--bordered",
    "settings": [{
            "type": "checkbox",
            "id": "show_share_buttons",
            "label": "Show social sharing buttons",
            "default": true
        },
        {
            "type": "checkbox",
            "id": "show_vendor",
            "label": "Show vendor",
            "default": true
        },
        {
            "type": "checkbox",
            "id": "description_below_add_to_cart",
            "label": "Description below add to cart",
            "default": false
        },
        {
            "type": "checkbox",
            "id": "show_color_swatch",
            "label": "Show color swatch",
            "default": true,
            "info": "Some colors appear white? [Learn more](http://support.maestrooo.com/article/80-product-uploading-custom-color-for-color-swatch)."
        },
        {
            "type": "checkbox",
            "id": "show_color_carousel",
            "label": "Show color carousel",
            "info": "A selector will appear with variant image previews when choosing colors.",
            "default": false
        },
        {
            "type": "checkbox",
            "id": "show_quantity_selector",
            "label": "Show quantity selector",
            "default": true
        },
        {
            "type": "checkbox",
            "id": "show_inventory_quantity",
            "label": "Show inventory quantity",
            "info": "Make sure that your inventory is tracked. [Learn more](https://help.shopify.com/manual/products/inventory#set-up-inventory-tracking).",
            "default": false
        },
        {
            "type": "range",
            "id": "inventory_quantity_threshold",
            "label": "Inventory quantity threshold",
            "info": "Only show inventory quantity if below threshold. Choose 0 to always show.",
            "min": 0,
            "max": 50,
            "step": 1,
            "default": 0
        },
        {
            "type": "checkbox",
            "id": "show_payment_button",
            "label": "Show dynamic checkout button",
            "info": "Lets customers check out directly using a familiar payment method. [Learn more](https://help.shopify.com/manual/using-themes/change-the-layout/dynamic-checkout)",
            "default": false
        },
        {
            "type": "header",
            "content": "Product images"
        },
        {
            "type": "select",
            "id": "image_size",
            "label": "Size",
            "options": [{
                    "value": "small",
                    "label": "Small"
                },
                {
                    "value": "medium",
                    "label": "Medium"
                },
                {
                    "value": "large",
                    "label": "Large"
                },
                {
                    "value": "fill",
                    "label": "Fill screen"
                }
            ],
            "default": "large"
        },
        {
            "type": "checkbox",
            "id": "enable_image_zoom",
            "label": "Enable zoom",
            "default": true
        },
        {
            "type": "checkbox",
            "id": "show_thumbnails",
            "label": "Show thumbnails",
            "info": "Only applicable on large screens",
            "default": true
        },
        {
            "type": "header",
            "content": "Tabs"
        },
        {
            "type": "page",
            "id": "tab_page_1_handle",
            "label": "First page"
        },
        {
            "type": "page",
            "id": "tab_page_2_handle",
            "label": "Second page"
        },
        {
            "type": "paragraph",
            "content": "The theme also allows you to add specific tabs for a given product only. [Learn more about this feature](http://support.maestrooo.com/article/83-product-adding-different-tabs-per-product)."
        },
        {
            "type": "header",
            "content": "Reviews"
        },
        {
            "type": "paragraph",
            "content": "You need to install [Shopify's free Product Reviews](https://apps.shopify.com/product-reviews) app before enabling this option."
        },
        {
            "type": "checkbox",
            "id": "reviews_enabled",
            "label": "Enable",
            "default": false
        },
        {
            "type": "header",
            "content": "Featured image"
        },
        {
            "type": "paragraph",
            "content": "You can highlight an image after product tabs by adding the ALT tag \"featured\" to a given image. [Learn more](http://support.maestrooo.com/article/152-product-highlight-a-featured-image)."
        },
        {
            "type": "select",
            "id": "featured_image_size",
            "label": "Section size",
            "options": [{
                    "value": "small",
                    "label": "Small"
                },
                {
                    "value": "normal",
                    "label": "Normal"
                },
                {
                    "value": "large",
                    "label": "Large"
                }
            ],
            "default": "large"
        }
    ]
} { % endschema % }

{ % if product.metafields.loox.num_reviews % } <
script id = "looxSchemaJson"
type = "application/ld+json" > {
        "@context": "http://schema.org",
        "@type": "Product",
        "@id": {
            { canonical_url | json }
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "{{ product.metafields.loox.avg_rating }}",
            "reviewCount": "{{ product.metafields.loox.num_reviews }}"
        },
        "name": {
            { product.title | json }
        }
    } <
    /script> { % endif % }


<
div id = "looxReviews"
data - product - id = "{{product.id}}"
class = "loox-reviews-default" > {
    { product.metafields.loox.reviews }
} < /div>