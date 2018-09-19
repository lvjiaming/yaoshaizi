

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
        MoShiTwoNode: {
            default: null,
            type: cc.Node,
        },
        CurMoShiNode: {
            default: null,
            type: cc.Node,
        },
        CurSelectShaiZiNum: 0,  // 当前选择的骰子数量
        CurShaiZiZuHe: [],
        CurGameMoShi: null,
    },



    onLoad () {
        this.CurMoShiNode = this.MoShiOneNode;
        this.CurGameMoShi = cc.gameCfg.GAME_MOSHI.SIMPLE;
        this.showAdvertList();
        this.initShuiZiNum();
        this.setSelectShaiZiNum();
        this.setSumShaiZiDian();
        this.deviceM = true;
        cc.systemEvent.setAccelerometerEnabled(true);  // 开启重力感应
        cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this.deviceMotionCb, this);  // 注册重力感应监听
    },

    start () {

    },
    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.DEVICEMOTION, this.deviceMotionCb, this); // 注销重力感应监听
    },
    /**
     *  重力感应回调
     */
    deviceMotionCb(data) {
        cc.log(data);
        cc.log(data.acc.x + "   " + data.acc.y);
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
        switch (this.CurGameMoShi) {
            case cc.gameCfg.GAME_MOSHI.SIMPLE: {
                for (let i = 0; i < this.CurSelectShaiZiNum; i++) {
                    this.CurShaiZiZuHe.push(Math.floor(Math.random()*6) + 1);
                }
                break;
            }
            case cc.gameCfg.GAME_MOSHI.CUSTOM: {
                this.CurShaiZiZuHe.push(Math.floor(Math.random()*6) + 1);
                for (let i = 1; i < 7; i++) {
                    const node = this.CurMoShiNode.getChildByName(`Box${i}`);
                    if (node) {
                        cc.gameCfg.CUSTOM_MOSHI_CFG[i] = node.getChildByName("Edit").getComponent(cc.EditBox).string;
                    }
                }
                cc.log(cc.gameCfg.CUSTOM_MOSHI_CFG);
                break;
            }
        }
        console.log(this.CurShaiZiZuHe);
    },
    /**
     *  摇骰子的动画
     */
    playAni() {
        if (this.CurMoShiNode) {
            const ani1 = cc.sequence(cc.moveTo(0.1, cc.v2(-60,this.CurMoShiNode.getChildByName("Ysz_Di").y)), cc.moveTo(0.1, cc.v2(60,this.CurMoShiNode.getChildByName("Ysz_Di").y)), cc.moveTo(0.1, cc.v2(0,this.CurMoShiNode.getChildByName("Ysz_Di").y)));
            const ani = cc.repeat(ani1, 5);
            this.CurMoShiNode.getChildByName("Ysz_Di").runAction(cc.sequence(ani, cc.callFunc(() => {
                cc.log(`21111`);
                this.aniPlay = false;
            })));
        }
    },
    /**
     *  显示盅内的骰子
     */
    showShaiZi() {
        if (this.CurShaiZiZuHe.length > 0) {
            const ysz_di =  this.CurMoShiNode.getChildByName("Ysz_Di");
            if (ysz_di) {
                switch (this.CurGameMoShi) {
                    case cc.gameCfg.GAME_MOSHI.SIMPLE: {
                        for (let i = 1; i < 7; i++) {
                            if (ysz_di.getChildByName(`shaizi${i}`)) {
                                ysz_di.getChildByName(`shaizi${i}`).active = false;
                            }
                        }
                        const func = (node, index) => {
                            cc.loader.loadRes(`texture/game_n_sz_${index}`, cc.SpriteFrame, (err, spr) => {
                                node.active = true;
                                if (err) {
                                    console.error(`err: ${err}`);
                                } else {
                                    node.getComponent(cc.Sprite).spriteFrame = spr;
                                }
                            });
                        };
                        for (let i = 0; i < this.CurShaiZiZuHe.length; i++) {
                            func(ysz_di.getChildByName(`shaizi${i + 1}`), this.CurShaiZiZuHe[i]);
                        }
                        break;
                    }
                    case cc.gameCfg.GAME_MOSHI.CUSTOM: {
                        ysz_di.getChildByName("shaizi1").getChildByName("name").getComponent(cc.Label).string = cc.gameCfg.CUSTOM_MOSHI_CFG[this.CurShaiZiZuHe[0]];
                        break;
                    }
                }
            }
        }
    },
    /**
     *  改变模式
     */
    changeMoShi() {
        switch (this.CurGameMoShi) {
            case cc.gameCfg.GAME_MOSHI.SIMPLE: {
                if (this.MoShiOneNode) {
                    this.MoShiOneNode.active = true;
                    this.CurMoShiNode = this.MoShiOneNode;
                }
                if (this.MoShiTwoNode) {
                    this.MoShiTwoNode.active = false;
                }
                break;
            }
            case cc.gameCfg.GAME_MOSHI.CUSTOM: {
                if (this.MoShiOneNode) {
                    this.MoShiOneNode.active = false;
                }
                if (this.MoShiTwoNode) {
                    this.MoShiTwoNode.active = true;
                    this.CurMoShiNode = this.MoShiTwoNode;
                }
                cc.gameCfg.CUSTOM_MOSHI_CFG.forEach((item, index) => {
                    const node = this.CurMoShiNode.getChildByName(`Box${index}`);
                    if (node) {
                        node.getChildByName("Edit").getComponent(cc.EditBox).string = item;
                    }
                });
                break;
            }
        }
    },
    onYaoYiYao() {
        cc.log(`摇一摇`);
        // if (!this.isKia) {
            this.CurShaiZiZuHe = [];
            this.setSumShaiZiDian();
            this.initShuiZiNum();
            this.createShaiZiZuHe();
        // }
        // this.setShaiZiNum();
        // this.setSumShaiZiDian();
        if (this.CurShaiZiZuHe.length > 0 && !this.aniPlay) {
            if (!this.isKia) {
                this.aniPlay = true;
                this.playAni();
            } else {
                cc.log(`盖子未盖`);
                this.onOpenGai(null, null, this.playAni.bind(this));
            }
        }
    },
    onOpenGai(event, custom, cb) {
        cc.log(`揭开盖子`);
        if (!this.aniPlay) {
            const cfg = [
                cc.v2(0,90),
                cc.v2(0, 800)
            ];
            if (this.isKia) {
                this.isKia = 0;
            } else {
                this.isKia = 1;
            }
            if (this.isKia == 1) {
                this.setShaiZiNum();
                this.setSumShaiZiDian();
                this.showShaiZi();
            } else {
                this.CurShaiZiZuHe = [];
                this.setSumShaiZiDian();
                this.initShuiZiNum();
            }
            if (cb) {
                this.aniPlay = true;
            }
            this.CurMoShiNode.getChildByName("Ysz_Di").getChildByName("Ysz_Gz").runAction(cc.sequence(cc.moveTo(0.1, cfg[this.isKia]), cc.callFunc(() => {
                if (cb && cb instanceof Function) {
                    this.CurShaiZiZuHe = [];
                    this.createShaiZiZuHe();
                    cb();
                }
            })));
        }
    },
    onChangeMoShiClick() {
        if (!this.aniPlay) {
            this.CurMoShiNode.getChildByName("Ysz_Di").getChildByName("Ysz_Gz").y = 90;
            this.CurShaiZiZuHe = [];
            this.setSumShaiZiDian();
            this.initShuiZiNum();
            this.isKia = 0;
            if (this.CurGameMoShi == cc.gameCfg.GAME_MOSHI.SIMPLE) {
                this.CurGameMoShi = cc.gameCfg.GAME_MOSHI.CUSTOM;
            } else {
                this.CurGameMoShi = cc.gameCfg.GAME_MOSHI.SIMPLE;
            }
            this.changeMoShi();
        }
    },
    onShareClick() {
        cc.log(`分享`);
    },
    onSuoDingClick() {
        this.deviceM = !this.deviceM;
        cc.systemEvent.setAccelerometerEnabled(this.deviceM);  // 开启重力感应
    },
});
