class AddUserIdToHikes < ActiveRecord::Migration[6.0]
  def change
    add_column :hikes, :user_id, :integer
  end
end
