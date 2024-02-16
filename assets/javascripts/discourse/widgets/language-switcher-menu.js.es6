import { createWidget } from "discourse/widgets/widget";
import { h } from "virtual-dom";
import { addParam, localeParam } from "../lib/multilingual-route";
import I18n from "I18n";

export default createWidget("language-switcher-menu", {
  tagName: "div.language-switcher-menu",
  buildKey: () => "language-switcher-menu",

  settings: {
    maxWidth: 320,
  },

  defaultState() {
    return {
      available: this.site.interface_languages,
    };
  },

  panelContents() {
    const { available } = this.state;
    const currentLocale = I18n.currentLocale();

    return h(
      "ul",
      available.map((l) => {
        let className = "ls-language";

        if (l.locale === currentLocale) {
          className += " current";
        }

        return h(
          "li",
          this.attach("link", {
            className,
            action: "change",
            actionParam: l.locale,
            rawLabel: l.name,
          })
        );
      })
    );
  },

  change(locale) {
    addParam(localeParam, locale, { add_cookie: true, ctx: this });
  },

  html() {
    return this.panelContents();
  },
});
