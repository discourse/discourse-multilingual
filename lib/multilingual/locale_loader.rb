# frozen_string_literal: true
class ::Multilingual::LocaleLoader
  attr_reader :controller

  def initialize(controller)
    @controller = controller
  end

  def request
    @controller.request
  end

  def asset_path(url)
    @controller.helpers.asset_path(url)
  end

  def current_locale
    I18n.locale.to_s
  end

  def custom_locale?
    Multilingual::CustomLanguage.is_custom?(current_locale)
  end

  def preload_i18n
    @controller.helpers.preload_script("locales/i18n")
  end

  def preload_custom_locale
    @controller.helpers.preload_script_url(ExtraLocalesController.url("custom-language"))
  end

  def preload_tag_translations
    @controller.helpers.preload_script_url(ExtraLocalesController.url("tags"))
  end
end
