

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
        cc.loader.loadRes(`texture/${this.node.data.texture}`, cc.SpriteFrame, (err, sprframe) => {
            if (err) {
                console.error(`err: ${err}`);
            } else {
                if (this.spr) {
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
        cc.sys.openURL(this.node.data.url);
    },

    start () {

    },

    // update (dt) {},
});
