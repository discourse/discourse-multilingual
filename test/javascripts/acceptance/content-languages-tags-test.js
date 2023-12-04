import { visit } from "@ember/test-helpers";
import { test } from "qunit";
import { acceptance } from "discourse/tests/helpers/qunit-helpers";
import { topicList } from "../fixtures/topic-list";

const content_languages = [{ locale: "aa", name: "Qafár af" }];

acceptance("Content language tags", function (needs) {
  needs.user();
  needs.settings({
    multilingual_enabled: true,
    multilingual_content_languages_enabled: true,
    tagging_enabled: true,
  });
  needs.site({ content_languages });

  needs.pretender((server) => {
    server.get("/latest.json", () => topicList);
  });

  test("displays content language tags correctly", async (assert) => {
    await visit("/");
    assert.dom(".content-language-tags .discourse-tag").hasText("Qafár af");
  });
});
