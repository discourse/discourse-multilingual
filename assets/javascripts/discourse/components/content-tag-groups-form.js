import { inject as service } from "@ember/service";
import TagGroupsForm from "discourse/components/tag-groups-form";
import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";
import I18n from "I18n";

export default TagGroupsForm.extend({
  dialog: service(),
  updateContentTags() {
    this.set(
      "changingContentTags",
      I18n.t("tagging.groups.content_tags.update.message")
    );

    ajax(`/tag_groups/${this.model.id}/content-tags`, {
      type: "PUT",
    })
      .catch(popupAjaxError)
      .then(() => this.set("changingContentTags", null))
      .finally(() => this.tagsChanged());
  },

  destroyContentTags() {
    this.set(
      "changingContentTags",
      I18n.t("tagging.groups.content_tags.delete.message")
    );

    ajax(`/tag_groups/${this.model.id}/content-tags`, {
      type: "DELETE",
    })
      .catch(popupAjaxError)
      .then(() => this.set("changingContentTags", null))
      .finally(() => this.tagsChanged());
  },

  actions: {
    destroyContentTags() {
      this.dialog.deleteConfirm({
        title: I18n.t("tagging.groups.content_tags.delete.confirm"),
        didConfirm: () => this.destroyContentTags(),
      });
    },

    updateContentTags() {
      this.updateContentTags();
    },
  },
});
