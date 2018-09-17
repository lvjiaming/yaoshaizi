

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
        SumShaiZiDianNode: {
            default: null,
            type: cc.Label,
        },
        MoShiOneNode: {
            default: null,
            type: cc.Node,
        },
        CurSelectShaiZiNum: 0,  // 当前选择的骰子数量
        CurShaiZiZuHe: [],
    },



    onLoad () {
        this.showAdvertList();
        this.initShuiZiNum();
        this.setSelectShaiZiNum();
        this.setSumShaiZiDian();
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
    setShaiZiNum() {
        this.CurShaiZiZuHe.forEach((item1) => {
            let num = 0;
            this.CurShaiZiZuHe.forEach((item2) => {
                if (item2 == item1) {
                    num++;
                }
            });
            const dian = this.ShuaiZiNumNode.getChildByName(`dian${item1}`);
            if (dian) {
                dian.getChildByName("num").getComponent(cc.Label).string = num;
            }
        });
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
     *  设置当前总点数
     */
    setSumShaiZiDian() {
        if (this.SumShaiZiDianNode) {
            let dian = 0;
            this.CurShaiZiZuHe.forEach((item) => {
                dian = dian + item;
            });
            this.SumShaiZiDianNode.string = dian;
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
    /**
     *  摇骰子的动画
     */
    playAni() {
        if (this.MoShiOneNode) {
            const ani1 = cc.sequence(cc.moveTo(0.1, cc.p(-60,245)), cc.moveTo(0.1, cc.p(60,245)), cc.moveTo(0.1, cc.p(0,245)));
            const ani = cc.repeat(ani1, 5);
            this.MoShiOneNode.getChildByName("Ysz_Di").runAction(cc.sequence(ani, cc.callFunc(() => {
                cc.log(`21111`);
                this.aniPlay = false;
            })));
        }
    },
    onYaoYiYao() {
        cc.log(`摇一摇`);
        this.CurShaiZiZuHe = [];
        this.setSumShaiZiDian();
        this.initShuiZiNum();
        this.createShaiZiZuHe();
        // this.setShaiZiNum();
        // this.setSumShaiZiDian();
        if (this.CurShaiZiZuHe.length > 0 && !this.aniPlay && !this.isKia) {
            this.aniPlay = true;
            this.playAni();
        }
    },
    onOpenGai() {
        cc.log(`揭开盖子`);
        if (!this.aniPlay) {
            const cfg = [
                cc.p(0,90),
                cc.p(0, 400)
            ];
            if (this.isKia) {
                this.isKia = 0;
            } else {
                this.isKia = 1;
            }
            if (this.isKia == 1) {
                this.setShaiZiNum();
                this.setSumShaiZiDian();
            }
            this.MoShiOneNode.getChildByName("Ysz_Di").getChildByName("Ysz_Gz").runAction(cc.moveTo(0.1, cfg[this.isKia]));
        }
    },
    onShareClick() {
        cc.log(`分享`);
    },
});
