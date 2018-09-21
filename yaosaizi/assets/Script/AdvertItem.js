

cc.Class({
    extends: cc.Component,

    properties: {
        itemName: {
            default: null,
            type: cc.Label,
        },
        spr: {
            default: null,
            type: cc.Sprite,
        },
    },



    onLoad () {
        this.initSpr();
        this.initName();
    },
    /**
     *  初始化纹理
     */
    initSpr() {
        cc.loader.load(this.node.data.imgUrl, (err, texture) => {
            if (err) {
                console.error(`err: ${err}`);
            } else {
                if (this.spr) {
                    const sprframe = new cc.SpriteFrame(texture);
                    this.spr.spriteFrame = sprframe;
                }
            }
        });
    },
    /**
     *  初始化名字
     */
    initName() {
        if (this.itemName) {
            this.itemName.string = this.node.data.name;
        }
    },
    onBtnClick() {
        cc.sys.openURL(this.node.data.apkUrl);
    },

    start () {

    },

    // update (dt) {},
});
