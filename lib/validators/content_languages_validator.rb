# frozen_string_literal: true

class ContentLanguagesValidator
  def initialize(opts = {})
    @opts = opts
  end

  def valid_value?(val)
    val == "f" || (val == "t" && SiteSetting.multilingual_enabled)
  end

  def error_message
    I18n.t("site_settings.errors.multilingual_disabled") if !SiteSetting.multilingual_enabled
  end
end
