!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(require("google-maps"),require("leaflet"),require("react-leaflet")):"function"==typeof define&&define.amd?define(["google-maps","leaflet","react-leaflet"],e):"object"==typeof exports?exports.ReactLeaflet=e(require("google-maps"),require("leaflet"),require("react-leaflet")):t.ReactLeaflet=e(t.GoogleMapsLoader,t.L,t[void 0])}(window,function(t,e,i){return function(t){var e={};function i(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,i),o.l=!0,o.exports}return i.m=t,i.c=e,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)i.d(n,o,function(e){return t[e]}.bind(null,o));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=9)}([function(t,e){L.GridLayer.GoogleMutant=L.GridLayer.extend({options:{minZoom:0,maxZoom:23,tileSize:256,subdomains:"abc",errorTileUrl:"",attribution:"",opacity:1,continuousWorld:!1,noWrap:!1,type:"roadmap",maxNativeZoom:21},initialize:function(t){L.GridLayer.prototype.initialize.call(this,t),this._ready=!!window.google&&!!window.google.maps&&!!window.google.maps.Map,this._GAPIPromise=this._ready?Promise.resolve(window.google):new Promise(function(t,e){var i=0,n=null;n=setInterval(function(){return i>=10?(clearInterval(n),e(new Error("window.google not found after 10 attempts"))):window.google&&window.google.maps&&window.google.maps.Map?(clearInterval(n),t(window.google)):void i++},500)}),this._tileCallbacks={},this._freshTiles={},this._imagesPerTile="hybrid"===this.options.type?2:1,this._boundOnMutatedImage=this._onMutatedImage.bind(this)},onAdd:function(t){L.GridLayer.prototype.onAdd.call(this,t),this._initMutantContainer(),this._GAPIPromise.then(function(){if(this._ready=!0,this._map=t,this._initMutant(),t.on("viewreset",this._reset,this),t.on("move",this._update,this),t.on("zoomend",this._handleZoomAnim,this),t.on("resize",this._resize,this),google.maps.event.addListenerOnce(this._mutant,"idle",function(){this._checkZoomLevels(),this._mutantIsReady=!0}.bind(this)),t._controlCorners.bottomright.style.marginBottom="20px",t._controlCorners.bottomleft.style.marginBottom="20px",this._reset(),this._update(),this._subLayers)for(var e in this._subLayers)this._subLayers[e].setMap(this._mutant)}.bind(this))},onRemove:function(t){L.GridLayer.prototype.onRemove.call(this,t),t._container.removeChild(this._mutantContainer),this._mutantContainer=void 0,google.maps.event.clearListeners(t,"idle"),google.maps.event.clearListeners(this._mutant,"idle"),t.off("viewreset",this._reset,this),t.off("move",this._update,this),t.off("zoomend",this._handleZoomAnim,this),t.off("resize",this._resize,this),t._controlCorners&&(t._controlCorners.bottomright.style.marginBottom="0em",t._controlCorners.bottomleft.style.marginBottom="0em")},getAttribution:function(){return this.options.attribution},setOpacity:function(t){this.options.opacity=t,t<1&&L.DomUtil.setOpacity(this._mutantContainer,t)},setElementSize:function(t,e){t.style.width=e.x+"px",t.style.height=e.y+"px"},addGoogleLayer:function(t,e){return this._subLayers||(this._subLayers={}),this._GAPIPromise.then(function(){var i=new(0,google.maps[t])(e);return i.setMap(this._mutant),this._subLayers[t]=i,i}.bind(this))},removeGoogleLayer:function(t){var e=this._subLayers&&this._subLayers[t];e&&(e.setMap(null),delete this._subLayers[t])},_initMutantContainer:function(){this._mutantContainer||(this._mutantContainer=L.DomUtil.create("div","leaflet-google-mutant leaflet-top leaflet-left"),this._mutantContainer.id="_MutantContainer_"+L.Util.stamp(this._mutantContainer),this._mutantContainer.style.zIndex="800",this._mutantContainer.style.pointerEvents="none",this._map.getContainer().appendChild(this._mutantContainer)),this.setOpacity(this.options.opacity),this.setElementSize(this._mutantContainer,this._map.getSize()),this._attachObserver(this._mutantContainer)},_initMutant:function(){if(this._ready&&this._mutantContainer){this._mutantCenter=new google.maps.LatLng(0,0);var t=new google.maps.Map(this._mutantContainer,{center:this._mutantCenter,zoom:0,tilt:0,mapTypeId:this.options.type,disableDefaultUI:!0,keyboardShortcuts:!1,draggable:!1,disableDoubleClickZoom:!0,scrollwheel:!1,streetViewControl:!1,styles:this.options.styles||{},backgroundColor:"transparent"});this._mutant=t,google.maps.event.addListenerOnce(t,"idle",function(){for(var t=this._mutantContainer.querySelectorAll("a"),e=0;e<t.length;e++)t[e].style.pointerEvents="auto"}.bind(this)),this.fire("spawned",{mapObject:t})}},_attachObserver:function(t){new MutationObserver(this._onMutations.bind(this)).observe(t,{childList:!0,subtree:!0})},_onMutations:function(t){for(var e=0;e<t.length;++e)for(var i=t[e],n=0;n<i.addedNodes.length;++n){var o=i.addedNodes[n];o instanceof HTMLImageElement?this._onMutatedImage(o):o instanceof HTMLElement&&(Array.prototype.forEach.call(o.querySelectorAll("img"),this._boundOnMutatedImage),Array.prototype.forEach.call(o.querySelectorAll('div[draggable=false][style*="text-align: center"]'),L.DomUtil.remove))}},_roadRegexp:/!1i(\d+)!2i(\d+)!3i(\d+)!/,_satRegexp:/x=(\d+)&y=(\d+)&z=(\d+)/,_staticRegExp:/StaticMapService\.GetMapImage/,_onMutatedImage:function(t){var e,i=t.src.match(this._roadRegexp),n=0;if(i?(e={z:i[1],x:i[2],y:i[3]},this._imagesPerTile>1&&(t.style.zIndex=1,n=1)):((i=t.src.match(this._satRegexp))&&(e={x:i[1],y:i[2],z:i[3]}),n=0),e){var o=this._tileCoordsToKey(e);t.style.position="absolute",t.style.visibility="hidden";var a=o+"/"+n;if(this._freshTiles[a]=t,a in this._tileCallbacks&&this._tileCallbacks[a])this._tileCallbacks[a].pop()(t),this._tileCallbacks[a].length||delete this._tileCallbacks[a];else if(this._tiles[o]){var r=this._tiles[o].el,s=0===n?r.firstChild:r.firstChild.nextSibling,l=this._clone(t);r.replaceChild(l,s)}}else t.src.match(this._staticRegExp)&&(t.style.visibility="hidden")},createTile:function(t,e){var i=this._tileCoordsToKey(t),n=L.DomUtil.create("div");n.dataset.pending=this._imagesPerTile,e=e.bind(this,null,n);for(var o=0;o<this._imagesPerTile;o++){var a=i+"/"+o;if(a in this._freshTiles){var r=this._freshTiles[a];n.appendChild(this._clone(r)),n.dataset.pending--}else this._tileCallbacks[a]=this._tileCallbacks[a]||[],this._tileCallbacks[a].push(function(t){return function(i){t.appendChild(this._clone(i)),t.dataset.pending--,parseInt(t.dataset.pending)||e()}.bind(this)}.bind(this)(n))}return parseInt(n.dataset.pending)||L.Util.requestAnimFrame(e),n},_clone:function(t){var e=t.cloneNode(!0);return e.style.visibility="visible",e},_checkZoomLevels:function(){var t=this._map.getZoom(),e=this._mutant.getZoom();t&&e&&(e!==t||e>this.options.maxNativeZoom)&&this._setMaxNativeZoom(e)},_setMaxNativeZoom:function(t){t!=this.options.maxNativeZoom&&(this.options.maxNativeZoom=t,this._resetView())},_reset:function(){this._initContainer()},_update:function(){if(this._mutant){var t=this._map.getCenter(),e=new google.maps.LatLng(t.lat,t.lng);this._mutant.setCenter(e);var i=this._map.getZoom(),n=i!==Math.round(i),o=this._mutant.getZoom();n||i==o||(this._mutant.setZoom(i),this._mutantIsReady&&this._checkZoomLevels())}L.GridLayer.prototype._update.call(this)},_resize:function(){var t=this._map.getSize();this._mutantContainer.style.width===t.x&&this._mutantContainer.style.height===t.y||(this.setElementSize(this._mutantContainer,t),this._mutant&&google.maps.event.trigger(this._mutant,"resize"))},_handleZoomAnim:function(){if(this._mutant){var t=this._map.getCenter(),e=new google.maps.LatLng(t.lat,t.lng);this._mutant.setCenter(e),this._mutant.setZoom(Math.round(this._map.getZoom()))}},_removeTile:function(t){if(this._mutant)return setTimeout(this._pruneTile.bind(this,t),1e3),L.GridLayer.prototype._removeTile.call(this,t)},_pruneTile:function(t){for(var e=this._mutant.getZoom(),i=t.split(":")[2],n=this._mutant.getBounds(),o=n.getSouthWest(),a=n.getNorthEast(),r=L.latLngBounds([[o.lat(),o.lng()],[a.lat(),a.lng()]]),s=0;s<this._imagesPerTile;s++){var l=t+"/"+s;if(l in this._freshTiles){var u=this._map&&this._keyToBounds(t);this._map&&u.overlaps(r)&&i==e||delete this._freshTiles[l]}}}}),L.gridLayer.googleMutant=function(t){return new L.GridLayer.GoogleMutant(t)}},function(e,i){e.exports=t},function(t,i){t.exports=e},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a(i(2)),o=a(i(1));function a(t){return t&&t.__esModule?t:{default:t}}i(0);var r="SATELLITE",s=n.default.GridLayer.prototype,l=s.onRemove,u=s.onAdd,d=s._initTile;n.default.GridLayer.include({_initTile:function(t){d.call(this,t),t.style.transform="scale(1)"},onAdd:function(t){if(this._fadeOutTime){var e=performance.now()||+new Date;n.default.Util.cancelAnimFrame(this._fadeOutFrame),this._fadeOutTime=e+200-this._fadeOutTime+e,n.default.Util.requestAnimFrame(this._fadeIn,this)}else u.call(this,t)},onRemove:function(){if(this._fadeOutTime){var t=performance.now()||+new Date;this._fadeOutTime=t+200-this._fadeOutTime+t}this._fadeOutTime=(performance.now()||+new Date)+400,this._fadeOutMap=this._map,n.default.Util.requestAnimFrame(this._fadeOut,this)},_fadeOut:function(){if(this._fadeOutTime&&this._container){var t=performance.now()||+new Date,e=Math.min((this._fadeOutTime-t)/200,1);if(e<0)return this._fadeOutTime=!1,void l.call(this,this._fadeOutMap);n.default.DomUtil.setOpacity(this._container,e*this.options.opacity),this._fadeOutFrame=n.default.Util.requestAnimFrame(this._fadeOut,this)}},_fadeIn:function(){if(this._fadeOutTime&&this._container){var t=((performance.now()||+new Date)-this._fadeOutTime)/200;t>1?this._fadeOutTime=!1:(n.default.DomUtil.setOpacity(this._container,t*this.options.opacity),n.default.Util.requestAnimFrame(this._fadeIn,this))}}}),n.default.GridLayer.GoogleSubMutant=n.default.GridLayer.GoogleMutant.extend({initialize:function(t){n.default.GridLayer.GoogleMutant.prototype.initialize.call(this,t);var e=this;t.asClientId?(o.default.CLIENT=t.googleKey,o.default.VERSION=t.version):o.default.KEY=t.googleKey,t.language&&(o.default.LANGUAGE=t.language),t.region&&(o.default.REGION=t.region),o.default.LIBRARIES=t.libraries||[],e._type=t.type.toUpperCase()||r,o.default.load(function(i){e._ready=!0,e._initMutant(),e._update(),t.onAfterLoad&&t.onAfterLoad(i)})}}),n.default.gridLayer.googleSubMutant=function(t){return new n.default.GridLayer.GoogleSubMutant(t)},e.default=n.default.gridLayer.googleSubMutant},function(t,e){t.exports=i},function(t,e,i){"use strict";t.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},function(t,e,i){"use strict";var n=i(5);function o(){}t.exports=function(){function t(t,e,i,o,a,r){if(r!==n){var s=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw s.name="Invariant Violation",s}}function e(){return t}t.isRequired=t;var i={array:t,bool:t,func:t,number:t,object:t,string:t,symbol:t,any:t,arrayOf:e,element:t,instanceOf:e,node:t,objectOf:e,oneOf:e,oneOfType:e,shape:e,exact:e};return i.checkPropTypes=o,i.PropTypes=i,i}},function(t,e,i){t.exports=i(6)()},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.GOOGLE_LAYER_TYPES=e.ADDITIONAL_GOOGLE_LAYERS=void 0;var n=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),o=s(i(7)),a=i(4),r=s(i(3));function s(t){return t&&t.__esModule?t:{default:t}}var l=e.ADDITIONAL_GOOGLE_LAYERS={TRAFFIC_LAYER:"TrafficLayer",TRANSIT_LAYER:"TransitLayer"},u=e.GOOGLE_LAYER_TYPES={ROADMAP:"roadmap",SATELLITE:"satellite",TERRAIN:"terrain",HYDRID:"hybrid"},d=function(t){function e(){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,(e.__proto__||Object.getPrototypeOf(e)).apply(this,arguments))}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(e,a.GridLayer),n(e,[{key:"createLeafletElement",value:function(t){var e=t.additionalGoogleLayer,i=(0,r.default)(t);return e&&i.addGoogleLayer(e),i}},{key:"componentDidUpdate",value:function(t){var e=this.props,i=e.opacity,n=e.zIndex;i!==t.opacity&&this.leafletElement.setOpacity(i),n!==t.zIndex&&this.leafletElement.setZIndex(n)}}]),e}();d.propTypes={googleKey:o.default.string.isRequired,type:o.default.oneOf(Object.keys(u).map(function(t){return u[t]})),additionalGoogleLayer:o.default.oneOf(Object.keys(l).map(function(t){return l[t]})),asClientId:o.default.bool,language:o.default.string,region:o.default.string,libraries:o.default.array},d.defaultProps={type:u.TERRAIN},d.contextTypes=a.GridLayer.contextTypes,d.childContextTypes=a.GridLayer.childContextTypes,e.default=(0,a.withLeaflet)(d)},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.ADDITIONAL_GOOGLE_LAYERS=e.GOOGLE_LAYER_TYPES=void 0;var n=i(8),o=function(t){return t&&t.__esModule?t:{default:t}}(n);e.GOOGLE_LAYER_TYPES=n.GOOGLE_LAYER_TYPES,e.ADDITIONAL_GOOGLE_LAYERS=n.ADDITIONAL_GOOGLE_LAYERS;e.default=o.default}])});