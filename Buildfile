# ===========================================================================
# Project:   Todos
# Copyright: ©2010 My Company, Inc.
# ===========================================================================

# Add initial buildfile information here
config :all, :required => :sproutcore

proxy '/tasks', :to => 'todos.demo.sproutcore.com'
