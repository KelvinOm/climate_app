import Tabs from "./tabs/";
import Select from "./selects/";

export default class Controls {
    constructor() {

        this._render();
    }

    _render() {
        let tmp = document.createElement("div");

        let tabs = this.tabs = new Tabs();
        tmp.appendChild(tabs.getElem());

        let select = this.select = new Select();
        tmp.appendChild(select.getElem());

        this._elem = tmp;
    }

    getElem() {
        return this._elem;
    }

}
