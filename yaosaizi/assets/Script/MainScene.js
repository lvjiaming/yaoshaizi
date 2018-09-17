

cc.Class({
    extends: cc.Component,

    properties: {
        AdvertNode: {
            default: null,
            type: cc.Node,
        },
        ShuaiZiNumNode: {
            default: null,
            type: cc.Node,
        },
        SelectShaiZiNumNode: {
            default: null,
            type: cc.Label,
        },
        CurSelectShaiZiNum: 0,  // 当前选择的骰子数量
        CurShaiZiZuHe: [],
    },



    onLoad () {
        this.showAdvertList();
        this.initShuiZiNum();
        this.setSelectShaiZiNum();
    },

    start () {

    },

    /**
     *  显示广告列表
     */
    showAdvertList() {
        if (this.AdvertNode) {
            cc.loader.loadRes("prefabs/AdvertItem", (err, prefab) => {
                if (err) {
                    console.error(`err: ${err}`);
                } else {
                    cc.gameCfg.AdvertCfg.forEach((item) => {
                        const advertItem = cc.instantiate(prefab);
                        advertItem.data = item;
                        this.AdvertNode.addChild(advertItem);
                    });
                }
            });
        }
    },
    /**
     *  初始化骰子的数量
     */
    initShuiZiNum() {
        if (this.ShuaiZiNumNode) {
            this.ShuaiZiNumNode.children.forEach((item) => {
                item.getChildByName("num").getComponent(cc.Label).string = 0;
            });
        }
    },
    /**
     * 设置骰子数量
     * @param data
     */
    setShaiZiNum(data) {

    },
    /**
     *  设置当前选择的骰子数
     */
    setSelectShaiZiNum() {
        if (this.SelectShaiZiNumNode) {
            this.SelectShaiZiNumNode.string = this.CurSelectShaiZiNum;
        }
    },
    /**
     *  减少一个骰子
     */
    onJianShaiZiClick() {
        this.CurSelectShaiZiNum--;
        if (this.CurSelectShaiZiNum < 0) {
            this.CurSelectShaiZiNum = 0;
        }
        this.setSelectShaiZiNum();
    },
    /**
     *  增加一个骰子
     */
    onAddShaiZiClick() {
        this.CurSelectShaiZiNum++;
        if (this.CurSelectShaiZiNum > cc.gameCfg.MAX_SHUAIZI_NUM) {
            this.CurSelectShaiZiNum = cc.gameCfg.MAX_SHUAIZI_NUM;
        }
        this.setSelectShaiZiNum();
    },
    /**
     * 生成骰子组合
     */
    createShaiZiZuHe() {
        this.CurShaiZiZuHe = [];
        for (let i = 0; i < this.CurSelectShaiZiNum; i++) {
            this.CurShaiZiZuHe.push(Math.floor(Math.random()*6) + 1);
        }
        console.log(this.CurShaiZiZuHe);
    },
    onYaoYiYao() {
        cc.log(`摇一摇`);
        this.initShuiZiNum();
        // this.createShaiZiZuHe();
    },
    onShareClick() {
        cc.log(`分享`);
    },
});
