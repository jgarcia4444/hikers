class Hike < ApplicationRecord
    has_many :comments, dependent: :destroy
    has_many :liked_hikes, dependent: :destroy
    has_many :users, through: :liked_hikes , dependent: :destroy
    belongs_to :user
end
