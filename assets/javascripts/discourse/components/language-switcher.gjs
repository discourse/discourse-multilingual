import Component from "@glimmer/component";
import MountWidget from "discourse/components/mount-widget";
import DMenu from "float-kit/components/d-menu";
import i18n from "discourse-common/helpers/i18n";

export default class LanguageSwitcher extends Component {
  <template>
    <DMenu
      title={{i18n "user.locale.title"}}
      @icon="translate"
      id="multilingual-language-switcher"
      class="icon btn-flat"
    >
      <:content>
        <MountWidget @widget="language-switcher-menu" />
      </:content>
    </DMenu>
  </template>
}
