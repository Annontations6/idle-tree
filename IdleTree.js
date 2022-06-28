import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";
import { ui } from "../api/ui/UI"
import { game } from "../api/Game";

var id = "my_custom_theory_id";
var name = "Idle tree";
var description = "A basic theory.";
var authors = "Annontations6";
var version = 1;

var currency;
var c1, c2, c3;
var c1Exp, c2Exp;

var achievement1, achievement2;
var chapter1, chapter2;

var init = () => {
    currency = theory.createCurrency();
    currency2 = theory.createCurrency();

    ///////////////////
    // Regular Upgrades

    // c1
    {
        let getDesc = (level) => "c_1=" + getC1(level).toString(0);
        c1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(15, Math.log2(2))));
        c1.getDescription = (_) => Utils.getMath(getDesc(c1.level));
        c1.getInfo = (amount) => Utils.getMathTo(getDesc(c1.level), getDesc(c1.level + amount));
    }

    // c2
    {
        let getDesc = (level) => "c_2=2^{" + level + "}";
        let getInfo = (level) => "c_2=" + getC2(level).toString(0);
        c2 = theory.createUpgrade(1, currency, new ExponentialCost(5, Math.log2(10)));
        c2.getDescription = (_) => Utils.getMath(getDesc(c2.level));
        c2.getInfo = (amount) => Utils.getMathTo(getInfo(c2.level), getInfo(c2.level + amount));
    }

    // c3
    {
        c3 = theory.createUpgrade(2, currency, new ExponentialCost(1e10, Math.log2(1)));
        c3.getDescription = (_) => "prestige gain";
        c3.getInfo = (amount) => "prestige gain";
        c3.boughtOrRefunded = (_) => {
            currency.value = BigNumber.ZERO
            currency2.value += BigNumber.ONE
            c1.level = 0;
            c2.level = 0;
            c3.level = 0;
        }
    }

    // c4
    {
        let getDesc = (level) => "c_4=3^{" + level + "}";
        let getInfo = (level) => "c_4=" + getC4(level).toString(0);
        c4 = theory.createUpgrade(3, currency2, new ExponentialCost(5, Math.log2(10)));
        c4.getDescription = (_) => Utils.getMath(getDesc(c4.level));
        c4.getInfo = (amount) => Utils.getMathTo(getInfo(c4.level), getInfo(c4.level + amount));
        c4.maxLevel = 1;
    }

    // c5
    {
        c5 = theory.createUpgrade(4, currency2, new ExponentialCost(1000, Math.log2(1)));
        c5.getDescription = (_) => "Automation tab.";
        c5.getInfo = (amount) => "automation";
        c5.boughtOrRefunded = (_) => {
            popup.show();
            c5.level = 0;
        }
    }

    // c1auto
    {
        c1auto = theory.createUpgrade(5, currency2, new ExponentialCost(1000, Math.log2(1)));
        c1auto.getDescription = (_) => "Automation tab.";
        c1auto.getInfo = (amount) => "automation";
    }

    // c2auto
    {
        c2auto = theory.createUpgrade(6, currency2, new ExponentialCost(1000, Math.log2(1)));
        c2auto.getDescription = (_) => "Automation tab.";
        c2auto.getInfo = (amount) => "automation";
    }

    // idk
    {
        idk = theory.createUpgrade(7, currency2, new FreeCost());
        idk.getDescription = (_) => "get popup";
        idk.getInfo = (amount) => "get popup";
        idk.boughtOrRefunded = (_) => {
            popup2.show();
            idk.level = 0;
        }
    }

    // stat
    {
        stat = theory.createUpgrade(8, currency2, new FreeCost());
        stat.getDescription = (_) => "get statics popup";
        stat.getInfo = (amount) => "get statics popup";
        stat.boughtOrRefunded = (_) => {
            popup3.show();
            stat.level = 0;
        }
    }

    // stat2
    {
        stat2 = theory.createUpgrade(9, currency2, new FreeCost());
        stat2.getDescription = (_) => "get statics popup";
        stat2.getInfo = (amount) => "get statics popup";
        stat2.boughtOrRefunded = (_) => {
            popup4.show();
            stat2.level = 0;
        }
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e10);
    theory.createBuyAllUpgrade(1, currency, 1e13);
    theory.createAutoBuyerUpgrade(2, currency, 1e30);

    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(25, 25));

    {
        c1Exp = theory.createMilestoneUpgrade(0, 3);
        c1Exp.description = Localization.getUpgradeIncCustomExpDesc("c_1", "0.05");
        c1Exp.info = Localization.getUpgradeIncCustomExpInfo("c_1", "0.05");
        c1Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }

    {
        c2Exp = theory.createMilestoneUpgrade(1, 3);
        c2Exp.description = Localization.getUpgradeIncCustomExpDesc("c_2", "0.05");
        c2Exp.info = Localization.getUpgradeIncCustomExpInfo("c_2", "0.05");
        c2Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }
    
    /////////////////
    //// Achievements
    achievement1 = theory.createAchievement(0, "You Played!", "i think so...", () => true);

    ///////////////////
    //// Story chapters
    chapter1 = theory.createStoryChapter(0, "My First Chapter", "This is line 1,\nand this is line 2.\n\nNice.", () => c1.level > 0);
    chapter2 = theory.createStoryChapter(1, "My Second Chapter", "This is line 1 again,\nand this is line 2... again.\n\nNice again.", () => c2.level > 0);

    var popup = ui.createPopup({
        title: "Automation",
        content: ui.createStackLayout({
            children: [
                ui.createImage({source: ImageSource.ACCELERATE}),
                ui.createLabel({text: "i while show disk go switching..."}),
                ui.createLabel({text: "Fix?"}),
                ui.createSwitch(),
                ui.createButton({text: "c1", onClicked: () => c1auto.level = 1}),
                ui.createButton({text: "c2", onClicked: () => c2auto.level = 1}),
                ui.createButton({text: "Close", onClicked: () => popup.hide()})
            ]
        })
    });

    var popup2 = ui.createPopup({
        title: "idk Popup",
        content: ui.createStackLayout({
            children: [
                ui.createButton({text: "My Button", horizontalOptions: LayoutOptions.START}),
                ui.createCheckBox(),
                ui.createEntry(),
                ui.createFrame({
                    heightRequest: 50,
                    cornerRadius: 10,
                    content: ui.createLabel({
                        text: "A frame.",
                        horizontalOptions: LayoutOptions.CENTER,
                        verticalOptions: LayoutOptions.CENTER
                    })
                }),
                ui.createGrid({
                    columnDefinitions: ["20*", "30*", "auto"],
                    children: [
                        ui.createButton({text: "left", row: 0, column: 0}),
                        ui.createButton({text: "center", row: 0, column: 1}),
                        ui.createButton({text: "right", row: 0, column: 2, padding: new Thickness(0)})
                    ]
                }),
                ui.createImage({source: ImageSource.ACCELERATE}),
                ui.createLabel({text: "My label."}),
                ui.createLatexLabel({text: "My LaTeX label. \\(\\int_0^1{xdx}\\)"}),
                ui.createProgressBar({progress: 0.25}),
                ui.createSwitch(),
                ui.createBox({heightRequest: 1, margin: new Thickness(0, 10)}),
                ui.createButton({text: "Close", onClicked: () => popup.hide()})
            ]
        })
    });

    var popup3 = ui.createPopup({
        title: "Statics",
        content: ui.createStackLayout({
            children: [
                ui.createLabel({text: "You have gained " + game.f.toString(4) + " dollars of f(t)."}),
                ui.createLabel({text: "You have gained " + game.dpsi.toString(4) + " dpsi."}),
                ui.createLabel({text: "You have gained " + currency2.value + " rho 2."}),
                ui.createButton({text: "Close", onClicked: () => popup.hide()})
            ]
        })
    });

    var popup4 = ui.createPopup({
        title: "idle",
        content: ui.createStackLayout({
            children: [
                ui.createCheckBox(),
                ui.createEntry(),
                ui.createImage({source: ImageSource.ACCELERATE}),
                ui.createLabel({text: "My label."}),
                ui.createLatexLabel({text: "My LaTeX label. \\(\\int_0^1{xdx}\\)"}),
                ui.createProgressBar({progress: 0.25}),
                ui.createSwitch(),
                ui.createBox({heightRequest: 1, margin: new Thickness(0, 10)}),
                ui.createButton({text: "Close", onClicked: () => popup.hide()})
            ]
        })
    });

    updateAvailability();
}

var updateAvailability = () => {
    c2Exp.isAvailable = c1Exp.level > 0;
    c4.isAvailable = currency2.value > 0;
    c1auto.isAvailable = false;
    c2auto.isAvailable = false;
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    currency.value += dt * bonus * getC1(c1.level).pow(getC1Exponent(c1Exp.level)) *
                                   getC2(c2.level).pow(getC2Exponent(c2Exp.level));
    if (c1auto.level > 0) {
        setInterval(() => {
            c1.level += 1;
        }, 500);
    }
    if (c2auto.level > 0) {
        setInterval(() => {
            c2.level += 1;
        }, 500);
    }
}

var getPrimaryEquation = () => {
    let result = "\\dot{\\rho} = c_1";

    if (c1Exp.level == 1) result += "^{1.05}";
    if (c1Exp.level == 2) result += "^{1.1}";
    if (c1Exp.level == 3) result += "^{1.15}";

    result += "c_2";

    if (c2Exp.level == 1) result += "^{1.05}";
    if (c2Exp.level == 2) result += "^{1.1}";
    if (c2Exp.level == 3) result += "^{1.15}";

    return result;
}

var getSecondaryEquation = () => theory.latexSymbol + "=\\max\\rho";
var getPublicationMultiplier = (tau) => tau.pow(0.164) / BigNumber.THREE;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.164}}{3}";
var getTau = () => currency.value;
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getC1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getC2 = (level) => BigNumber.TWO.pow(level);
var getC1Exponent = (level) => BigNumber.from(1 + 0.05 * level);
var getC2Exponent = (level) => BigNumber.from(1 + 0.05 * level);

init();
