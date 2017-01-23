CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    var min_size = Math.min(w, h);
    if (r > min_size / 2) r = min_size / 2;
    // 开始绘制
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
};


function Barrager(dom,direction) {
        this.canvas = dom.get(0);
        this.ctx = this.canvas.getContext("2d");
        this.msgs = new Array(50);//缓冲池，长度越大，屏幕上显示的就越多
        this.width = $(this.canvas).width();
        this.height = $(this.canvas).height()-60;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.font = "normal normal bold 30px 微软雅黑";//字体和字体大小
        this.headWidth = 30;
        this.nameWidth = 100;
        this.direction = direction;
        this.ctx.font = this.font;
        //颜色数组，在绘制过程中随机从这里取出颜色
        this.colorArr = ["Olive", "OliveDrab", "Orchid", "PaleGreen", "Yellow", "Peru", "Plum", "PowderBlue", "Black", "White",  "RoyalBlue", "SaddleBrown", "SeaGreen", "SeaShell","SkyBlue"];
        this.isAnimate = false;
        this.faceArr = ["\\/::\\)", "\\/::~", "/::B", "\\/::\\|", "\\/:8-\\)", "\\/::<", "\\/::\\$", "\\/::X",
            "\\/::Z", "\\/::\\'\\(", "\\/::-\\|", "\\/::@", "\\/::P", "\\/::D", "\\/::O", "\\/::\\(",
            "\\/::\\+", "\\/:--b", "\\/::Q", "\\/::T", "\\/:,@P", "\\/:,@-D", "\\/::d", "\\/:,@o", "\\/::g",
            "\\/:\\|\\-\\)", "\\/::!", "\\/::L", "\\/::>", "\\/::\\,@", "\\/:\\,@f", "\\/::\\-S", "\\/:\\?", "\\/:\\,@x", "\\/:\\,@@", "\\/::8",
            "\\/:,@!", "\\/:!!!", "\\/:xx", "\\/:bye", "\\/:wipe", "\\/:dig", "\\/:handclap", "\\/:&-\\(", "\\/:B-\\)", "\\/:<@",
            "\\/:@>", "\\/::-O", "\\/:>-\\|", "\\/:P-\\(", "\\/::\\'\\|", "\\/:X-\\)", "\\/::\\*", "\\/:@x", "\\/:8\\*", "\\/:pd", "\\/:<W>",
            "\\/:beer", "\\/:basketb", "\\/:oo", "\\/:coffee", "\\/:eat", "\\/:pig", "\\/:rose", "\\/:fade", "\\/:showlove",
            "\\/:heart", "\\/:break", "\\/:cake", "\\/:li", "\\/:bome", "\\/:kn", "\\/:footb", "\\/:ladybug", "\\/:shit",
            "\\/:moon", "\\/:sun", "\\/:gift", "\\/:hug", "\\/:strong", "\\/:weak", "\\/:share", "\\/:v", "\\/:@\\)", "\\/:jj",
            "\\/:@@", "\\/:bad", "\\/:lvu", "\\/:no", "/:ok", "\\/:love", "\\/:<L>", "\\/:jump", "\\/:shake", "\\/:<O>",
            "\\/:circle", "\\/:kotow", "\\/:turn", "\\/:skip", "\\/:oY"];
        this.getFacePic = function(str){
           var reg;
            _this.faceArr.forEach(function(v,i){
                reg=new RegExp(v,"g");
                str=str.replace(reg,"<img src='images/weixinFace/"+(i+1)+".png'/>");
            });
            return str;
        };
        /*this.drawFaceWithText = function(Msg,str){
            var patt = "/:";
            var msg = str?str:Msg.msgContent;
            var index = msg.indexOf(patt);
            var remain = "";
            if(index==-1)
                _this.ctx.fillText(Msg.msgContent,Msg.L3, Msg.T);
            else{
                var text = msg.substring(0,index);
                remain = msg.substring(index);
                _this.ctx.fillText(text,Msg.L3, Msg.T);
                var face = new Image();
                _this.faceArr.some(function(v,i){
                    reg=new RegExp(v);
                    if(reg.exec(remain)!= null){
                        face.src = "images/weixinFace/"+(i+1)+".png";
                        return true;
                    }

                });
                remain = remain.substring(patt.lastIndex);
                _this.ctx.drawImage(face,Msg.L3 + 30*index,Msg.T, _this.headWidth, _this.headWidth);
                Msg.L3 = Msg.L3 + 30*index,Msg.T +_this.headWidth;
                _this.drawFaceWithText(Msg,remain);
            }
        };
*/
        this.request = null;
        this.globalID = 0;
        var _this = this;

        this.draw = function () {
            _this.ctx.clearRect(0, 0, _this.width, _this.height);
            _this.ctx.save();
            if(_this.direction =="row") {
                for (var i = 0; i < _this.msgs.length; i++) {
                    if (!(_this.msgs[i] == null || _this.msgs[i] == "" || typeof(_this.msgs[i]) == "undefined")) {
                        if (_this.msgs[i].L == null || typeof(_this.msgs[i].L) == "undefined") {
                            _this.msgs[i].L = _this.width;
                            _this.msgs[i].T = parseInt(Math.random() * _this.height + 20);
                            _this.msgs[i].S = parseInt(3);
                            _this.msgs[i].C = _this.colorArr[Math.floor(Math.random() * _this.colorArr.length)];

                            _this.msgs[i].T2 = _this.msgs[i].T - 25;
                        } else {
                            if (_this.msgs[i].L < -200) {
                                _this.msgs[i] = null;
                            } else {
                                _this.msgs[i].L = parseInt(_this.msgs[i].L - _this.msgs[i].S);
                                _this.msgs[i].L2 = _this.msgs[i].L + _this.headWidth;
                                _this.msgs[i].L3 = _this.msgs[i].L2 + _this.nameWidth;
                                _this.ctx.fillStyle = _this.msgs[i].C;
                                var head = new Image();
                                head.src = _this.msgs[i].head;
                                _this.ctx.drawImage(head, _this.msgs[i].L, _this.msgs[i].T2, _this.headWidth, _this.headWidth);
                                _this.ctx.fillText(_this.msgs[i].name +": "+_this.msgs[i].msgContent, _this.msgs[i].L2, _this.msgs[i].T);
                                _this.ctx.restore();
                            }
                        }
                    }
                }
            }else{
                for (var i = 0; i < _this.msgs.length; i++) {
                    if (!(_this.msgs[i] == null || _this.msgs[i] == "" || typeof(_this.msgs[i]) == "undefined")) {
                        if (_this.msgs[i].L == null || typeof(_this.msgs[i].L) == "undefined") {
                            _this.msgs[i].L = parseInt(10);
                            _this.msgs[i].L2 = _this.msgs[i].L + _this.headWidth;
                            _this.msgs[i].T = parseInt(_this.height);
                            _this.msgs[i].S = parseInt(1);
                            _this.msgs[i].C = _this.colorArr[Math.floor(Math.random() * _this.colorArr.length)];

                        } else {
                            if (_this.msgs[i].L < -200) {
                                _this.msgs[i] = null;
                            } else {
                                _this.msgs[i].T = parseInt(_this.msgs[i].T - _this.msgs[i].S);
                                _this.msgs[i].T2 = _this.msgs[i].T - _this.headWidth;
                                _this.ctx.fillStyle = _this.msgs[i].C;
                                var head = new Image();
                                head.src = _this.msgs[i].head;
                                _this.ctx.drawImage(head, _this.msgs[i].L, _this.msgs[i].T2, _this.headWidth, _this.headWidth);
                                _this.ctx.fillText(_this.msgs[i].name +": "+_this.msgs[i].msgContent, _this.msgs[i].L2, _this.msgs[i].T);
                                _this.ctx.restore();
                            }
                        }
                    }
                }
            }
        };
        this.putMsg = function (datas) {//循环缓冲区，把位置是空的装填上数据
                for (var j = 0; j < datas.length; j++) {
                    for (var i = 0; i < this.msgs.length; i++) {
                        if (this.msgs[i] == null || this.msgs[i] == "" || typeof(this.msgs[i]) == "undefined") {
                            this.msgs[i] = datas[j];
                            break;
                        }
                    }
                }
                if (!_this.isAnimate) _this.animate();
            };
        this.animate = function () {
                if (!window.requestAnimationFrame) {
                    window.requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;
                }
                _this.request = requestAnimationFrame(_this.animate);
                _this.isAnimate = true;
                _this.draw();
        };
        this.clear = function () {
            //清除屏幕，清空缓冲区
                cancelAnimationFrame(_this.request);
                _this.isAnimate = false;
                this.ctx.clearRect(0, 0, this.width, this.height);
                this.ctx.save();
                for (var i = 0; i < this.msgs.length; i++) {
                    this.msgs[i] = null;
                }
        };
        this.init = function(){
            //console.log(window)
            document.addEventListener('visibilitychange',function(){
                if(document.visibilityState == "hidden") {
                    cancelAnimationFrame(_this.request);
                    _this.request = requestAnimationFrame(_this.animate);
                }
            });
            _this.animate();
        }
    }

function getBarrageByTime() {
    $.ajax({
        type: "get",
        url: globalUrl + "api/Barrage/GetMsgByTimeStamp?TimeStamp=" + time,
        dataType: "json",
        success: function (list) {
            //console.log(list);
            if (list.length > 0) {
                b.globalID = list[list.length - 1].ID;
                list.forEach(function(v){
                    b.putMsg([
                        {"msgContent": v.MsgContent, "head": v.HeadimgUrl+"64", "name": v.Name}
                    ]);
                });
                window.setTimeout(getBarrageById,1000);
            }else{
                window.setTimeout(getBarrageByTime,1000);
            }
        }
    });
}

function getBarrageById(){
    $.ajax({
        type: "get",
        url:globalUrl + "api/Barrage/GetMsgByID?ID="+ b.globalID,
        dataType: "json",
        success: function (list) {
            //console.log(list);
            if(list.length>0){
                b.globalID = list[list.length - 1].ID;
                list.forEach(function(v){
                    b.putMsg([
                        {"msgContent": v.MsgContent, "head": v.HeadimgUrl+"64", "name": v.Name}
                    ]);
                });
            }
            window.setTimeout(getBarrageById,1000);
        }
    });
}


