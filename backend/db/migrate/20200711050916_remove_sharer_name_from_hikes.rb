class RemoveSharerNameFromHikes < ActiveRecord::Migration[6.0]
  def change
    remove_column :hikes, :sharer_name
  end
end
