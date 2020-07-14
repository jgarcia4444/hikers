class User < ApplicationRecord
    has_secure_password
    has_many :comments
    has_many :hikes
    has_many :liked_hikes
    has_many :hikes, through: :liked_hikes
end
