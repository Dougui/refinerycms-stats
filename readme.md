# Stats plugin for [RefineryCMS](http://www.refinerycms.com) ([Github](http://github.com/resolve/refinerycms))

By: [Guirec Corbel](http://www.guirec-corbel.com)

## Requirements

This engine requires RefineryCMS version >= 0.9.8.

## Gem Installation

Ensure you have created your application's database before adding this engine (with ``rake db:setup``).

Open your ``Gemfile`` and add this line to the bottom:

    gem 'refinerycms-stats', '~> '0.1'

Now run ``bundle install`` and once bundler has installed the gem run:

    rails generate refinerycms_stats
		rake db:migrate

Now, restart your web server and enjoy.

## Description

This plugin allows you to view information stored on Google Analytics. To view data, it is necessary to fill the value Analytics Page Code with the code for your account. You will then be asked to validate the data access for your site. Only 30 days are displayed. For more information it is necessary to visit Google Analytics.

A description of the development of this engine is disponnible online at: http://www.guirec-corbel.com

