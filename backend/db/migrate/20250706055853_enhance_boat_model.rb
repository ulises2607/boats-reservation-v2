class EnhanceBoatModel < ActiveRecord::Migration[8.0]
  def change
    add_column :boats, :boat_type, :string, null: false, default: 'motorboat'
    add_column :boats, :capacity, :integer, null: false, default: 4
    add_column :boats, :length, :decimal, precision: 5, scale: 2 # metros
    add_column :boats, :location, :string # puerto/marina
    add_column :boats, :latitude, :decimal, precision: 10, scale: 6
    add_column :boats, :longitude, :decimal, precision: 10, scale: 6
    add_column :boats, :amenities, :text # JSON de equipos incluidos
    add_column :boats, :minimum_rental_hours, :integer, default: 4
    add_column :boats, :hourly_rate, :decimal, precision: 8, scale: 2
    add_column :boats, :daily_rate, :decimal, precision: 8, scale: 2
    add_column :boats, :images, :text # JSON array de URLs de imágenes
    add_column :boats, :rating_average, :decimal, precision: 3, scale: 2, default: 0.0
    add_column :boats, :total_reviews, :integer, default: 0
    add_column :boats, :availability_status, :boolean, default: true
    
    # Índices para mejorar rendimiento
    add_index :boats, :boat_type
    add_index :boats, :location
    add_index :boats, :availability_status
    add_index :boats, [:latitude, :longitude]
    add_index :boats, :rating_average
  end
end
