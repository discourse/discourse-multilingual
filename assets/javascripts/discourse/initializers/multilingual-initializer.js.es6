import { withPluginApi } from 'discourse/lib/plugin-api';
import { ajax } from 'discourse/lib/ajax';
import {
  default as discourseComputed,
  on,
  observes
} from "discourse-common/utils/decorators";
import { languageTag, languageTagRenderer } from '../lib/multilingual';
import Composer from 'discourse/models/composer';
import { iconHTML } from "discourse-common/lib/icon-library";
import renderTag from "discourse/lib/render-tag";

export default {
  name: 'multilingual',
  initialize(container) {
    const site = container.lookup('site:main');
    const currentUser = container.lookup('current-user:main');
    const siteSettings = container.lookup('site-settings:main');
    
    if (!siteSettings.multilingual_enabled) return;
    
    Composer.serializeOnCreate('languages');
    Composer.serializeToTopic('languages', 'topic.languages');
    
    withPluginApi('0.8.36', api => {
      api.modifyClass('controller:preferences/interface', {
        @discourseComputed("makeThemeDefault")
        saveAttrNames(makeDefault) {
          let attrs = this._super(makeDefault);
          attrs.push('custom_fields');
          return attrs;
        },
        
        actions: {
          save() {
            return this._super().then(result => {
              const contentLanguages = this.site.content_languages;
              const rawUserLanguages = this.model.custom_fields.content_languages;
              let userLanguages = [];
              
              if (rawUserLanguages && rawUserLanguages[0] !== 'none') {
                userLanguages = rawUserLanguages.map(code => {
                  return contentLanguages.find(cl => cl.code === code);
                });
              }
                
              currentUser.set('content_languages', userLanguages);
            })
          }
        }
      });
      
      api.replaceTagRenderer(languageTagRenderer);
      
      api.modifyClass('component:mini-tag-chooser', {
        willComputeAsyncContent(content) {
          return content.filter(c => !languageTag(c.id));
        },

        @discourseComputed("tags")
        selection(tags) {
          return this._super(tags).filter((t) => !languageTag(t.value));
        },
        
        @discourseComputed("tags.[]", "filter", "highlightedSelection.[]")
        collectionHeader(tags, filter, highlightedSelection) {
          let html = this._super(...arguments);
          let $html = $(html);
          $html.find('button').each(function() {
            if (languageTag($(this).data('value'))) {
              $(this).remove();
            }
          });
          return $html.html();
        }
      });
      
      api.modifyClass('component:bread-crumbs', {
        classNameBindings: ["category::no-category", ":category-breadcrumb"],
        
        @discourseComputed
        hidden() {}
      });
      
      api.addTagsHtmlCallback(function(topic, params) {
        const languageTags = topic.language_tags;
        if (!languageTags || !languageTags[0]) return;
        
        let html = '<div class="topic-languages">';
        html += iconHTML('translate');
        languageTags.forEach(t => {
          html += renderTag(t, { language: true }) + " ";
        });
        html += '</div>';
        return html;
      }, { priority: 100  });
    });
  }
}