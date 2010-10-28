# ===========================================================================
# Project:   Todos
# Copyright: ©2010 My Company, Inc.
# ===========================================================================

config :all, :required => :sproutcore do |c|
  c[:resources_relative] = true
  c[:url_prefix] = 'http://localhost:4020'
  c[:layout] = 'index.rhtml'
end

proxy '/tasks', :to => 'todos.demo.sproutcore.com'
