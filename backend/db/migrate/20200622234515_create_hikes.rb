class CreateHikes < ActiveRecord::Migration[6.0]
  def change
    create_table :hikes do |t|
      t.string :sharer_name
      t.string :hike_name
      t.string :img
      t.string :city
      t.string :state
      t.integer :duration
      t.integer :likes

      t.timestamps
    end
  end
end
