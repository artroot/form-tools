/**
 * Created by artroot on 18.06.17.
 */

(function (formTools, undefined) {

    formTools.inits = {};

    var FT = formTools;

    var consts = {
        cp: {
            init: 'cp-init',
            options: 'cp-options',
            template: 'cp-template',
            viewport: 'cp-viewport',
            add: 'cp-add',
            rm: 'cp-rm',
            counter: 'cp-counter',
            inputs: 'cp-inputs'
        },
        setNulls:{
            init: 'set-nulls'
        }
    };

    function getElementsByAttr (parentNode, attrName, attrVal, tagName) {
        var res = (!parentNode ? document : parentNode).querySelectorAll((!tagName ? '*' : tagName) + '[' + attrName + (attrVal ? '="' + attrVal + '"]' : ']'));
        return (res.length > 1 ? res : res[0]);
    }

    function isset (needle, err, callback) {
        if(!needle){
            if (callback) return callback();
            else throw new Error(err);
        }else return needle;
    }

    function isObject (needle, err, callback) {
        if(typeof needle != 'object'){
            if (callback) return callback();
            else throw new Error(err);
        }else return needle;
    }

    function isEmpty (needle, err, callback) {
        if(needle.length < 1){
            if (callback) return callback();
            else throw new Error(err);
        }else return needle;
    }

    // INITIALIZATION OF FOUND
    // ==============

    function init (key, callback) {
        var init = getElementsByAttr(document, key);
        if (!init) return;
        else if (init && !init.tagName && 'length' in init && init.length > 1) for(var i = 0; i <= init.length; i++) callback(init[i]);
        else callback(init);
    }

    // PARSE PAGE FOR INITS
    // ==============

    FT.discovery = function () {
        init(consts.cp.init, function (init) {
            var initName = (init ? init.getAttribute(consts.cp.init).valueOf() : false);
            if (initName) FT.inits[initName] = new FT.clonePattern(init, init.getAttribute(consts.cp.options));
        });
        init(consts.setNulls.init, function (init) {
            if (init) {
                init.onchange = function () {
                    FT.setNulls(init);
                };
                FT.setNulls(init);
            }
        });
        return FT;
    };

    // PLACE GENERATOR
    // ==============

    FT.clonePattern = function (root, options) {
        var self = this, initName, timeout, interval;
        this.options = ((options && options.length > 0) ? (eval("(" + options + ")")) : {});

        try{
            isObject(root, 'Initialization area not found.');
            var initName = isEmpty(root.getAttribute(consts.cp.init), consts.cp.init+' ID not specified.');
            var viewport = isObject(getElementsByAttr(root, consts.cp.viewport), null, function(){
                return isObject(getElementsByAttr(document, consts.cp.viewport, initName), consts.cp.viewport+' is not marked');
            });
            var template = isObject(getElementsByAttr(viewport, consts.cp.template), consts.cp.template+' is not marked');
            var addBtn = isObject(getElementsByAttr(root, consts.cp.add), null, function(){
                return isObject(getElementsByAttr(document, consts.cp.add, initName), consts.cp.add+' button is not marked');
            });
            var inputs = isObject(getElementsByAttr(template, consts.cp.inputs), consts.cp.inputs+' is not marked');
            var setDelyEvents = {
                onmousedown: function(){
                    if (self.options.massAdd) {
                        self.timeout = setTimeout(function () {
                            self.interval = setInterval(function () {
                                for (var i = 1; i <= self.options.massAdd; i++) if(self.addNode() == false) break;
                            }, 1000);
                        }, 500);
                    }
                },
                onmouseup: function(){
                    clearTimeout(self.timeout);
                    if (self.interval) {clearInterval(self.interval); self.interval=null;}
                    else self.addNode();
                },
                onmouseleave: function(){
                    clearTimeout(self.timeout);
                    if (self.interval) {clearInterval(self.interval); self.interval=null;}
                }
            };

            if (isObject(addBtn, null, function(){return false;})){
                for(var event in setDelyEvents) addBtn[event] = setDelyEvents[event];
            }

            var rmBtnTemplate = isset(getElementsByAttr(template, consts.cp.rm),null, function(){});
            if (isObject(rmBtnTemplate, null, function(){return false;})){
                rmBtnTemplate.onclick = function(){
                    self.rmNode(getElementsByAttr(root, consts.cp.template));
                };
            }

            template = template.cloneNode(true);
        }catch(err){
            console.error(err.message);
            return;
        }

        this.addNode = function (data) {
            var self = this;
            if (this.options.maxNode && viewport.childElementCount >= this.options.maxNode) {
                alert(this.options.maxNodeMsg ? this.options.maxNodeMsg : 'Max. nodes not more '+this.options.maxNode);
                return false;
            }

            var newNode = template.cloneNode(true);
            var counter = getElementsByAttr(newNode, consts.cp.counter);
            if (counter) counter.innerHTML = viewport.childElementCount + 1;

            var rmBtn = getElementsByAttr(newNode, consts.cp.rm);
            if (typeof rmBtn == 'object'){
                rmBtn.onclick = function () {
                    self.rmNode(newNode);
                };
            }

            try{
                var inputs = isObject(getElementsByAttr(newNode, consts.cp.inputs), consts.cp.inputs+' is not marked');
                if (typeof data == 'object' && typeof inputs == 'object') {
                    var i = 0;
                    inputs = inputs.querySelectorAll('*[name]');
                    inputs.forEach(function (input) {
                        if (typeof input !== 'undefined' && input.name) {
                            switch (input.tagName){
                                case 'INPUT':
                                    input.value = (data[i] ? data[i] : null);
                                    break;
                                case 'SELECT':
                                    var option = getElementsByAttr(input,'value',(data[i] ? data[i] : null),'option');
                                    option.selected = true;
                                    break;
                                default:
                                    input.innerHTML = (data[i] ? data[i] : null);
                                    break;
                            }
                            i++;
                        }
                    });
                }
            }catch(err){
                console.warn(err.message);
            }
            newNode.removeAttribute(consts.cp.template);
            viewport.appendChild(newNode);
            return this;
        };

        var rebuildNodes = function () {
            var i = 1;
            viewport.childNodes.forEach(function (node) {
                if(node.tagName) {
                    var counter = getElementsByAttr(node, consts.cp.counter);
                    if (counter) counter.innerHTML = i++;
                }
            });
        };

        this.rmNode = function (node) {
            if (this.options.minNode && viewport.childElementCount <= this.options.minNode) {
                alert(this.options.minNodeMsg ? this.options.minNodeMsg : 'Min. nodes not less '+this.options.minNode);
                return this;
            }
            node.remove();
            rebuildNodes();
        };

        this.flushViewport = function (root) {
            try{
                var viewport = isObject(getElementsByAttr(root, consts.cp.viewport), consts.cp.viewport+' is not marked');
                while (viewport.childNodes[0]) {
                    viewport.removeChild(viewport.childNodes[0]);
                }
                return this;
            }catch(err){
                console.error(err.message);
                return;
            }
        };

        if (this.options.startNode && this.options.startNode > 1) for(var startNode = 1; startNode < this.options.startNode; startNode++) this.addNode();

        return this;
    };

    // PUSH DATA & GENERATE PLACE TO INITIALIZED
    // ==============

    FT.pushData = function (initName, data) {
        try{
            var init = isObject(getElementsByAttr(document, consts.cp.init, initName), initName+' not found');
            FT.inits[initName] = new this.clonePattern(init, init.getAttribute(consts.cp.options));
            FT.inits[initName].flushViewport(init);
            if (data.length > 0) {
                data.forEach(function (values) {
                    FT.inits[initName].addNode(values);
                });
            }
            return this;
        }catch(err){
            console.error(err);
            return;
        }
    };

    // SET NULLS FOR TEMPLATE INPUT LIKE FORMAT: 0.00
    // ==============

    FT.setNulls = function (input) {
        if (input.value && input.value != '') {
            if (input.value.indexOf('.') < 0){
                input.value = input.value + '.00';
            }else if (input.value.match('[0-9]+\.+[0-9]') == null){
                input.value = input.value + '00';
            }else if (input.value.match('[0-9]+\.+[0-9]{2}') == null){
                input.value = input.value + '0';
            }
        }
    };
    
    // START PARSE PAGE
    // ==============

    window.onload = function () {
        if (!Object.prototype.forEach && !Element.prototype.remove && (typeof window.jQuery === 'undefined')) throw new Error('formTools JavaScript requires jQuery');
        FT.discovery();
    };

}) (window.formTools = window.formTools || {});
