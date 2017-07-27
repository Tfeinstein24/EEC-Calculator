define(['dojo/_base/declare',
        'jimu/BaseWidget',
        'jimu/LayerInfos/LayerInfos',
        'dijit/form/Select'
      ],
function(declare,
         BaseWidget,
         LayerInfos,
         Select
        ) {
  //To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget], {
    // DemoWidget code goes here

    //please note that this property is be set by the framework when widget is loaded.
    //templateString: template,

    baseClass: 'jimu-widget-demo',

    layers: [],

    layerList: null,

    postCreate: function() {
      this.inherited(arguments);
      console.log('postCreate');
    },

    startup: function() {
      this.inherited(arguments);
      this.mapIdNode.innerHTML = 'map id:' + this.map.id;
      console.log('startup');
    },

    onOpen: function(){
      console.log('onOpen');
      var me = this;
                var oldValue = this.layerList ? this.layerList.value : null;
                var oldExists = false;
                this.test.innerHTML = 'color';
                this.test.style.color = this.config.color;

                LayerInfos.getInstance(this.map, this.map.itemInfo).then(function(layerInfosObject) {
                    me.layers = layerInfosObject.getLayerInfoArray();
                });

                var layerListDiv = document.getElementById('layerListDiv');

                layerListDiv.innerHTML = '';

                var layerOptions = [];
                layerOptions.push({label: "Select a Layer", value: "", disabled:"true"});
                this.layers.forEach(function(layer) {
                    layerOptions.push({label: layer.title, value: layer.id});
                    if (oldValue && layer.id === oldValue) {
                        oldExists = true;
                    }
                });

                this.layerList = new Select({
                    name: "selectedLayer",
                    options: layerOptions
                });

                if (oldExists) {
                    this.layerList.value = oldValue;
                    this.layerList.options.forEach(function(option) {
                        option.selected = (oldValue === option.value);
                    });
                }

                this.layerList.on('change', function() {
                    me.publishData({michael: me.layerList.value});
                });

                this.layerList.placeAt(layerListDiv).startup();
    },

    onClose: function(){
      console.log('onClose');
    },

    onMinimize: function(){
      console.log('onMinimize');
    },

    onMaximize: function(){
      console.log('onMaximize');
    },

    onSignIn: function(credential){
      /* jshint unused:false*/
      console.log('onSignIn');
    },

    onSignOut: function(){
      console.log('onSignOut');
    },

    showVertexCount: function(count){
      this.vertexCount.innerHTML = 'The vertex count is: ' + count;
    },

    toggleLayer: function() {
                console.log('toggleLayer');
                var selection = this.layerList.value;
                if (selection) {
                    var chosenLayer;
                    this.layers.some(function(layer) {
                        if (layer.id === selection) {
                            chosenLayer = layer;
                            return true;
                        }
                    });
                    this.map._layerDivs[chosenLayer.id].rawNode.classList.toggle('hide');
                }
            }
  });
});