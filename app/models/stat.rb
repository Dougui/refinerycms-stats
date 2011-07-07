class Stat < ActiveRecord::Base

  acts_as_indexed :fields => [:bidon]

  validates :bidon, :presence => true, :uniqueness => true
  
end
