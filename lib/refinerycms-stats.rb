require 'refinerycms-base'

module Refinery
  module Stats
    class Engine < Rails::Engine
      initializer "static assets" do |app|
        app.middleware.insert_after ::ActionDispatch::Static, ::ActionDispatch::Static, "#{root}/public"
      end

      config.after_initialize do
        Refinery::Plugin.register do |plugin|
          plugin.name = "stats"
          plugin.activity = {
            :class => Stat
          }
        end
      end
    end
  end
end
