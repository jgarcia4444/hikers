class Hike < ApplicationRecord
    has_many :comments
    has_many :liked_hikes
    has_many :users, through: :liked_hikes
    belongs_to :user
end
